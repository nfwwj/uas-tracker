// src/permit/permit.controller.ts
import { Body, Controller, Delete, Get, Param,  ParseIntPipe, Post, Query, HttpCode, UseGuards} from '@nestjs/common';
import { CreatePermitDTO } from './dto/permit-dto';
import { ParsePermitDTO } from './dto/permit-dto';
import { PermitService } from './permit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { setTimeout as sleep } from 'node:timers/promises';

@Controller('permits')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @UseGuards(JwtAuthGuard)
  @Post('parse')
  @HttpCode(200)
  async parseText(@Body() data: ParsePermitDTO) {
    return this.permitService.parseText(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPendingPermits(){
    return this.permitService.getPendingPermits()
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')  
  async search(@Query('applicationNumber') applicationNumber: string) {
    return this.permitService.search(applicationNumber)
  }

  @UseGuards(JwtAuthGuard)
  @Get("count")
  async getTotalNumPermits(){
    return this.permitService.getTotalNumPermits()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id') 
  async findPermitById(@Param('id', ParseIntPipe) id: number) {
    return this.permitService.findPermitById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('permitNo/:permitNo') //param or query for this?
  async findPermitByPermitNo(@Param('permitNo') permitNo: string) {
    return this.permitService.findPermitByPermitNo(permitNo);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPermitandActivities(@Body() data: CreatePermitDTO) {
    await sleep(1500);
    return this.permitService.addPermitandActivities(data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePermit(@Param("id", ParseIntPipe) id:number){
    return this.permitService.deletePermit(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete('all')
  // async deleteAllPermits(){
  //   return this.permitService.deleteAllPermits()
  // }

  
}