import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  books = [
    {
      id: 1,
      name: 'The Silent Library',
      author: 'Emma Hart',
      category: 'Mystery',
      isbn: '978-1-23456-001-1',
      availableCopies: 4,
    },
    {
      id: 2,
      name: 'Learning JavaScript',
      author: 'David Miller',
      category: 'Programming',
      isbn: '978-1-23456-002-8',
      availableCopies: 7,
    },
    {
      id: 3,
      name: 'History of Ancient Worlds',
      author: 'Sarah Collins',
      category: 'History',
      isbn: '978-1-23456-003-5',
      availableCopies: 2,
    },
    {
      id: 4,
      name: 'The Science of Space',
      author: 'Noah Bennett',
      category: 'Science',
      isbn: '978-1-23456-004-2',
      availableCopies: 5,
    },
    {
      id: 5,
      name: 'Stories for Young Readers',
      author: 'Lily Adams',
      category: 'Children',
      isbn: '978-1-23456-005-9',
      availableCopies: 10,
    },
  ];

  getAllBooks() {
    return this.books;
  }

  getSingleBook(id: number) {
    return this.books.find((item) => item.id === id);
  }
}
