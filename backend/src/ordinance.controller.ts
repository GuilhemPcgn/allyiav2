import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OrdinanceService } from './ordinance.service';

function fileName(
  req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, uniqueSuffix + extname(file.originalname));
}

@Controller('ordinances')
export class OrdinanceController {
  constructor(private readonly ordinanceService: OrdinanceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads', filename: fileName }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.ordinanceService.createFromUpload(file);
    return result;
  }
}
