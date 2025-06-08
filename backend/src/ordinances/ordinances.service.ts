import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Tesseract from 'tesseract.js';
import * as cv from '@techstark/opencv-js';
import Fuse from 'fuse.js';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { tmpdir } from 'os';
import { join } from 'path';

@Injectable()
export class OrdinancesService {
  constructor(private prisma: PrismaService) {}

  async processUpload(filePath: string, userId: number) {
    const processedPath = this.preprocessImage(filePath);
    const result = await Tesseract.recognize(processedPath, 'fra');
    const text = result.data.text;
    const analysis = await this.analyzeText(text);

    const drugs = await this.prisma.drug.findMany();
    const fuse = new Fuse(drugs, { keys: ['name'], threshold: 0.4 });
    const found: typeof drugs = [];
    for (const word of text.split(/\s+/)) {
      const res = fuse.search(word);
      if (res[0] && !found.some((d) => d.id === res[0].item.id)) {
        found.push(res[0].item);
      }
    }

    const ordinance = await this.prisma.ordinance.create({
      data: {
        user_id: userId,
        date: new Date(),
        doctor: 'Inconnu',
        scan_file: filePath,
        text_analysis: analysis,
      },
    });

    for (const drug of found) {
      await this.prisma.prescription.create({
        data: {
          ordinance_id: ordinance.id,
          drug_id: drug.id,
          posology: '',
          time_lenght: '',
        },
      });
    }

    return { ordinanceId: ordinance.id, drugs: found, analysis };
  }

  private preprocessImage(filePath: string): string {
    const src = cv.imread(filePath);
    cv.cvtColor(src, src, cv.COLOR_BGR2GRAY);
    cv.threshold(src, src, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    const outPath = join(tmpdir(), `processed_${Date.now()}.png`);
    cv.imwrite(outPath, src);
    return outPath;
  }

  private async analyzeText(text: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) return text;
    const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
    const prompt = new PromptTemplate({
      template:
        'Analyse cette ordonnance et renvoie un JSON des médicaments et posologies:\n{input}',
      inputVariables: ['input'],
    });
    const chain = new LLMChain({ llm: model, prompt });
    const result = await chain.call({ input: text });
    return result.text || text;
  }
}
