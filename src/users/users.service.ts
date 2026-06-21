import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  users: [
    {
      id: 1;
      name: 'Rahim Ahmed';
      email: 'rahim.ahmed@example.com';
      role: 'member';
      membershipStatus: 'active';
      borrowedBooks: 2;
    },
    {
      id: 2;
      name: 'Sara Khan';
      email: 'sara.khan@example.com';
      role: 'member';
      membershipStatus: 'active';
      borrowedBooks: 0;
    },
    {
      id: 3;
      name: 'Imran Hossain';
      email: 'imran.hossain@example.com';
      role: 'librarian';
      membershipStatus: 'active';
      borrowedBooks: 0;
    },
    {
      id: 4;
      name: 'Nadia Islam';
      email: 'nadia.islam@example.com';
      role: 'member';
      membershipStatus: 'inactive';
      borrowedBooks: 1;
    },
    {
      id: 5;
      name: 'Tanvir Hasan';
      email: 'tanvir.hasan@example.com';
      role: 'member';
      membershipStatus: 'active';
      borrowedBooks: 3;
    },
  ];

  getAllUsers(): any {
    return this.users;
  }

  getSingleUser() {
    return 'single user data!!!...!!!';
  }
}
