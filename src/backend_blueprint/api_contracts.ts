/**
 * API CONTRACTS & DTOs
 * SignalDead Backend Architecture
 * 
 * Future FastAPI Router Mapping:
 * - MissionStatusAPI -> router.get("/api/v1/mission-status", response_model=MissionStatusResponse)
 * - TelemetryAPI -> router.get("/api/v1/telemetry", response_model=TelemetryResponse)
 * - ForecastAPI -> router.get("/api/v1/forecast", response_model=ForecastResponse)
 * - AdvisoryAPI -> router.get("/api/v1/advisory", response_model=AdvisoryResponse)
 * - LocationAPI -> router.post("/api/v1/location", response_model=LocationResponse)
 * - AuthAPI -> router.post("/api/v1/auth/login")
 * - AlertAPI -> router.post("/api/v1/alerts")
 */

// ---------------------------------------------------------
// 1. Mission Status API
// GET /api/v1/mission-status
// Query Params: lat (float), lon (float)
// ---------------------------------------------------------

export interface MissionStatusResponse {
  riskScore: number; // 0-100
  riskLevel: 'SAFE' | 'DEGRADED' | 'HIGH_RISK';
  reliability: string; // e.g., "98.5%"
  estimatedAccuracy: number; // in meters
  activeAlerts: AlertDTO[];
  spaceWeatherSummary: string;
}

// ---------------------------------------------------------
// 2. Telemetry API
// GET /api/v1/telemetry
// Query Params: lat (float), lon (float)
// ---------------------------------------------------------

export interface TelemetryResponse {
  kpIndex: number;
  satelliteCount: number;
  pdop: number;
  lastUpdated: string; // ISO 8601
}

// ---------------------------------------------------------
// 3. Forecast API
// GET /api/v1/forecast
// Query Params: lat (float), lon (float)
// ---------------------------------------------------------

export interface ForecastPointDTO {
  timestamp: string; // ISO 8601
  riskLevel: 'SAFE' | 'DEGRADED' | 'HIGH_RISK';
  confidence: number; // 0.0 - 1.0
}

export interface ForecastResponse {
  forecast: ForecastPointDTO[];
  generatedAt: string; // ISO 8601
}

// ---------------------------------------------------------
// 4. Advisory API
// GET /api/v1/advisory
// Query Params: lat (float), lon (float)
// ---------------------------------------------------------

export interface AdvisoryResponse {
  severity: 'NOMINAL' | 'CAUTION' | 'WARNING' | 'CRITICAL';
  title: string;
  recommendation: string;
  generatedAt: string; // ISO 8601
}

// ---------------------------------------------------------
// 5. Location API
// POST /api/v1/location
// ---------------------------------------------------------

export interface LocationRequest {
  query?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationResponse {
  locationName: string;
  latitude: number;
  longitude: number;
}

// ---------------------------------------------------------
// 6. Auth API
// POST /api/v1/auth/login
// POST /api/v1/auth/register
// ---------------------------------------------------------

export interface AuthLoginRequest {
  email: string;
  passwordHash: string; // Ensure HTTPS transfer
}

export interface AuthRegisterRequest {
  email: string;
  name: string;
  passwordHash: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ---------------------------------------------------------
// 7. Alert API
// POST /api/v1/alerts
// DELETE /api/v1/alerts/:id
// ---------------------------------------------------------

export interface AlertDTO {
  id: string;
  alertType: 'KP_THRESHOLD' | 'RISK_THRESHOLD' | 'LOCATION_BASED';
  threshold: number | string;
  isEnabled: boolean;
  message?: string;
}

export interface CreateAlertRequest {
  alertType: 'KP_THRESHOLD' | 'RISK_THRESHOLD' | 'LOCATION_BASED';
  threshold: number | string;
  locationId?: string; // Optional for global thresholds
}

/**
 * ERROR RESPONSES
 * Standard JSON format for all 4xx and 5xx errors.
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * VALIDATION RULES (Future FastAPI Pydantic constraints):
 * - lat: must be between -90.0 and 90.0
 * - lon: must be between -180.0 and 180.0
 * - kpIndex: must be between 0.0 and 9.0
 * - email: must match valid email regex
 */
