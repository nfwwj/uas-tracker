// src/activity/activity.controller.ts
import { Body, Controller, DefaultValuePipe, UseGuards, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CancelNotamDTO, TakeNotamDTO, EditNotamDTO} from './dto/activity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { setTimeout as sleep } from 'node:timers/promises';


@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // @Get('permitNo/:permitNo') 
  // async getActivitiesByPermitNo(@Query('permitNo') permitNo: string) {
  //   return this.activityService.getActivitiesByPermitNo(permitNo);
  // }
  // @Get()
  // async getAllActivities(){
  //   return this.activityService.getAllActivities()
  // }
  
 
  @UseGuards(JwtAuthGuard)
  @Get() // GET /api/activities?permitId=1[&mref=M202601234]
  async getActivities(@Query('permitId', ParseIntPipe) permitId: number,
                      @Query('mref') mref?: string) {
    return this.activityService.getActivities(permitId, mref);
  }

  // always [{ mref, takenBy }]: the permit's unique mrefs (prev NOTAMs table)
  @UseGuards(JwtAuthGuard)
  @Get('mrefs') // GET /api/activities/mrefs?permitId=1
  async getMrefsByPermitId(@Query('permitId', ParseIntPipe) permitId: number) {
    return this.activityService.getMrefsByPermitId(permitId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('take-notam') // PATCH /api/activities/take-notam
  async takeNotam(@Body() data: TakeNotamDTO) {
    await sleep(1500);
    return this.activityService.takeNotam(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit-notam') // PATCH /api/activities/edit-notam
  async editNotam(@Body() data: EditNotamDTO){
    await sleep(1500);
    return this.activityService.editNotam(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('cancel-notam') // PATCH /api/activities/cancel-notam
  async deleteNotam(@Body() data: CancelNotamDTO) {
    await sleep(1500);
    return this.activityService.deleteNotam(data);
  }

}
