import { IsString, IsOptional, IsArray } from "class-validator";

export interface Permission {
  id: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePermissionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  resource!: string;

  @IsString()
  action!: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  resource?: string;

  @IsOptional()
  @IsString()
  action?: string;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  createdAt: Date;
  permission: Permission;
}

export class AssignPermissionDto {
  @IsString()
  userId!: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds!: string[];
}

export class RemovePermissionDto {
  @IsString()
  userId!: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds!: string[];
}
