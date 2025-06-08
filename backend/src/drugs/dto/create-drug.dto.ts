import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsNotEmpty()
  vidal_code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  side_effects?: string;
} 