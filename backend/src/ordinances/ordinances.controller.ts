import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdinancesService } from './ordinances.service';

@Controller('api/ordinances')
export class OrdinancesController {
  constructor(private readonly ordinancesService: OrdinancesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: 'backend/uploads' }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.ordinancesService.processUpload(file.path, Number(userId));
  }
}
