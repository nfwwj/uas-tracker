import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ActivityModule } from './activity/activity.module';
import { PermitModule } from './permit/permit.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { HealthController } from './health/health.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [PrismaModule, ActivityModule, PermitModule, AuthModule, UserModule, ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 100,
        },
      ],
    }),
//   ServeStaticModule.forRoot({ //remove this during aws
//   rootPath: join(__dirname, '..', 'frontend','dist'),
//   exclude: ['/api/{*path}'],
// })
// ,
],
  controllers: [AppController, HealthController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },]
})
export class AppModule {}
