# **AI Agent Workflow Log**

## **Agents Used**

* **Gemini (Pro 1.5):** Served as the primary AI agent for architectural planning, full-stack code generation (React/Node.js), mathematical verification against regulatory documents, and debugging.

## **Prompts & Outputs**

### **Example 1: Architectural Setup**

**Prompt:**

"Create a folder structure for the backend using Hexagonal Architecture (Ports & Adapters) as strictly required by the assignment."

Generated Snippet:  
The agent generated a strict directory tree separating core (business logic) from adapters (infrastructure), adhering to the assignment's architectural constraints.  
src/  
  core/  
    domain/ (Entities)  
    services/ (Pure Logic)  
  adapters/  
    inbound/ (API Controllers)  
    outbound/ (Database Repositories)

*Observation:* This saved significant setup time and ensured the "Architecture" evaluation criterion was met immediately without manual restructuring.

### **Example 2: Mathematical Logic Implementation**

**Prompt:**

"Read the ESSF Calculation Methodologies PDF and implement the Compliance Balance formula in TypeScript."

**Generated Snippet (Refined):**

// Compliance Balance \= (Target \- Actual) \* Total Energy  
const cb\_gco2eq \= (REGULATION.TARGET\_2025 \- ghgie\_actual) \* total\_energy\_mj;

// Penalty based on VLSFO Equivalent (41,000 MJ/t)  
// Formula: (|CB| / (GHGIE\_actual \* 41000)) \* 2400  
const abs\_deficit \= Math.abs(cb\_gco2eq);  
const vlsfo\_eq\_tonnes \= abs\_deficit / (ghgie\_actual \* REGULATION.VLSFO\_LCV);  
const penalty \= Math.floor(vlsfo\_eq\_tonnes \* REGULATION.PENALTY\_RATE\_EUR);

*Refinement:* The agent correctly identified the constants ($89.34\~gCO\_2e/MJ$ target) and the specific penalty logic (VLSFO equivalent) directly from the provided PDF context, correcting an initial assumption about penalty units.

## **Validation / Corrections**

### **1\. Prisma Version Conflict**

* **Issue:** The agent initially suggested npm install prisma, which pulled the latest Version 7.0. This caused a breaking change in the schema.prisma configuration (url vs datasource block), resulting in Error code: P1012.  
* **Correction:** I verified the error logs and prompted the agent to downgrade to a stable version. We explicitly installed prisma@5.21.0 to ensure stability with the generated code.

### **2\. Database Connectivity**

* **Issue:** The initial configuration assumed a running PostgreSQL instance, which caused connection errors (P1010: User was denied access).  
* **Correction:** To ensure the submission ran out-of-the-box for evaluators without requiring a complex local DB setup, I modified the setup to use **SQLite** (file:./dev.db). This allowed the project to be self-contained.

### **3\. Tailwind CSS Configuration**

* **Issue:** The initial npx tailwindcss init \-p command failed on Windows due to path/permission issues.  
* **Correction:** Instead of fighting the command line tool, I manually created the tailwind.config.js and postcss.config.js files with the correct configuration provided by the agent.

## **Observations**

### **Where Agent Saved Time**

* **Boilerplate Generation:** Creating the React components with Tailwind CSS classes (Glassmorphism UI) was nearly instant. Writing those hundreds of class names manually would have taken hours.  
* **Type Safety:** The agent automatically generated TypeScript interfaces (FuelFactors, VoyageInput) based on the domain logic, significantly reducing potential runtime errors.  
* **Regulatory Decoding:** The agent rapidly extracted complex formulas from the 100+ page ESSF PDF, identifying the exact constants needed for the 2025 compliance target.

### **Where Agent Struggled**

* **Local Environment Nuances:** The agent initially assumed a standard Linux/Mac environment or a pre-configured Windows setup. It struggled to predict specific Windows PowerShell permission issues (script execution policies) and file path errors, requiring manual intervention and specific terminal commands to resolve.

## **Best Practices Followed**

1. **Context-Aware Prompting:** I uploaded the official **ESSF Calculation Methodologies PDF** to the agent context. This ensured the ComplianceService used the *exact* legal formulas rather than hallucinating generic math.  
2. **Iterative Implementation:** We built the Backend first (Core Logic → Database → API) and verified it with mock tests before touching the Frontend. This prevented "integration hell" where frontend calls fail against a non-existent backend.  
3. **Hexagonal Isolation:** By strictly asking the agent to put math in src/core, I ensured that changing the database from Postgres to SQLite required zero changes to the actual compliance calculation logic, demonstrating true separation of concerns.