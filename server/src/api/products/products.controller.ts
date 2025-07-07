import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CompanyAccessGuard } from '../../common/guards/company-access.guard';
import { CompanyContextService } from '../../services/company-context.service';

@Controller('api/products')
@UseGuards(JwtAuthGuard, CompanyAccessGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly companyContextService: CompanyContextService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const companyId = await this.companyContextService.getCompanyId();
      return await this.productsService.create(companyId, createProductDto);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    try {
      const companyId = await this.companyContextService.getCompanyId();
      const filters = {
        categoryId,
        isActive: isActive ? isActive === 'true' : undefined,
        search,
      };
      return await this.productsService.findAll(companyId, filters);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const companyId = await this.companyContextService.getCompanyId();
      const product = await this.productsService.findOne(companyId, id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const companyId = await this.companyContextService.getCompanyId();
      return await this.productsService.update(companyId, id, updateProductDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const companyId = await this.companyContextService.getCompanyId();
      return await this.productsService.remove(companyId, id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}