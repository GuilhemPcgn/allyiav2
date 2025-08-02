import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import axios from 'axios';
import * as fs from 'fs/promises';

@Controller('ocr')
export class OcrController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  }))
  async analyzePrescription(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier reçu');

    const imageBase64 = (await fs.readFile(file.path)).toString('base64');
    const apiKey = process.env.OPENAI_API_KEY;

    const prompt = `Voici une photo d'une ordonnance médicale française. Extrais la liste des médicaments et pour chacun, la posologie (dose, fréquence, durée si possible). Retourne un JSON du type: [{"medicament": "...", "posologie": "..."}]`;

    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ],
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const text = openaiRes.data.choices[0]?.message?.content || '';
    let result;
    try {
      result = JSON.parse(text.match(/\[.*\]/s)?.[0] || '[]');
    } catch {
      result = [];
    }

    await fs.unlink(file.path);

    return { medicaments: result, raw: text };
  }
} 