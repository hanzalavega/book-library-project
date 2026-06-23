import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpsertUserProfileDto } from './dto/upsert-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
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

    const data = await this.prisma.user.findMany({
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
      },
    });

    const total = await this.prisma.user.count();

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
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with id ${id} deleted successfully` };
  }

  async createProfile(id: number, profileDto: UpsertUserProfileDto) {
    await this.findOne(id);

    try {
      return await this.prisma.userProfile.create({
        data: {
          ...profileDto,
          userId: id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `User with id ${id} already has a profile`,
        );
      }

      throw error;
    }
  }

  async getProfile(id: number) {
    await this.findOne(id);

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: id },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user id ${id} was not found`);
    }

    return profile;
  }

  async updateProfile(id: number, profileDto: UpsertUserProfileDto) {
    await this.getProfile(id);

    return this.prisma.userProfile.update({
      where: { userId: id },
      data: profileDto,
    });
  }

  async deleteProfile(id: number) {
    await this.getProfile(id);
    await this.prisma.userProfile.delete({
      where: { userId: id },
    });

    return { message: `Profile for user id ${id} deleted successfully` };
  }

  async uploadProfileImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    await this.findOne(id);
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'library/users',
    );

    return this.prisma.user.update({
      where: { id },
      data: {
        profileImage: uploadResult.secure_url,
      },
      include: {
        profile: true,
      },
    });
  }

  private handleUniqueError(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A user with this email already exists');
    }
  }
}
