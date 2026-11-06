// src/activity/activity.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CancelNotamDTO, EditNotamDTO, TakeNotamDTO } from './dto/activity.dto';
import { timeStamp } from 'node:console';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async getAllActivities(){
    return this.prismaService.activity.findMany()
  }

  async getActivitiesByPermitId(permitId: number) { 
    return this.prismaService.activity.findMany({
      where: {permitId: permitId, status: "N"},
      orderBy: [{activityDateTime:"asc"}, {id:"asc"}] // nee
    });
  }

  async takeNotam(data: TakeNotamDTO) {
    const mrefExists = await this.prismaService.activity.findFirst({where: {mref: data.mref}})
    if (mrefExists){
      throw new ConflictException("Mref already exists!")
    }
    await this.prismaService.activity.updateMany({
      where:{id: {in:data.ids}, status: "N"},
      data:{status: "Y", mref: data.mref, takenBy: data.takenBy}
    })
  }
 
  async findMrefsByPermitId(permitId: number) {
    const permit = await this.prismaService.activity.findMany({
      where: {permitId : permitId, mref: { not: null } },
      distinct: ['mref'],
      select: { mref: true, takenBy: true }
    });
    return permit
  }

  async editNotam(data: EditNotamDTO){
    const mrefExists = await this.prismaService.activity.findFirst({where: {mref: data.newmref}})
    if (mrefExists){
      throw new ConflictException("Mref already exists!")
    }

    const notam = await this.prismaService.activity.updateMany({
      where: {permitId: data.permitId, mref: data.oldmref},
      data: {mref: data.newmref}
    })

    return notam
  }

  // 4b. cancel NOTAM: every activity under this mref goes back to N
  async deleteNotam(data: CancelNotamDTO) {
    const notamExists = await this.prismaService.activity.findFirst({
      where: { mref: data.mref },
    });
    if (!notamExists) {
      throw new NotFoundException('NOTAM not found!');
    }
    const notam = await this.prismaService.activity.updateMany({
      where: { mref: data.mref },
      data: { status: 'N', mref: null, takenBy: null },
    });
   
    return notam
  }
}
