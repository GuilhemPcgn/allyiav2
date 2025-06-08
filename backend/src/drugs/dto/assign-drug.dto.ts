import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class AssignDrugDto {
  @IsNotEmpty()
  @IsNumber()
  drugId: number;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsNotEmpty()
  @IsString()
  frequency: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
} 