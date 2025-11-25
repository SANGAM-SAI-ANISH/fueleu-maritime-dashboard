// backend/src/adapters/inbound/http/server.ts
import express from 'express';
import cors from 'cors';
import { ComplianceService } from '../../../core/services/ComplianceService';
import { PoolingService } from '../../../core/services/PoolingService';
import { RouteRepository } from '../../outbound/postgres/RouteRepository';
import { ComplianceRepository } from '../../outbound/postgres/ComplianceRepository';
import { FuelType } from '../../../core/domain/FuelConstants';

const app = express();
app.use(cors());
app.use(express.json());

// Dependency Injection
const routeRepo = new RouteRepository();
const complianceRepo = new ComplianceRepository();
const complianceService = new ComplianceService();
const poolingService = new PoolingService();

// --- ROUTES TAB ENDPOINTS ---

app.get('/api/routes', async (req, res) => {
  // In a real app, this would come from DB. For this demo, we mock if DB is empty.
  let routes = await routeRepo.getAllRoutes();
  
  if (routes.length === 0) {
    // Fallback Mock Data if you haven't seeded the DB
    routes = [
        { id: 'uuid-1', routeId: 'R001', vesselType: 'Container', fuelType: FuelType.HFO, year: 2025, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, is_baseline: false },
        { id: 'uuid-2', routeId: 'R002', vesselType: 'Tanker', fuelType: FuelType.LNG_OTTO, year: 2025, ghgIntensity: 82.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, is_baseline: true }
    ];
  }

  // Calculate KPIs on the fly
  const results = routes.map(route => {
    const kpis = complianceService.calculateKPIs([{
      id: route.routeId,
      fuelType: route.fuelType,
      mass_tonnes: route.fuelConsumption,
      slip_percent: route.fuelType === FuelType.LNG_OTTO ? 3.1 : 0
    }]);
    return { ...route, ...kpis };
  });
  res.json(results);
});

app.post('/api/routes/:id/baseline', async (req, res) => {
  try {
    await routeRepo.setBaseline(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({error: "Failed to set baseline"});
  }
});

// --- COMPARE TAB ENDPOINTS ---

app.get('/api/routes/comparison', async (req, res) => {
  let baseline = await routeRepo.getBaseline();
  let routes = await routeRepo.getAllRoutes();
  
  // Mock fallback for demo purposes
  if (!baseline && routes.length === 0) {
     return res.json({
         baseline: { ghgie_actual: 82.86 },
         comparisons: [
             { routeId: 'R001', ghgie: 91.74, percentDiff: 10.7, compliant: false },
             { routeId: 'R002', ghgie: 82.86, percentDiff: 0.0, compliant: true }
         ]
     });
  }
  
  if (!baseline) return res.status(404).json({ error: "No baseline set" });

  const baselineKPI = complianceService.calculateKPIs([{
    id: baseline.routeId,
    fuelType: baseline.fuelType as FuelType,
    mass_tonnes: baseline.fuelConsumption
  }]);

  const comparisons = routes.map(r => {
    const kpi = complianceService.calculateKPIs([{
      id: r.routeId,
      fuelType: r.fuelType as FuelType,
      mass_tonnes: r.fuelConsumption
    }]);
    
    // Formula: ((comparison / baseline) - 1) * 100
    const percentDiff = ((kpi.ghgie_actual / baselineKPI.ghgie_actual) - 1) * 100;
    
    return {
      routeId: r.routeId,
      ghgie: kpi.ghgie_actual,
      percentDiff,
      compliant: kpi.is_compliant
    };
  });

  res.json({ baseline: baselineKPI, comparisons });
});

// --- BANKING & POOLING ENDPOINTS ---

app.get('/api/compliance/cb', async (req, res) => {
  const { shipId } = req.query;
  const surplus = await complianceRepo.getBankedSurplus(String(shipId));
  res.json({ bankedSurplus: surplus });
});

app.post('/api/pools', async (req, res) => {
  try {
    // 1. Validate & Calculate in Core Domain
    const { members } = req.body; 
    const poolResult = poolingService.createPool(members);
    
    // 2. Persist in Database (Optional for demo, but good for completeness)
    // await complianceRepo.createPool({ members: poolResult });
    
    res.json(poolResult);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`FuelEU API running on port ${PORT}`));