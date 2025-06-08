import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseIntPipe,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdinancesService } from './ordinances.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('ordinances')
export class OrdinancesController {
  constructor(private readonly ordinancesService: OrdinancesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
          return cb(new BadRequestException('Seuls les fichiers JPEG et PNG sont acceptés'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Aucun fichier n\'a été uploadé');
      }

      const result = await this.ordinancesService.processUpload(file.path, userId);
      
      if (!result.drugs || !Array.isArray(result.drugs)) {
        throw new InternalServerErrorException('Format de réponse invalide');
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors du traitement de l\'ordonnance');
    }
  }
}
