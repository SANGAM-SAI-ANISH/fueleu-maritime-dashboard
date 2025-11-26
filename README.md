

# FuelEU Maritime Compliance Dashboard 🚢

A full-stack application designed to automate compliance with **Regulation (EU) 2023/1805 (FuelEU Maritime)**. This dashboard allows fleet managers to calculate GHG intensity, manage compliance balances, and optimize fleet-wide penalties using algorithmic pooling.

## 1\. Overview

The **FuelEU Maritime Regulation** mandates strict limits on the greenhouse gas (GHG) intensity of energy used on board ships starting in 2025. This project provides a comprehensive solution to:

  * **Calculate GHG Intensity:** Automatically computes $WtT$ (Well-to-Tank) and $TtW$ (Tank-to-Wake) emissions based on Annex II fuel factors.
  * **Monitor Compliance:** Real-time tracking of Compliance Balance against the 2025 reduction target ($89.34~gCO_2e/MJ$).
  * **Optimize Pooling:** Implements a **Greedy Algorithm** (Article 21) to automatically redistribute surplus compliance from efficient ships to offset deficits in non-compliant vessels.
  * **Banking (Article 20):** Manage and store compliance surplus for future reporting periods.

-----

## 2\. Architecture Summary (Hexagonal Structure)

This project strictly adheres to **Hexagonal Architecture (Ports & Adapters)**. This design pattern decouples the core business logic from the user interface and database, ensuring the complex regulatory math remains pure and testable.

### **Directory Structure**

```text
backend/src/
├── core/                  <-- THE DOMAIN (Pure Logic)
│   ├── domain/            # Entities (FuelTypes, Constants, FuelFactors)
│   └── services/          # Business Logic (GHG Formulas, Pooling Algorithm)
└── adapters/              <-- THE INFRASTRUCTURE (Frameworks)
    ├── inbound/           # Express Controllers (HTTP API)
    └── outbound/          # Prisma Repositories (PostgreSQL/SQLite Adapter)
```

  * **Core Layer:** Contains the *ComplianceService* and *PoolingService*. This layer has **zero dependencies** on Express, React, or the Database. It strictly implements the math defined in the ESSF Calculation Methodologies report.
  * **Adapters Layer:** Handles the "dirty details" of receiving HTTP requests and talking to the database.

-----

## 3\. Setup & Run Instructions

### **Prerequisites**

  * Node.js (v18 or higher)
  * npm (v9 or higher)

### **Backend Setup**

The backend handles logic and data persistence.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Initialize the Database (SQLite):
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4.  Start the Server:
    ```bash
    npx ts-node src/adapters/inbound/http/server.ts
    ```
    *Server will run on: `http://localhost:3001`*

### **Frontend Setup**

The frontend provides the interactive dashboard.

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Application:
    ```bash
    npm run dev
    ```
4.  Open your browser and go to: **`http://localhost:5173`**

-----

## 4\. How to Execute Tests

To verify the core calculation logic against the **ESSF Calculation Methodologies** examples (e.g., verifying the RFNBO multiplier or Penalty calculation):

1.  Navigate to the backend:
    ```bash
    cd backend
    ```
2.  Run the test suite:
    ```bash
    npm test
    ```
    *(Note: This executes unit tests located in `src/core/tests` checking the `ComplianceService` logic).*

### **Manual Verification Strategy**

You can also verify the logic manually via the Dashboard:

1.  Go to **Routes Tab**.
2.  Observe **Ship R001 (HFO)**: Should show a **Red** status (Deficit).
3.  Observe **Ship R002 (LNG)**: Should show a **Green** status (Surplus).
4.  Go to **Pooling Tab** and click **"Simulate Pool"**.
5.  Verify that the algorithm transfers R002's surplus to R001, changing R001's status to **Compliant**.

-----

## 5\. Sample Requests & Responses

### **GET /api/routes**

*Fetches all ships with calculated GHG intensity and penalties.*

**Response:**

```json
[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "ghgie_actual": 91.74,
    "compliance_balance": -1255000,
    "penalty_eur": 802011,
    "is_compliant": false
  },
  {
    "routeId": "R002",
    "vesselType": "Tanker",
    "fuelType": "LNG_OTTO",
    "ghgie_actual": 82.86,
    "compliance_balance": 2778000,
    "penalty_eur": 0,
    "is_compliant": true
  }
]
```

### **POST /api/pools**

*Triggers the Greedy Algorithm to optimize fleet compliance.*

**Request:**

```json
{
  "members": [
    { "shipId": "SHIP-A", "cb": 5000 },
    { "shipId": "SHIP-B", "cb": -2000 }
  ]
}
```

**Response:**

```json
[
  {
    "shipId": "SHIP-A",
    "cb_before": 5000,
    "cb_after": 3000,
    "status": "Donated 2000"
  },
  {
    "shipId": "SHIP-B",
    "cb_before": -2000,
    "cb_after": 0,
    "status": "Compliant"
  }
]
```

-----

## 📸 Screenshots

<img width="1913" height="1034" alt="Screenshot 2025-11-26 095913" src="https://github.com/user-attachments/assets/4bace64b-ecce-4b4f-b696-6a17f49021f3" />
<img width="1919" height="1031" alt="image" src="https://github.com/user-attachments/assets/193fe01e-05a7-430e-9e85-18f4475e54ad" />
<img width="1919" height="972" alt="Screenshot 2025-11-26 095938" src="https://github.com/user-attachments/assets/3f0b6b9c-9bf7-4c23-8368-b7513bbd839c" />

