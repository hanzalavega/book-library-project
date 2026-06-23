import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createSlug } from '../common/utils/slug.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.slug ?? createSlug(createCategoryDto.name);

    try {
      return await this.prisma.category.create({
        data: {
          ...createCategoryDto,
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

    const data = await this.prisma.category.findMany({
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    const total = await this.prisma.category.count();

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
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} was not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    const slug = updateCategoryDto.slug
      ? updateCategoryDto.slug
      : updateCategoryDto.name
        ? createSlug(updateCategoryDto.name)
        : undefined;

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...updateCategoryDto,
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
    await this.prisma.category.delete({
      where: { id },
    });

    return { message: `Category with id ${id} deleted successfully` };
  }

  private handleUniqueError(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A category with this slug already exists');
    }
  }
}
