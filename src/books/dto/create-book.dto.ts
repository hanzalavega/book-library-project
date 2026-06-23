import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'clean-code' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: '9780132350884' })
  @IsString()
  isbn: string;

  @ApiPropertyOptional({ example: 'A handbook of agile software craftsmanship.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiPropertyOptional({ example: 10 })
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
