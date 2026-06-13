# FastAPI Integration Roadmap

This document serves as the implementation guide for building the SignalDead backend in FastAPI.

## Target Architecture
The backend will utilize a layered architecture to ensure separation of concerns:
- **Routers (API Layer):** Handles HTTP requests, validation (via Pydantic), and formatting responses.
- **Services (Business Logic Layer):** Contains the core logic (e.g., risk calculation algorithms, fetching external space weather data).
- **Repositories (Data Access Layer):** Interfaces directly with the database (Supabase/PostgreSQL) using an ORM like SQLAlchemy or the `supabase-py` client.

---

## Step 1: Project Initialization

Initialize a new Python project:
```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic supabase pydantic-settings httpx
```

## Step 2: Translate DTOs to Pydantic Models

Use the provided `api_contracts.ts` as a 1:1 mapping for Pydantic models. 

**Example (Telemetry Response):**
```python
from pydantic import BaseModel, Field
from datetime import datetime

class TelemetryResponse(BaseModel):
    kpIndex: float = Field(..., ge=0.0, le=9.0)
    satelliteCount: int = Field(..., ge=0)
    pdop: float
    lastUpdated: datetime
```

## Step 3: Implement Database & Repositories

Use the schema provided in `database_schema.sql` to generate Supabase tables.
Implement the Python equivalent of the repository interfaces defined in `repositories.ts`.

**Example (Telemetry Repository):**
```python
from supabase import Client

class TelemetryRepository:
    def __init__(self, db: Client):
        self.db = db

    def get_latest(self, location_id: str):
        response = self.db.table("telemetry_snapshots").select("*").eq("location_id", location_id).order("created_at", desc=True).limit(1).execute()
        return response.data[0] if response.data else None
```

## Step 4: Develop Core Services

Create service classes to abstract external API calls and risk calculations.
- `SpaceWeatherService`: Fetches real KP Index data from NOAA.
- `RiskEngineService`: Takes telemetry + forecast data and calculates the composite `riskScore` (0-100).
- `AdvisoryService`: Generates plain-English advisories based on the output of the `RiskEngineService`.

## Step 5: Implement FastAPI Routers

Connect the Pydantic models, Services, and Repositories into the FastAPI route handlers.

**Example (Mission Status Route):**
```python
from fastapi import APIRouter, Depends
from models import MissionStatusResponse
from services import RiskEngineService

router = APIRouter(prefix="/api/v1")

@router.get("/mission-status", response_model=MissionStatusResponse)
async def get_mission_status(lat: float, lon: float, risk_service: RiskEngineService = Depends()):
    return await risk_service.calculate_status(lat, lon)
```

## Step 6: Authentication via Supabase

Implement auth middleware to verify Supabase JWTs attached to requests using `fastapi.security.OAuth2PasswordBearer`. Extract the `user_id` and pass it to endpoints that require authentication (like saved locations and alerts).

## Deliverables Handover

You now have:
1. `database_schema.sql`: Your exact table structures.
2. `api_contracts.ts`: Your request/response JSON shapes.
3. `repositories.ts`: The required data-access methods.
4. This roadmap: Step-by-step FastAPI instructions.

You are fully prepared to build the Python backend independently while perfectly matching the React frontend's expectations.
