import { IsString, IsOptional, IsArray } from "class-validator";

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateRoleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignRoleDto {
  @IsString()
  userId!: string;

  @IsString()
  roleId!: string;
}

export class RemoveRoleDto {
  @IsString()
  userId!: string;

  @IsString()
  roleId!: string;
}

export class AssignRolePermissionsDto {
  @IsString()
  roleId!: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds!: string[];
}

export class RemoveRolePermissionsDto {
  @IsString()
  roleId!: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds!: string[];
}
