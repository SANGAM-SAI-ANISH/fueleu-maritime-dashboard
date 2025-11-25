// backend/src/adapters/outbound/postgres/ComplianceRepository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ComplianceRepository {
  
  async getBankedSurplus(shipId: string) {
    const entries = await prisma.bankEntry.findMany({
      where: { ship_id: shipId }
    });
    return entries.reduce((sum, entry) => sum + entry.amount_gco2eq, 0);
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    return await prisma.bankEntry.create({
      data: {
        ship_id: shipId,
        year,
        amount_gco2eq: amount
      }
    });
  }

  async createPool(poolData: any) {
    return await prisma.pool.create({
      data: {
        year: new Date().getFullYear(),
        members: {
          create: poolData.members.map((m: any) => ({
            ship_id: m.shipId,
            cb_before: m.cb_before,
            cb_after: m.cb_after
          }))
        }
      },
      include: { members: true }
    });
  }
}