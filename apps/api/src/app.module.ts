import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, RealtimeModule],
  controllers: [HealthController],
})
export class AppModule {}
