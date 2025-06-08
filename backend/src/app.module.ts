import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { DrugsModule } from './drugs/drugs.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';

@Module({
  imports: [
    PrismaModule,
    DrugsModule,
    PharmaciesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
