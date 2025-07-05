import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaClient } from "../../../generated/prisma";
import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
  RemoveRoleDto,
  AssignRolePermissionsDto,
  RemoveRolePermissionsDto,
} from "./roles.types";

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Role[]> {
    return (await (this.prisma as unknown as PrismaClient).role.findMany({
      orderBy: { name: "asc" },
    })) as Role[];
  }

  async findAllWithPermissions(): Promise<any[]> {
    return (await (this.prisma as unknown as PrismaClient).role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })) as any[];
  }

  async findOne(id: string): Promise<Role | null> {
    return (await (this.prisma as unknown as PrismaClient).role.findUnique({
      where: { id },
    })) as Role | null;
  }

  async create(data: CreateRoleDto): Promise<Role> {
    return (await (this.prisma as unknown as PrismaClient).role.create({
      data,
    })) as Role;
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    return (await (this.prisma as unknown as PrismaClient).role.update({
      where: { id },
      data,
    })) as Role;
  }

  async delete(id: string): Promise<Role> {
    return (await (this.prisma as unknown as PrismaClient).role.delete({
      where: { id },
    })) as Role;
  }

  // User-Role management
  async assignRole(data: AssignRoleDto): Promise<void> {
    await (this.prisma as unknown as PrismaClient).userRole.upsert({
      where: {
        userId_roleId: {
          userId: data.userId,
          roleId: data.roleId,
        },
      },
      update: {},
      create: {
        userId: data.userId,
        roleId: data.roleId,
      },
    });
  }

  async removeRole(data: RemoveRoleDto): Promise<void> {
    await (this.prisma as unknown as PrismaClient).userRole.delete({
      where: {
        userId_roleId: {
          userId: data.userId,
          roleId: data.roleId,
        },
      },
    });
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await (
      this.prisma as unknown as PrismaClient
    ).userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map((ur) => ur.role) as Role[];
  }

  // Role-Permission management
  async assignRolePermissions(data: AssignRolePermissionsDto): Promise<void> {
    await Promise.all(
      data.permissionIds.map((permissionId) =>
        (this.prisma as unknown as PrismaClient).rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: data.roleId,
              permissionId,
            },
          },
          update: {},
          create: {
            roleId: data.roleId,
            permissionId,
          },
        }),
      ),
    );
  }

  async removeRolePermissions(data: RemoveRolePermissionsDto): Promise<void> {
    await (this.prisma as unknown as PrismaClient).rolePermission.deleteMany({
      where: {
        roleId: data.roleId,
        permissionId: {
          in: data.permissionIds,
        },
      },
    });
  }

  async getRolePermissions(roleId: string): Promise<any[]> {
    const rolePermissions = await (
      this.prisma as unknown as PrismaClient
    ).rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
    return rolePermissions.map((rp) => rp.permission);
  }
}
