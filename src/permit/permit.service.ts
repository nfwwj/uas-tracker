// src/permit/permit.service.ts
import { BadGatewayException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermitDTO } from './dto/permit-dto';
import { ParsePermitDTO } from './dto/permit-dto';

import "dotenv/config"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PermitService {
  constructor (private prismaService: PrismaService){}

  async parseText(data: ParsePermitDTO) {
    const res = await fetch(process.env.PYTHON_SERVER_URL ?? 'http://localhost:8000/parse', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok){
        throw new BadGatewayException();
    }
    const parsedData = await res.json();

    return parsedData;
  }

  async addPermitandActivities({ activities, ...permitData }: CreatePermitDTO) { 
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const permit = await tx.permit.create({data: permitData}); 

        await tx.activity.createMany({
          data: activities.map((activity) => ({ ...activity, permitId: permit.id })),
        });

        return permit;
      });

    } catch (e) {    
      if (e instanceof PrismaClientKnownRequestError && e.code == 'P2002') {
        throw new ConflictException("Permit already exists!");
      }
      throw e;
    }
  }

  async findPermitById(id: number) {
    const permit = await this.prismaService.permit.findUnique({
      where: {id: id}
    //   include: { activities: { orderBy: { activityDateTime: 'asc' } } },
    });
    if (!permit){
        throw new NotFoundException("Permit not found!");
    } 
    return permit;
  }

  async findPermitByPermitNo(permitNo: string) {
    const permit = await this.prismaService.permit.findUnique({
      where: {permitNo: permitNo}
    });
    if (!permit){
        throw new NotFoundException("Permit not found!");
    }
    return permit;
  }

  async deletePermit(id:number){
    const permit = await this.prismaService.permit.findUnique({
      where:{id: id}
    })
    if (!permit){
        throw new NotFoundException("Permit not found!");
    } 

    await this.prismaService.permit.delete({
      where:{id: id}
    })
  }

  async getPendingPermits(){
    const permits = await this.prismaService.permit.findMany({
      where:{activities:{some:{status:"N"}}},
      select:{id: true,
        permitNo: true,
        applicationNum: true,
        _count : {select: {activities: {where: {status: "N"}}}},
        activities: {
          where: {status:"N"},
          orderBy: {activityDateTime: "asc"},
          select: {activityDateTime: true},
          take: 1
        }
      }
    })

    return permits.sort((a,b) => a.activities[0].activityDateTime.getTime() - b.activities[0].activityDateTime.getTime() ||
      a.id - b.id)
  }




}