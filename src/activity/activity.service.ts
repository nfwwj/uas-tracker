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

  async getActivities(permitId: number, mref?: string) {
    return this.prismaService.activity.findMany({
      where: mref ? {permitId, mref} : {permitId, status: "N"},
      orderBy: [{activityDateTime:"asc"}, {id:"asc"}]
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
 
  async getMrefsByPermitId(permitId: number) {
    return this.prismaService.activity.findMany({
      where: {permitId : permitId, mref: { not: null } },
      distinct: ['mref'],
      select: { mref: true, takenBy: true }
    });
  }

  async editNotam(data: EditNotamDTO){
    if (data.newMref === data.oldMref) {
      throw new BadRequestException("New mref is the same as the old one.")
    }

    const mrefExists = await this.prismaService.activity.findFirst({where: {mref: data.newMref}})
    if (mrefExists){
      throw new ConflictException("Mref already exists!")
    }

    await this.prismaService.activity.updateMany({
      where: {permitId: data.permitId, mref: data.oldMref},
      data: {mref: data.newMref}
    })

  }

  // 4b. cancel NOTAM: every activity under this mref goes back to N
  async deleteNotam(data: CancelNotamDTO) {
    const notamExists = await this.prismaService.activity.findFirst({
      where: { mref: data.mref },
    });
    if (!notamExists) {
      throw new NotFoundException('NOTAM not found!');
    }
    await this.prismaService.activity.updateMany({
      where: { mref: data.mref },
      data: { status: 'N', mref: null, takenBy: null },
    });
  }
}
