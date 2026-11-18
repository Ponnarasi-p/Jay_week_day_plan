import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(PrismaService.name);

  async onModuleInit() {
    // Do not crash the API when the database is down: /api/health reports it instead.
    try {
      await this.$connect();
    } catch (e) {
      this.log.warn(`Database not reachable yet: ${(e as Error).message.split('\n')[0]}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async isUp(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
