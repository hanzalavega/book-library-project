import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  imageUploadApiBody,
  imageUploadOptions,
} from '../common/file-upload/image-upload.utils';
import { BooksService } from './books.service';
import { BookSearchQueryDto } from './dto/book-search-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false, example: 'clean' })
  @ApiQuery({ name: 'author', required: false, example: 'martin' })
  @ApiQuery({ name: 'isbn', required: false, example: '9780132350884' })
  @ApiQuery({
    name: 'availability',
    required: false,
    enum: ['available', 'unavailable'],
  })
  @ApiQuery({
    name: 'stockStatus',
    required: false,
    enum: ['in_stock', 'out_of_stock', 'low'],
  })
  @ApiQuery({ name: 'category', required: false, example: 'programming' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query() filters: BookSearchQueryDto,
  ) {
    return this.booksService.findAll(page, limit, filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Get(':id/students')
  findBorrowedStudents(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findBorrowedStudents(id);
  }

  @Patch(':id/cover-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody(imageUploadApiBody)
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  uploadCoverImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.booksService.uploadCoverImage(id, file);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
