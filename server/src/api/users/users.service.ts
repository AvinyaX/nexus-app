import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaClient } from "../../../generated/prisma";
import { User, CreateUserDto, UpdateUserDto } from "./users.types";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await (this.prisma as unknown as PrismaClient).user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Transform to match frontend expectations
    return users.map((user) => ({
      ...user,
      role: user.userRoles.length > 0 ? user.userRoles[0].role : null,
    })) as User[];
  }

  async findOne(id: string): Promise<User | null> {
    const user = await (this.prisma as unknown as PrismaClient).user.findUnique(
      {
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          userRoles: {
            include: {
              role: true,
            },
          },
          userPermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    );

    if (!user) return null;

    // Transform to match frontend expectations
    return {
      ...user,
      role: user.userRoles.length > 0 ? user.userRoles[0].role : null,
    } as User;
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = await (this.prisma as unknown as PrismaClient).user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Transform to match frontend expectations
    return {
      ...user,
      role: user.userRoles.length > 0 ? user.userRoles[0].role : null,
    } as User;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await (this.prisma as unknown as PrismaClient).user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Transform to match frontend expectations
    return {
      ...user,
      role: user.userRoles.length > 0 ? user.userRoles[0].role : null,
    } as User;
  }

  async delete(id: string): Promise<User> {
    const user = await (this.prisma as unknown as PrismaClient).user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Transform to match frontend expectations
    return {
      ...user,
      role: user.userRoles.length > 0 ? user.userRoles[0].role : null,
    } as User;
  }
}
