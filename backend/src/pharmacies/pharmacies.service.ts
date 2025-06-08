import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PharmaciesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Pour l'instant, retournons des données mockées car nous n'avons pas encore de table Pharmacy
    return [
      {
        id: "1",
        name: "Pharmacie du Centre",
        address: "123 rue de Paris",
        distance: "500m",
        isOpen: true,
        position: { lat: 48.8566, lng: 2.3522 },
        rating: 4.5,
        reviewCount: 127,
        hours: {
          lundi: { open: "09:00", close: "19:30" },
          mardi: { open: "09:00", close: "19:30" },
          mercredi: { open: "09:00", close: "19:30" },
          jeudi: { open: "09:00", close: "19:30" },
          vendredi: { open: "09:00", close: "19:30" },
          samedi: { open: "09:30", close: "19:00" },
          dimanche: { open: "10:00", close: "13:00" }
        }
      }
    ];
  }
} 