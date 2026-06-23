import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { StudentsModule } from './students/students.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    BooksModule,
    StudentsModule,
    OrdersModule,
    CategoriesModule,
    AuthorsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
