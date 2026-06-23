import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MailModule } from '../mail/mail.module';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [CloudinaryModule, MailModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
