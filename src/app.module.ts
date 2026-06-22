import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { StudentsModule } from './students/students.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [UsersModule, BooksModule, StudentsModule, OrdersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
