// src/permit/permit.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreatePermitDTO } from './dto/permit-dto';
import { ParsePermitDTO } from './dto/permit-dto';
import { PermitService } from './permit.service';

import { setTimeout as sleep } from 'node:timers/promises';

@Controller('permits')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @Post('parse')
  async parseText(@Body() data: ParsePermitDTO) {
    return this.permitService.parseText(data);
  }

  @Get()
  async getPendingPermits(){
    return this.permitService.getPendingPermits()
  }

  @Get('search')  
  async search(@Query('applicationNumber') applicationNumber: string) {
    return this.permitService.search(applicationNumber)
  }

  @Get("count")
  async getTotalNumPermits(){
    return this.permitService.getTotalNumPermits()
  }

  @Get('id/:id') 
  async findPermitById(@Param('id', ParseIntPipe) id: number) {
    return this.permitService.findPermitById(id);
  }

  @Get('permitNo/:permitNo') //param or query for this?
  async findPermitByPermitNo(@Param('permitNo') permitNo: string) {
    return this.permitService.findPermitByPermitNo(permitNo);
  }

  @Post()
  async addPermitandActivities(@Body() data: CreatePermitDTO) {
    await sleep(1500);
    return this.permitService.addPermitandActivities(data);
  }

  @Delete('id/:id')
  async deletePermit(@Param("id", ParseIntPipe) id:number){
    return this.permitService.deletePermit(id);
  }

  @Delete('all')
  async deleteAllPermits(){
    return this.permitService.deleteAllPermits()
  }

  
}