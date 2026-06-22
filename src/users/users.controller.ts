import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsersByQuery(
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('role') role?: 'admin' | 'intern' | 'engineer',
  ) {
    let usersToServe = this.usersService.getAllUsers();

    if (role) {
      usersToServe = usersToServe.filter((user) => user.role === role);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    usersToServe = usersToServe.slice(startIndex, endIndex);

    return usersToServe;
  }

  @Get('intern')
  getAllInterns() {
    return this.usersService
      .getAllUsers()
      .filter((user) => user.role === 'intern');
  }

  @Get(':id')
  getAllInternsWithId(@Param('id', ParseIntPipe) iddd: number) {
    return this.usersService.getAllUsers().filter((user) => user.id === iddd);
  }

  @Post()
  createUser(@Body() user: {}) {
    return user;
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dataToBeUpdated: {},
  ) {
    return { id, dataToBeUpdated };
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }
}
