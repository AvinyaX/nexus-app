import { IsString, IsOptional, IsEmail } from "class-validator";

export interface Role {
  id: string;
  name: string;
  description?: string | null;
}

export interface Permission {
  id: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdAt: Date;
  role: Role;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  createdAt: Date;
  permission: Permission;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userRoles: UserRole[];
  userPermissions: UserPermission[];
}

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
