import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { AssignDrugDto } from './dto/assign-drug.dto';
import { UpdateDrugAssignmentDto } from './dto/update-drug-assignment.dto';

@Injectable()
export class DrugsService {
  constructor(private prisma: PrismaService) {}

  async create(createDrugDto: CreateDrugDto) {
    return this.prisma.drug.create({
      data: createDrugDto,
    });
  }

  async findAll() {
    return this.prisma.drug.findMany();
  }

  async findOne(id: number) {
    const drug = await this.prisma.drug.findUnique({
      where: { id },
    });

    if (!drug) {
      throw new NotFoundException(`Médicament avec l'ID ${id} non trouvé`);
    }

    return drug;
  }

  async update(id: number, updateDrugDto: UpdateDrugDto) {
    await this.findOne(id);

    return this.prisma.drug.update({
      where: { id },
      data: updateDrugDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.drug.delete({
      where: { id },
    });
  }

  async search(query: string) {
    return this.prisma.drug.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
    });
  }

  async getUserDrugs(userId: number) {
    return this.prisma.userDrug.findMany({
      where: { user_id: userId },
      include: { drug: true },
    });
  }

  async getActiveUserDrugs(userId: number) {
    const now = new Date();
    return this.prisma.userDrug.findMany({
      where: {
        user_id: userId,
        OR: [
          { end_date: null },
          { end_date: { gt: now } },
        ],
      },
      include: { drug: true },
    });
  }

  async getUserDrugHistory(userId: number) {
    return this.prisma.userDrug.findMany({
      where: { user_id: userId },
      include: { drug: true },
      orderBy: { start_date: 'desc' },
    });
  }

  async assignDrugToUser(userId: number, assignDrugDto: AssignDrugDto) {
    const { drugId, ...drugData } = assignDrugDto;
    await this.findOne(drugId);
    return this.prisma.userDrug.create({
      data: {
        user_id: userId,
        drug_id: drugId,
        ...drugData,
      },
      include: { drug: true },
    });
  }

  async updateDrugAssignment(userId: number, drugId: number, updateDrugAssignmentDto: UpdateDrugAssignmentDto) {
    const userDrug = await this.prisma.userDrug.findFirst({
      where: { user_id: userId, drug_id: drugId },
    });

    if (!userDrug) {
      throw new NotFoundException(`Association médicament-utilisateur non trouvée`);
    }

    return this.prisma.userDrug.update({
      where: { id: userDrug.id },
      data: updateDrugAssignmentDto,
      include: { drug: true },
    });
  }

  async removeDrugFromUser(userId: number, drugId: number) {
    const userDrug = await this.prisma.userDrug.findFirst({
      where: { user_id: userId, drug_id: drugId },
    });

    if (!userDrug) {
      throw new NotFoundException(`Association médicament-utilisateur non trouvée`);
    }

    return this.prisma.userDrug.delete({
      where: { id: userDrug.id },
    });
  }
} 