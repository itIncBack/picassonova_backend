import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@settings/multer-config';

export function createFilesInterceptor(fieldName: string, maxCount: number) {
  return FilesInterceptor(fieldName, maxCount, multerConfig);
}
