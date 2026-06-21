import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(@Query() query: any) {
    console.log(query);
    if (query.author && query.category) {
      return this.booksService
        .getAllBooks()
        .filter(
          (item) =>
            item.author === query.author && item.category === query.category,
        );
    }
    if (!query.author && !query.category) {
      return this.booksService.getAllBooks();
    }
    if (query.author) {
      return this.booksService
        .getAllBooks()
        .filter((item) => item.author === query.author);
    }
    if (query.category) {
      return this.booksService
        .getAllBooks()
        .filter((item) => item.category === query.category);
    }
  }

  @Get(':id')
  getSingleBook(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id, id);
    return this.booksService.getSingleBook(id);
  }

  @Post()
  setBook() {
    return 'Book item Added';
  }
}
