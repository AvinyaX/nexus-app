import { Injectable } from '@nestjs/common';
import { Health, CreateHealthDto, UpdateHealthDto } from './health.types';
import { randomUUID } from 'crypto';

@Injectable()
export class HealthService {
  private healths: Health[] = [];

  findAll(): Health[] {
    return this.healths;
  }

  findOne(id: string): Health | undefined {
    return this.healths.find((h) => h.id === id);
  }

  create(dto: CreateHealthDto): Health {
    const health: Health = {
      id: randomUUID(),
      ...dto,
    };
    this.healths.push(health);
    return health;
  }

  update(id: string, dto: UpdateHealthDto): Health | undefined {
    const health = this.findOne(id);
    if (health) {
      Object.assign(health, dto);
    }
    return health;
  }

  delete(id: string): boolean {
    const idx = this.healths.findIndex((h) => h.id === id);
    if (idx !== -1) {
      this.healths.splice(idx, 1);
      return true;
    }
    return false;
  }
}
