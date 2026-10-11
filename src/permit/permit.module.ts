import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';

@Module({
  providers: [PermitService],
  controllers: [PermitController]
})
export class PermitModule {}
