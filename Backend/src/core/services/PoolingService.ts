// backend/src/core/services/PoolingService.ts

interface PoolMember {
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export class PoolingService {
  /**
   * Distributes surplus from compliant ships to non-compliant ships.
   * Strategy: Greedy Allocation (Best performers help worst performers first).
   */
  public createPool(members: { shipId: string; cb: number }[]): PoolMember[] {
    const total_cb = members.reduce((sum, m) => sum + m.cb, 0);
    
    // Rule 1: Pool is invalid if total sum is negative
    if (total_cb < 0) {
      throw new Error("Pool Validation Failed: Total Compliance Balance is negative.");
    }

    // Separate surplus and deficit ships
    let surplusShips = members.filter(m => m.cb > 0).sort((a, b) => b.cb - a.cb); // Descending
    let deficitShips = members.filter(m => m.cb < 0).sort((a, b) => a.cb - b.cb); // Ascending (worst first)
    
    // Result map
    const results = new Map<string, number>();
    members.forEach(m => results.set(m.shipId, m.cb)); // Initialize with current state

    // Distribute
    for (const deficitShip of deficitShips) {
      let needed = Math.abs(deficitShip.cb);
      
      for (const donor of surplusShips) {
        const currentDonorBalance = results.get(donor.shipId)!;
        if (currentDonorBalance <= 0 || needed === 0) continue;

        const donation = Math.min(currentDonorBalance, needed);
        
        // Apply donation
        results.set(donor.shipId, currentDonorBalance - donation);
        results.set(deficitShip.shipId, results.get(deficitShip.shipId)! + donation);
        
        needed -= donation;
      }
    }

    return members.map(m => ({
      shipId: m.shipId,
      cb_before: m.cb,
      cb_after: results.get(m.shipId)!
    }));
  }
}