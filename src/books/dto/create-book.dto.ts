import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  isbn: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  availableQuantity?: number;
}
