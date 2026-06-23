import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Robert C. Martin' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'robert-c-martin' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Software engineer and author.' })
  @IsOptional()
  @IsString()
  bio?: string;
}
