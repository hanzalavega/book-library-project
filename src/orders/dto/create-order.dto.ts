import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  studentId: number;

  @IsInt()
  bookId: number;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
