import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Ordinance } from '@prisma/client';

@Injectable()
export class OrdinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromUpload(
    file: Express.Multer.File,
  ): Promise<{ ordinance: Ordinance; medications: string[] }> {
    const recognizedText = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ');

    const ordinance = await this.prisma.ordinance.create({
      data: {
        user_id: 1,
        date: new Date(),
        doctor: 'Inconnu',
        scan_file: file.path,
        text_analysis: recognizedText,
      },
    });

    const medications = recognizedText.split(/\s+/).filter((n) => n.length > 0);
    return { ordinance, medications };
  }
}
