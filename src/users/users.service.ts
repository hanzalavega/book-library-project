import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAllUsers(): string {
    return 'all users data....!!!';
  }

  getSingleUser(){
    return 'single user data!!!...!!!'
  }
}
