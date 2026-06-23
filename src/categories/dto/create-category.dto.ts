import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Programming' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'programming' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Books about software development.' })
  @IsOptional()
  @IsString()
  description?: string;
}
