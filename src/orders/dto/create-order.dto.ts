import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  studentId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;

  @ApiPropertyOptional({ example: '2026-06-23T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2026-07-07T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
