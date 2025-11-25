// backend/src/adapters/outbound/postgres/RouteRepository.ts
import { PrismaClient } from '@prisma/client';
import { FuelType } from '../../../core/domain/FuelConstants';

const prisma = new PrismaClient();

export class RouteRepository {
  
  async getAllRoutes() {
    const routes = await prisma.route.findMany();
    return routes.map(r => ({
      ...r,
      // Cast DB string to Enum
      fuelType: r.fuelType as FuelType
    }));
  }

  async getRouteById(id: string) {
    return await prisma.route.findUnique({ where: { routeId: id } });
  }

  async setBaseline(routeId: string) {
    // Transaction: Unset old baseline -> Set new baseline
    return await prisma.$transaction([
      prisma.route.updateMany({ data: { is_baseline: false } }),
      prisma.route.update({
        where: { routeId },
        data: { is_baseline: true }
      })
    ]);
  }

  async getBaseline() {
    return await prisma.route.findFirst({ where: { is_baseline: true } });
  }
}