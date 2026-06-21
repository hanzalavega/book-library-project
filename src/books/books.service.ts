import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  getAllBooks() {
    return 'all books...$$$';
  }

  getSingleBook() {
    return 'single book served';
  }
}
