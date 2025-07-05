import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaClient } from "../../../generated/prisma";
import {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  UserPermission,
  AssignPermissionDto,
  RemovePermissionDto,
} from "./permissions.types";

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Permission[]> {
    return (await (this.prisma as unknown as PrismaClient).permission.findMany({
      orderBy: { name: "asc" },
    })) as Permission[];
  }

  async findOne(id: string): Promise<Permission | null> {
    return (await (
      this.prisma as unknown as PrismaClient
    ).permission.findUnique({
      where: { id },
    })) as Permission | null;
  }

  async create(data: CreatePermissionDto): Promise<Permission> {
    return (await (this.prisma as unknown as PrismaClient).permission.create({
      data,
    })) as Permission;
  }

  async update(id: string, data: UpdatePermissionDto): Promise<Permission> {
    return (await (this.prisma as unknown as PrismaClient).permission.update({
      where: { id },
      data,
    })) as Permission;
  }

  async delete(id: string): Promise<Permission> {
    return (await (this.prisma as unknown as PrismaClient).permission.delete({
      where: { id },
    })) as Permission;
  }

  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    return (await (
      this.prisma as unknown as PrismaClient
    ).userPermission.findMany({
      where: { userId },
      include: {
        permission: true,
      },
      orderBy: { createdAt: "desc" },
    })) as UserPermission[];
  }

  async assignPermissions(
    data: AssignPermissionDto,
  ): Promise<UserPermission[]> {
    const { userId, permissionIds } = data;

    // Create user permissions (Prisma will handle duplicates)
    const userPermissions = await Promise.all(
      permissionIds.map((permissionId) =>
        (this.prisma as unknown as PrismaClient).userPermission.upsert({
          where: {
            userId_permissionId: {
              userId,
              permissionId,
            },
          },
          update: {},
          create: {
            userId,
            permissionId,
          },
          include: {
            permission: true,
          },
        }),
      ),
    );

    return userPermissions as UserPermission[];
  }

  async removePermissions(data: RemovePermissionDto): Promise<void> {
    const { userId, permissionIds } = data;

    await (this.prisma as unknown as PrismaClient).userPermission.deleteMany({
      where: {
        userId,
        permissionId: {
          in: permissionIds,
        },
      },
    });
  }

  async getAvailablePermissions(userId: string): Promise<Permission[]> {
    // Get all permissions that the user doesn't already have
    const userPermissions = await (
      this.prisma as unknown as PrismaClient
    ).userPermission.findMany({
      where: { userId },
      select: { permissionId: true },
    });

    const userPermissionIds = userPermissions.map((up) => up.permissionId);

    return (await (this.prisma as unknown as PrismaClient).permission.findMany({
      where: {
        id: {
          notIn: userPermissionIds,
        },
      },
      orderBy: { name: "asc" },
    })) as Permission[];
  }
}
