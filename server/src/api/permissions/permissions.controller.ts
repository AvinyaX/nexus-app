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
import { PermissionsService } from "./permissions.service";
import {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  UserPermission,
  AssignPermissionDto,
  RemovePermissionDto,
} from "./permissions.types";

@Controller("api/acl/permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Permission | null> {
    return this.permissionsService.findOne(id);
  }

  @Post()
  async create(@Body() data: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(data);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.update(id, data);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    await this.permissionsService.delete(id);
  }

  // User-Permission management
  @Get("user/:userId")
  async getUserPermissions(
    @Param("userId") userId: string,
  ): Promise<UserPermission[]> {
    return this.permissionsService.getUserPermissions(userId);
  }

  @Post("user/assign")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignUserPermission(@Body() data: AssignPermissionDto): Promise<void> {
    await this.permissionsService.assignPermissions(data);
  }

  @Post("user/remove")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserPermission(@Body() data: RemovePermissionDto): Promise<void> {
    await this.permissionsService.removePermissions(data);
  }
}

// Additional controller for IAM demo compatibility
@Controller("api/acl")
export class AclPermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post("permission")
  async createPermission(
    @Body() data: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(data);
  }

  // User permission management for IAM demo
  @Get("user-permissions/:userId")
  async getUserPermissions(
    @Param("userId") userId: string,
  ): Promise<Permission[]> {
    const userPermissions =
      await this.permissionsService.getUserPermissions(userId);
    return userPermissions.map((up) => up.permission);
  }

  @Post("assign-user-permission")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignUserPermission(
    @Body() data: { userId: string; permissionId?: string; permissionIds?: string[] },
  ): Promise<void> {
    const permissionIds = data.permissionIds || (data.permissionId ? [data.permissionId] : []);
    await this.permissionsService.assignPermissions({
      userId: data.userId,
      permissionIds,
    });
  }

  @Post("remove-user-permission")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserPermission(
    @Body() data: { userId: string; permissionId?: string; permissionIds?: string[] },
  ): Promise<void> {
    const permissionIds = data.permissionIds || (data.permissionId ? [data.permissionId] : []);
    await this.permissionsService.removePermissions({
      userId: data.userId,
      permissionIds,
    });
  }
}
