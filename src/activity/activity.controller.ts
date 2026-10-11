// src/activity/activity.controller.ts
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CancelNotamDTO, TakeNotamDTO } from './dto/activity.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // @Get('permitNo/:permitNo') 
  // async getActivitiesByPermitNo(@Query('permitNo') permitNo: string) {
  //   return this.activityService.getActivitiesByPermitNo(permitNo);
  // }

  @Get('id/:id')
  async getActivitiesByPermitId(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.getActivitiesByPermitId(id);
  }

  @Get('mrefs/:permitId') // GET /api/activities/mrefs/1
  async findMrefsByPermitId(@Param('permitId', ParseIntPipe) permitId: number) {
    return this.activityService.findMrefsByPermitId(permitId);
  }

  @Patch('takenotam') // PATCH /api/activities/notam
  async takeNotam(@Body() data: TakeNotamDTO) {
    return this.activityService.takeNotam(data);
  }

  @Patch('cancelnotam') // PATCH /api/activities/notam/cancel, mref in body (NOTAM refs contain "/")
  async deleteNotam(@Body() data: CancelNotamDTO) {
    return this.activityService.deleteNotam(data);
  }

}
