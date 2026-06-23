import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { createSlug } from '../common/utils/slug.util';
import { PrismaService } from '../prisma/prisma.service';
import { BookSearchQueryDto } from './dto/book-search-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const { authorIds, ...bookData } = createBookDto;
    const uniqueAuthorIds = authorIds ? [...new Set(authorIds)] : undefined;
    const availableQuantity =
      createBookDto.availableQuantity ?? createBookDto.stockQuantity;
    const slug = createBookDto.slug ?? createSlug(createBookDto.title);

    if (availableQuantity > createBookDto.stockQuantity) {
      throw new BadRequestException(
        'availableQuantity cannot be greater than stockQuantity',
      );
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          await this.ensureCategoryExists(bookData.categoryId, tx);
          await this.ensureAuthorsExist(uniqueAuthorIds, tx);

          return tx.book.create({
            data: {
              ...bookData,
              slug,
              availableQuantity,
              authors: uniqueAuthorIds?.length
                ? {
                    create: uniqueAuthorIds.map((authorId) => ({
                      authorId,
                    })),
                  }
                : undefined,
            },
            include: this.bookInclude,
          });
        },
        {
          maxWait: 10000,
          timeout: 20000,
        },
      );
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, filters: BookSearchQueryDto = {}) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);
    const skip = (safePage - 1) * safeLimit;
    const where = this.buildBookWhere(filters);

    const data = await this.prisma.book.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: this.bookInclude,
    });

    const total = await this.prisma.book.count({ where });

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
      include: this.bookInclude,
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} was not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = await this.findOne(id);
    const { authorIds, ...bookData } = updateBookDto;
    const uniqueAuthorIds = authorIds ? [...new Set(authorIds)] : undefined;
    const nextStockQuantity =
      updateBookDto.stockQuantity ?? existingBook.stockQuantity;
    const nextAvailableQuantity =
      updateBookDto.availableQuantity ?? existingBook.availableQuantity;
    const slug = updateBookDto.slug
      ? updateBookDto.slug
      : updateBookDto.title
        ? createSlug(updateBookDto.title)
        : undefined;

    if (nextAvailableQuantity > nextStockQuantity) {
      throw new BadRequestException(
        'availableQuantity cannot be greater than stockQuantity',
      );
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          await this.ensureCategoryExists(bookData.categoryId, tx);
          await this.ensureAuthorsExist(uniqueAuthorIds, tx);

          if (uniqueAuthorIds) {
            await tx.bookAuthor.deleteMany({
              where: { bookId: id },
            });
          }

          return tx.book.update({
            where: { id },
            data: {
              ...bookData,
              ...(slug ? { slug } : {}),
              authors: uniqueAuthorIds
                ? {
                    create: uniqueAuthorIds.map((authorId) => ({
                      authorId,
                    })),
                  }
                : undefined,
            },
            include: this.bookInclude,
          });
        },
        {
          maxWait: 10000,
          timeout: 20000,
        },
      );
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

  async uploadCoverImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    await this.findOne(id);
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'library/books',
    );

    return this.prisma.book.update({
      where: { id },
      data: {
        coverImage: uploadResult.secure_url,
      },
      include: this.bookInclude,
    });
  }

  async findBorrowedStudents(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        authors: {
          include: {
            author: true,
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            student: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} was not found`);
    }

    return book;
  }

  private handleUniqueError(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'A book with this ISBN or slug already exists',
      );
    }
  }

  private readonly bookInclude = {
    category: true,
    authors: {
      include: {
        author: true,
      },
    },
  } satisfies Prisma.BookInclude;

  private buildBookWhere(filters: BookSearchQueryDto): Prisma.BookWhereInput {
    const where: Prisma.BookWhereInput = {};

    if (filters.title) {
      where.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }

    if (filters.isbn) {
      where.isbn = {
        contains: filters.isbn,
        mode: 'insensitive',
      };
    }

    if (filters.availability === 'available') {
      where.availableQuantity = { gt: 0 };
    }

    if (filters.availability === 'unavailable') {
      where.availableQuantity = 0;
    }

    if (filters.stockStatus === 'in_stock') {
      where.availableQuantity = { gt: 0 };
    }

    if (filters.stockStatus === 'out_of_stock') {
      where.availableQuantity = 0;
    }

    if (filters.stockStatus === 'low') {
      where.availableQuantity = {
        gt: 0,
        lte: 3,
      };
    }

    if (filters.category) {
      where.category = {
        is: {
          OR: [
            {
              name: {
                contains: filters.category,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: filters.category,
                mode: 'insensitive',
              },
            },
          ],
        },
      };
    }

    if (filters.author) {
      where.authors = {
        some: {
          author: {
            name: {
              contains: filters.author,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    return where;
  }

  private async ensureCategoryExists(
    categoryId: number | undefined,
    tx: Prisma.TransactionClient,
  ) {
    if (!categoryId) {
      return;
    }

    const category = await tx.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${categoryId} was not found`,
      );
    }
  }

  private async ensureAuthorsExist(
    authorIds: number[] | undefined,
    tx: Prisma.TransactionClient,
  ) {
    if (!authorIds?.length) {
      return;
    }

    const uniqueAuthorIds = [...new Set(authorIds)];
    const totalAuthors = await tx.author.count({
      where: {
        id: {
          in: uniqueAuthorIds,
        },
      },
    });

    if (totalAuthors !== uniqueAuthorIds.length) {
      throw new NotFoundException('One or more authors were not found');
    }
  }
}
