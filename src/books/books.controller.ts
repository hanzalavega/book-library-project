import { Controller, Get, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks() {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  getSingleBook(@Param('id') id: string) {
    console.log(id);
    return this.booksService.getSingleBook(+id);
  }

  @Post()
  setBook() {
    return 'Book item Added';
  }
}
