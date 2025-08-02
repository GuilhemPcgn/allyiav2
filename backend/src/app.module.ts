import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { DrugsModule } from './drugs/drugs.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { OrdinancesModule } from './ordinances/ordinances.module';
import { OcrModule } from './ocr/ocr.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, DrugsModule, PharmaciesModule, OrdinancesModule, OcrModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
