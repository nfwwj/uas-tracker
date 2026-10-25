// src/activity/activity.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CancelNotamDTO, TakeNotamDTO } from './dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async getActivitiesByPermitId(permitId: number) { 
    return this.prismaService.activity.findMany({
      where: {permitId: permitId, status: "N"},
      orderBy: [{activityDateTime:"asc"}, {id:"asc"}] // nee
    });
  }

  async takeNotam(data: TakeNotamDTO) {
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
