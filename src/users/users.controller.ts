import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'All users returned';
  }

  @Get('single')
  getSingleUser(): string {
    return 'Single User';
  }
}
