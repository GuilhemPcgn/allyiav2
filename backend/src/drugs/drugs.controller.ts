import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { AssignDrugDto } from './dto/assign-drug.dto';
import { UpdateDrugAssignmentDto } from './dto/update-drug-assignment.dto';

@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(createDrugDto);
  }

  @Get()
  findAll() {
    return this.drugsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.drugsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.drugsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugsService.update(id, updateDrugDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.drugsService.remove(id);
  }

  @Get('user/:userId')
  getUserDrugs(@Param('userId', ParseIntPipe) userId: number) {
    return this.drugsService.getUserDrugs(userId);
  }

  @Get('user/:userId/active')
  getActiveUserDrugs(@Param('userId', ParseIntPipe) userId: number) {
    return this.drugsService.getActiveUserDrugs(userId);
  }

  @Get('user/:userId/history')
  getUserDrugHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.drugsService.getUserDrugHistory(userId);
  }

  @Post('user/:userId/assign')
  assignDrugToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() assignDrugDto: AssignDrugDto,
  ) {
    return this.drugsService.assignDrugToUser(userId, assignDrugDto);
  }

  @Patch('user/:userId/:drugId')
  updateDrugAssignment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('drugId', ParseIntPipe) drugId: number,
    @Body() updateDrugAssignmentDto: UpdateDrugAssignmentDto,
  ) {
    return this.drugsService.updateDrugAssignment(userId, drugId, updateDrugAssignmentDto);
  }

  @Delete('user/:userId/:drugId')
  removeDrugFromUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('drugId', ParseIntPipe) drugId: number,
  ) {
    return this.drugsService.removeDrugFromUser(userId, drugId);
  }
} 