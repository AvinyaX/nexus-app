import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      // Check if company code already exists
      const existingCompany = await this.prisma.company.findUnique({
        where: { code: createCompanyDto.code },
      });

      if (existingCompany) {
        throw new HttpException(
          'Company code already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.prisma.company.create({
        data: createCompanyDto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.company.findMany({
        orderBy: { name: 'asc' },
        include: {
          userCompanies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch companies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
        include: {
          userCompanies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      return company;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      // Check if company exists
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      // Check if new code conflicts (if code is being updated)
      if (updateCompanyDto.code && updateCompanyDto.code !== existingCompany.code) {
        const codeExists = await this.prisma.company.findUnique({
          where: { code: updateCompanyDto.code },
        });

        if (codeExists) {
          throw new HttpException(
            'Company code already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}