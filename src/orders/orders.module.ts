import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { PdfModule } from '../pdf/pdf.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [MailModule, PdfModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
