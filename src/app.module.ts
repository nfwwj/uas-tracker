import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ActivityModule } from './activity/activity.module';
import { PermitModule } from './permit/permit.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, ActivityModule, PermitModule, AuthModule, UserModule, ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000 * 60, //1 min
          limit: 100,
        },
      ],
    }),],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
