import { Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks() {
    return this.booksService.getAllBooks();
  }

  @Get('single')
  getSingleBook() {
    return this.booksService.getSingleBook();
  }

  @Post()
  setBook() {
    return 'Book item Added';
  }
}
