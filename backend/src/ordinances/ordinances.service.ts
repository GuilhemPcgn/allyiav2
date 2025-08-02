import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import * as Tesseract from 'tesseract.js';
// import { OpenAI } from '@langchain/openai';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { RunnableSequence } from '@langchain/core/runnables';
import { tmpdir } from 'os';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class OrdinancesService {
  constructor(private prisma: PrismaService) { }

  private findSimilarDrugs(text: string, drugs: any[]): any[] {
    const found: any[] = [];
    const words = text.toLowerCase().split(/\s+/);
    
    for (const drug of drugs) {
      const drugName = drug.name.toLowerCase();
      
      // Vérifier si le nom du médicament est présent dans le texte
      if (words.some(word => {
        // Ignorer les mots trop courts
        if (word.length < 3) return false;
        // Vérifier si le mot est contenu dans le nom du médicament ou vice versa
        return drugName.includes(word) || word.includes(drugName);
      })) {
        if (!found.some(d => d.id === drug.id)) {
          found.push(drug);
        }
      }
    }
    
    return found;
  }

  async processUpload(filePath: string, userId: number) {
    try {
      console.log('Début du traitement de l\'ordonnance:', filePath);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Fichier non trouvé: ${filePath}`);
      }

      // Utiliser directement Tesseract sans prétraitement OpenCV
      // const result = await Tesseract.recognize(filePath, 'fra', {
      //   logger: m => console.log(m)
      // });
      // console.log('Texte extrait:', result.data.text);
      
      // const text = result.data.text;
      // const analysis = await this.analyzeText(text);
      // console.log('Analyse du texte:', analysis);

      // const drugs = await this.prisma.drug.findMany();
      // console.log('Nombre de médicaments trouvés:', drugs.length);

      // const found = this.findSimilarDrugs(text, drugs);
      // console.log('Médicaments détectés:', found.length);

      // const ordinance = await this.prisma.ordinance.create({
      //   data: {
      //     user_id: userId,
      //     date: new Date(),
      //     doctor: 'Inconnu',
      //     scan_file: filePath,
      //     text_analysis: analysis,
      //   },
      // });
      // console.log('Ordonnance créée:', ordinance.id);

      // for (const drug of found) {
      //   await this.prisma.prescription.create({
      //     data: {
      //       ordinance_id: ordinance.id,
      //       drug_id: drug.id,
      //       posology: '',
      //       time_lenght: '',
      //     },
      //   });
      // }
      // console.log('Prescriptions créées');

      // return { ordinanceId: ordinance.id, drugs: found, analysis };
    } catch (error) {
      console.error('Erreur dans processUpload:', error);
      throw new InternalServerErrorException(
        `Erreur lors du traitement de l'ordonnance: ${error.message}`
      );
    }
  }

  private async analyzeText(text: string): Promise<string> {
    try {
      // if (!process.env.OPENAI_API_KEY) {
      //   console.log('Pas de clé API OpenAI, retour du texte brut');
      //   return text;
      // }

      // const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
      // const prompt = new PromptTemplate({
      //   template: 'Analyse cette ordonnance et renvoie un JSON des médicaments et posologies:\n{input}',
      //   inputVariables: ['input'],
      // });

      // const chain = RunnableSequence.from([prompt, model]);
      // const result = await chain.invoke({ input: text });
      // console.log('Analyse OpenAI terminée');
      
      // return typeof result === 'string' ? result : text;
    } catch (error) {
      console.error('Erreur dans analyzeText:', error);
      return text; // En cas d'erreur, retourner le texte brut
    }
    return text;
  }
}
