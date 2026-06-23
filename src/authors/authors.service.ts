import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createSlug } from '../common/utils/slug.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const slug = createAuthorDto.slug ?? createSlug(createAuthorDto.name);

    try {
      return await this.prisma.author.create({
        data: {
          ...createAuthorDto,
          slug,
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

    const data = await this.prisma.author.findMany({
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    const total = await this.prisma.author.count();

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
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} was not found`);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id);
    const slug = updateAuthorDto.slug
      ? updateAuthorDto.slug
      : updateAuthorDto.name
        ? createSlug(updateAuthorDto.name)
        : undefined;

    try {
      return await this.prisma.author.update({
        where: { id },
        data: {
          ...updateAuthorDto,
          ...(slug ? { slug } : {}),
        },
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.author.delete({
      where: { id },
    });

    return { message: `Author with id ${id} deleted successfully` };
  }

  private handleUniqueError(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('An author with this slug already exists');
    }
  }
}
