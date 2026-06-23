import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const imageUploadOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE ?? 2 * 1024 * 1024),
  },
  fileFilter: (
    _request: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedImageMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only JPG, PNG, and WEBP images are allowed'),
        false,
      );
    }

    callback(null, true);
  },
};

export const imageUploadApiBody = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: ['file'],
  },
};
