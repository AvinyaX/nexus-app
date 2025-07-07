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
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      return await this.companiesService.create(createCompanyDto);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create company',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.companiesService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch companies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const company = await this.companiesService.findOne(id);
      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      return company;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.companiesService.update(id, updateCompanyDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update company',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.companiesService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete company',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}