import { IsDateString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
