import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: '2026-06-23T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2026-07-07T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
