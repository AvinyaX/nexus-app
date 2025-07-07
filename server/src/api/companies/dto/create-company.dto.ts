import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsJSON } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsJSON()
  settings?: any;

  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}