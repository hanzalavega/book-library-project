import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class BookSearchQueryDto {
  @ApiPropertyOptional({ example: 'clean' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'martin' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: '9780132350884' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ example: 'available', enum: ['available', 'unavailable'] })
  @IsOptional()
  @IsIn(['available', 'unavailable'])
  availability?: 'available' | 'unavailable';

  @ApiPropertyOptional({ example: 'low', enum: ['in_stock', 'out_of_stock', 'low'] })
  @IsOptional()
  @IsIn(['in_stock', 'out_of_stock', 'low'])
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low';

  @ApiPropertyOptional({ example: 'programming' })
  @IsOptional()
  @IsString()
  category?: string;
}
