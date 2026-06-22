import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Rahim Ahmed',
      email: 'rahim.ahmed@example.com',
      role: 'intern',
      department: 'Frontend',
      isActive: true,
    },
    {
      id: 2,
      name: 'Sara Khan',
      email: 'sara.khan@example.com',
      role: 'engineer',
      department: 'Backend',
      isActive: true,
    },
    {
      id: 3,
      name: 'Imran Hossain',
      email: 'imran.hossain@example.com',
      role: 'admin',
      department: 'Operations',
      isActive: true,
    },
    {
      id: 4,
      name: 'Nadia Islam',
      email: 'nadia.islam@example.com',
      role: 'engineer',
      department: 'QA',
      isActive: false,
    },
    {
      id: 5,
      name: 'Tanvir Hasan',
      email: 'tanvir.hasan@example.com',
      role: 'intern',
      department: 'Design',
      isActive: true,
    },
    {
      id: 6,
      name: 'Farhan Ali',
      email: 'farhan.ali@example.com',
      role: 'engineer',
      department: 'DevOps',
      isActive: true,
    },
  ];
  getAllUsers(): any {
    return this.users;
  }
}
