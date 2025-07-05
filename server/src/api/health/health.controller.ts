import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { Health, CreateHealthDto, UpdateHealthDto } from './health.types';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  findAll(): Health[] {
    return this.healthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Health {
    const health = this.healthService.findOne(id);
    if (!health) throw new NotFoundException('Health not found');
    return health;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateHealthDto): Health {
    return this.healthService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHealthDto): Health {
    const health = this.healthService.update(id, dto);
    if (!health) throw new NotFoundException('Health not found');
    return health;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    const deleted = this.healthService.delete(id);
    if (!deleted) throw new NotFoundException('Health not found');
  }
}
