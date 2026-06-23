import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBookDto {
  @ApiPropertyOptional({ example: 'Clean Code' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'clean-code' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: '9780132350884' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ example: 'A handbook of agile software craftsmanship.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsInt()
  @Min(0)
  availableQuantity?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  authorIds?: number[];
}
