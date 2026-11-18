import { Controller, Get } from '@nestjs/common';
import type { HealthStatus } from '@autoplan/shared';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async get(): Promise<HealthStatus> {
    return { status: 'ok', db: (await this.prisma.isUp()) ? 'up' : 'down', time: new Date().toISOString() };
  }
}
