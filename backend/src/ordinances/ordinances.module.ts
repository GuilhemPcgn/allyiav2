import { Module } from '@nestjs/common';
import { OrdinancesController } from './ordinances.controller';
import { OrdinancesService } from './ordinances.service';

@Module({
  controllers: [OrdinancesController],
  providers: [OrdinancesService],
})
export class OrdinancesModule {}
