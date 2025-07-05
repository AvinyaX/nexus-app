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
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
  RemoveRoleDto,
  AssignRolePermissionsDto,
  RemoveRolePermissionsDto,
} from "./roles.types";

@Controller("acl/roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get("role-permissions")
  async findAllWithPermissions(): Promise<any[]> {
    return this.rolesService.findAllWithPermissions();
  }

  @Get("user/:userId")
  async getUserRoles(@Param("userId") userId: string): Promise<Role[]> {
    return this.rolesService.getUserRoles(userId);
  }

  @Get(":roleId/permissions")
  async getRolePermissions(@Param("roleId") roleId: string): Promise<any[]> {
    return this.rolesService.getRolePermissions(roleId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Role | null> {
    return this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() data: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(data);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, data);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    await this.rolesService.delete(id);
  }

  // User-Role management
  @Post("user/assign")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRole(@Body() data: AssignRoleDto): Promise<void> {
    await this.rolesService.assignRole(data);
  }

  @Post("user/remove")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(@Body() data: RemoveRoleDto): Promise<void> {
    await this.rolesService.removeRole(data);
  }

  // Role-Permission management
  @Post("permissions/assign")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRolePermissions(
    @Body() data: AssignRolePermissionsDto,
  ): Promise<void> {
    await this.rolesService.assignRolePermissions(data);
  }

  @Post("permissions/remove")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRolePermissions(
    @Body() data: RemoveRolePermissionsDto,
  ): Promise<void> {
    await this.rolesService.removeRolePermissions(data);
  }
}

// Additional controller for IAM demo compatibility
@Controller("acl")
export class AclController {
  constructor(private readonly rolesService: RolesService) {}

  // Single role/permission assignment endpoints for IAM demo
  @Post("assign-role")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRole(@Body() data: AssignRoleDto): Promise<void> {
    await this.rolesService.assignRole(data);
  }

  @Post("remove-role")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(@Body() data: RemoveRoleDto): Promise<void> {
    await this.rolesService.removeRole(data);
  }

  @Post("assign-permission")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignPermission(
    @Body() data: { roleId: string; permissionId: string },
  ): Promise<void> {
    await this.rolesService.assignRolePermissions({
      roleId: data.roleId,
      permissionIds: [data.permissionId],
    });
  }

  @Post("remove-permission")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermission(
    @Body() data: { roleId: string; permissionId: string },
  ): Promise<void> {
    await this.rolesService.removeRolePermissions({
      roleId: data.roleId,
      permissionIds: [data.permissionId],
    });
  }

  @Get("user-roles/:userId")
  async getUserRoles(@Param("userId") userId: string): Promise<Role[]> {
    return this.rolesService.getUserRoles(userId);
  }

  @Get("role-permissions/:roleId")
  async getRolePermissions(@Param("roleId") roleId: string): Promise<any[]> {
    return this.rolesService.getRolePermissions(roleId);
  }
}
