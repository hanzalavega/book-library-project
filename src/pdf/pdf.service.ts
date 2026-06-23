import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts } from 'pdf-lib';

type OrderPdfData = {
  id: number;
  issueDate: Date;
  returnDate: Date | null;
  status: string;
  student: {
    studentId: string;
    name: string;
    email: string;
    phone: string | null;
  };
  book: {
    title: string;
    isbn: string;
  };
};

@Injectable()
export class PdfService {
  async generateOrderPdf(order: OrderPdfData) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text: string, x: number, y: number, size = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
      });
    };

    page.drawText('Library Borrow / Order Receipt', {
      x: 50,
      y: 780,
      size: 20,
      font: boldFont,
    });

    drawText(`Order ID: ${order.id}`, 50, 735);
    drawText(`Status: ${order.status}`, 50, 710);
    drawText(`Issue Date: ${order.issueDate.toDateString()}`, 50, 685);
    drawText(
      `Return Date: ${order.returnDate ? order.returnDate.toDateString() : 'Not returned yet'}`,
      50,
      660,
    );

    page.drawText('Student', { x: 50, y: 615, size: 16, font: boldFont });
    drawText(`Student ID: ${order.student.studentId}`, 50, 590);
    drawText(`Name: ${order.student.name}`, 50, 565);
    drawText(`Email: ${order.student.email}`, 50, 540);
    drawText(`Phone: ${order.student.phone ?? 'N/A'}`, 50, 515);

    page.drawText('Book', { x: 50, y: 470, size: 16, font: boldFont });
    drawText(`Title: ${order.book.title}`, 50, 445);
    drawText(`ISBN: ${order.book.isbn}`, 50, 420);

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
