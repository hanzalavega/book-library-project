import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly pdfService: PdfService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // In this library app, an Order means one student borrowing one book.
    const order = await this.prisma.$transaction(
      async (tx) => {
        const student = await tx.student.findUnique({
          where: { id: createOrderDto.studentId },
        });

        if (!student) {
          throw new NotFoundException(
            `Student with id ${createOrderDto.studentId} was not found`,
          );
        }

        const book = await tx.book.findUnique({
          where: { id: createOrderDto.bookId },
        });

        if (!book) {
          throw new NotFoundException(
            `Book with id ${createOrderDto.bookId} was not found`,
          );
        }

        const stockUpdate = await tx.book.updateMany({
          where: {
            id: book.id,
            availableQuantity: {
              gt: 0,
            },
          },
          data: {
            availableQuantity: {
              decrement: 1,
            },
          },
        });

        if (stockUpdate.count === 0) {
          throw new BadRequestException('This book is currently out of stock');
        }

        return tx.order.create({
          data: {
            studentId: createOrderDto.studentId,
            bookId: createOrderDto.bookId,
            issueDate: createOrderDto.issueDate ?? new Date(),
            returnDate: createOrderDto.returnDate,
            status: OrderStatus.BORROWED,
          },
          include: {
            student: true,
            book: true,
          },
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );

    void this.mailService.sendMail({
      to: order.student.email,
      subject: 'Book Borrow Confirmation',
      text: `Hi ${order.student.name}, you borrowed "${order.book.title}".`,
      html: `<p>Hi ${order.student.name},</p><p>You borrowed <strong>${order.book.title}</strong>.</p>`,
    });

    return order;
  }

  async findAll(page = 1, limit = 10) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);
    const skip = (safePage - 1) * safeLimit;

    const data = await this.prisma.order.findMany({
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        student: true,
        book: true,
      },
    });

    const total = await this.prisma.order.count();

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
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        student: true,
        book: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} was not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        student: true,
        book: true,
      },
    });
  }

  async returnBook(id: number) {
    return this.restoreStockAndChangeStatus(id, OrderStatus.RETURNED);
  }

  async cancel(id: number) {
    return this.restoreStockAndChangeStatus(id, OrderStatus.CANCELLED);
  }

  async generatePdf(id: number) {
    const order = await this.findOne(id);
    return this.pdfService.generateOrderPdf(order);
  }

  async sendPdfEmail(id: number) {
    const order = await this.findOne(id);
    const pdfBuffer = await this.pdfService.generateOrderPdf(order);

    await this.mailService.sendMail({
      to: order.student.email,
      subject: `Borrow Receipt #${order.id}`,
      text: `Hi ${order.student.name}, your borrow receipt is attached.`,
      html: `<p>Hi ${order.student.name},</p><p>Your borrow receipt is attached.</p>`,
      attachments: [
        {
          filename: `borrow-order-${order.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return { message: `PDF email attempted for order id ${id}` };
  }

  private async restoreStockAndChangeStatus(
    id: number,
    nextStatus: OrderStatus,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id },
          include: {
            book: true,
          },
        });

        if (!order) {
          throw new NotFoundException(`Order with id ${id} was not found`);
        }

        if (order.status !== OrderStatus.BORROWED) {
          throw new BadRequestException(
            `Only BORROWED orders can be marked as ${nextStatus}`,
          );
        }

        if (order.book.availableQuantity >= order.book.stockQuantity) {
          throw new BadRequestException(
            'Book stock is already full, so stock cannot be restored again',
          );
        }

        const orderUpdate = await tx.order.updateMany({
          where: {
            id,
            status: OrderStatus.BORROWED,
          },
          data: {
            status: nextStatus,
          },
        });

        if (orderUpdate.count === 0) {
          throw new BadRequestException(
            `Only BORROWED orders can be marked as ${nextStatus}`,
          );
        }

        await tx.book.update({
          where: { id: order.bookId },
          data: {
            availableQuantity: {
              increment: 1,
            },
          },
        });

        return tx.order.findUnique({
          where: { id },
          include: {
            student: true,
            book: true,
          },
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );
  }
}
