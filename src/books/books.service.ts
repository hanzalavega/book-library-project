import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const availableQuantity =
      createBookDto.availableQuantity ?? createBookDto.stockQuantity;

    if (availableQuantity > createBookDto.stockQuantity) {
      throw new BadRequestException(
        'availableQuantity cannot be greater than stockQuantity',
      );
    }

    try {
      return await this.prisma.book.create({
        data: {
          ...createBookDto,
          availableQuantity,
        },
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);
    const skip = (safePage - 1) * safeLimit;

    const data = await this.prisma.book.findMany({
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.book.count();

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} was not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = await this.findOne(id);
    const nextStockQuantity =
      updateBookDto.stockQuantity ?? existingBook.stockQuantity;
    const nextAvailableQuantity =
      updateBookDto.availableQuantity ?? existingBook.availableQuantity;

    if (nextAvailableQuantity > nextStockQuantity) {
      throw new BadRequestException(
        'availableQuantity cannot be greater than stockQuantity',
      );
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.book.delete({
      where: { id },
    });

    return { message: `Book with id ${id} deleted successfully` };
  }

  private handleUniqueError(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A book with this ISBN already exists');
    }
  }
}
