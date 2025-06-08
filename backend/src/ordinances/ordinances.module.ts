import { Module } from '@nestjs/common';
import { OrdinancesController } from './ordinances.controller';
import { OrdinancesService } from './ordinances.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdinancesController],
  providers: [OrdinancesService],
})
export class OrdinancesModule {}
