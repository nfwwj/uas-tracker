import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ActivityModule } from './activity/activity.module';
import { PermitModule } from './permit/permit.module';

@Module({
  imports: [PrismaModule, ActivityModule, PermitModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
