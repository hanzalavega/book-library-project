import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'STU-1001' })
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'Rahim Uddin' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'rahim@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+8801711111111' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://example.com/student.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}
