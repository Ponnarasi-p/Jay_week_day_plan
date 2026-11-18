import { describe, expect, it } from 'vitest';
import { HealthController } from '../src/health/health.controller';
import type { PrismaService } from '../src/prisma/prisma.service';

describe('HealthController', () => {
  it('reports the database state', async () => {
    const up = new HealthController({ isUp: async () => true } as PrismaService);
    const down = new HealthController({ isUp: async () => false } as PrismaService);
    expect((await up.get()).db).toBe('up');
    expect((await down.get()).db).toBe('down');
  });
});
