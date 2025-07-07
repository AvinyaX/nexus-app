import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createProductDto: CreateProductDto) {
    try {
      // Check if SKU already exists for this company
      const existingProduct = await this.prisma.product.findUnique({
        where: {
          companyId_sku: {
            companyId,
            sku: createProductDto.sku,
          },
        },
      });

      if (existingProduct) {
        throw new HttpException(
          'Product SKU already exists for this company',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate category if provided
      if (createProductDto.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: createProductDto.categoryId },
        });

        if (!category || category.companyId !== companyId) {
          throw new HttpException(
            'Invalid category for this company',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          companyId,
        },
        include: {
          category: true,
        },
      });

      // Create initial inventory item
      await this.prisma.inventoryItem.create({
        data: {
          companyId,
          productId: product.id,
          location: 'main',
          quantity: 0,
          reservedQty: 0,
          reorderLevel: 0,
        },
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(companyId: string, filters: any = {}) {
    try {
      const where: any = {
        companyId,
      };

      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      return await this.prisma.product.findMany({
        where,
        include: {
          category: true,
          inventoryItems: {
            select: {
              location: true,
              quantity: true,
              reservedQty: true,
              reorderLevel: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(companyId: string, id: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          id,
          companyId,
        },
        include: {
          category: true,
          inventoryItems: {
            select: {
              location: true,
              quantity: true,
              reservedQty: true,
              reorderLevel: true,
            },
          },
        },
      });

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(companyId: string, id: string, updateProductDto: UpdateProductDto) {
    try {
      // Check if product exists and belongs to company
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          id,
          companyId,
        },
      });

      if (!existingProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      // Check if new SKU conflicts (if SKU is being updated)
      if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
        const skuExists = await this.prisma.product.findUnique({
          where: {
            companyId_sku: {
              companyId,
              sku: updateProductDto.sku,
            },
          },
        });

        if (skuExists) {
          throw new HttpException(
            'Product SKU already exists for this company',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Validate category if provided
      if (updateProductDto.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: updateProductDto.categoryId },
        });

        if (!category || category.companyId !== companyId) {
          throw new HttpException(
            'Invalid category for this company',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
          inventoryItems: {
            select: {
              location: true,
              quantity: true,
              reservedQty: true,
              reorderLevel: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(companyId: string, id: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          id,
          companyId,
        },
      });

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}