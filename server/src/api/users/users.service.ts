import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClient } from '@prisma/index';
import { User, CreateUserDto, UpdateUserDto } from './users.types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return (await (this.prisma as unknown as PrismaClient).user.findMany({
      select: { id: true, email: true, name: true },
    })) as User[];
  }

  async findOne(id: string): Promise<User | null> {
    return (await (this.prisma as unknown as PrismaClient).user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    })) as User | null;
  }

  async create(data: CreateUserDto): Promise<User> {
    return (await (this.prisma as unknown as PrismaClient).user.create({
      data,
      select: { id: true, email: true, name: true },
    })) as User;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return (await (this.prisma as unknown as PrismaClient).user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true },
    })) as User;
  }

  async delete(id: string): Promise<User> {
    return (await (this.prisma as unknown as PrismaClient).user.delete({
      where: { id },
      select: { id: true, email: true, name: true },
    })) as User;
  }
}
