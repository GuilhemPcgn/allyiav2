import { Controller, Get } from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';

@Controller('api/pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Get()
  async findAll() {
    return this.pharmaciesService.findAll();
  }
} 