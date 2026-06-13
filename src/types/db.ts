// ── SignalDead Database Schema Architecture ────────────────────────
// These interfaces define the future database table structures.
// No database is connected or implemented here.
// TODO: Integrate with Supabase (or equivalent) when backend is ready.

// ── Table: cities ─────────────────────────────────────────────────
/**
 * TODO: Populate via Nominatim geocoding or a curated static list.
 * @table cities
 */
export interface CityRecord {
  /** Primary key */
  id: string;
  name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  /** Population for ranking search results */
  population?: number;
  timezone: string;
  created_at: string;
}

// ── Table: telemetry_snapshots ─────────────────────────────────────
/**
 * Raw GNSS telemetry captured at a point in time for a location.
 * TODO: Populate via backend GNSS/space-weather APIs.
 * @table telemetry_snapshots
 */
export interface TelemetrySnapshotRecord {
  id: string;
  captured_at: string;
  latitude: number;
  longitude: number;
  kp_index: number | null;
  satellites_overhead: number | null;
  pdop: number | null;
  vdop: number | null;
  hdop: number | null;
  signal_to_noise: number | null;
  /** Foreign key → mission_reports.id (nullable if standalone snapshot) */
  mission_report_id: string | null;
  created_at: string;
}

// ── Table: forecasts ──────────────────────────────────────────────
/**
 * 24-hour GNSS degradation forecast computed by the backend.
 * TODO: Populate via ML/physics model predictions.
 * @table forecasts
 */
export interface ForecastRecord {
  id: string;
  generated_at: string;
  location_lat: number;
  location_lon: number;
  location_name: string;
  /** JSON array of hourly forecast points */
  points_json: string;
  /** Hours ahead covered */
  horizon_hours: number;
  /** Model version that generated this forecast */
  model_version: string | null;
  created_at: string;
}

// ── Table: forecast_points ────────────────────────────────────────
/**
 * Individual rows of a forecast (normalised form).
 * TODO: Consider denormalising into forecasts.points_json if Supabase.
 * @table forecast_points
 */
export interface ForecastPointRecord {
  id: string;
  forecast_id: string;
  slot_timestamp: string;
  risk_state: 'SAFE' | 'DEGRADED' | 'HIGH_RISK' | 'UNKNOWN';
  confidence: number | null;
  predicted_kp: number | null;
  created_at: string;
}

// ── Table: mission_reports ─────────────────────────────────────────
/**
 * A snapshot of a full mission readiness assessment.
 * TODO: Trigger generation via backend when user initialises mission.
 * @table mission_reports
 */
export interface MissionReportRecord {
  id: string;
  created_at: string;
  location_lat: number;
  location_lon: number;
  location_name: string;
  risk_score: number | null;
  risk_state: 'SAFE' | 'DEGRADED' | 'HIGH_RISK' | 'UNKNOWN';
  mission_readiness: string | null;
  reliability_level: number | null;
  estimated_accuracy_m: number | null;
  forecast_id: string | null;
}

// ── Table: alerts ─────────────────────────────────────────────────
/**
 * Active alerts attached to a mission report.
 * TODO: Populate from backend alert engine.
 * @table alerts
 */
export interface AlertRecord {
  id: string;
  mission_report_id: string;
  created_at: string;
  severity: 'NOMINAL' | 'CAUTION' | 'WARNING' | 'CRITICAL';
  message: string;
  source: 'TELEMETRY' | 'FORECAST' | 'GEOMAGNETIC' | 'IONOSPHERIC';
  acknowledged: boolean;
  acknowledged_at: string | null;
  expires_at: string | null;
}

// ── Repository Interfaces ──────────────────────────────────────────
// TODO: Implement these with Supabase client when database is connected.

export interface ICityRepository {
  /** TODO: Search cities by name prefix */
  searchByName(query: string): Promise<CityRecord[]>;
  /** TODO: Get a city by exact coordinates */
  getByCoordinates(lat: number, lon: number): Promise<CityRecord | null>;
}

export interface ITelemetryRepository {
  /** TODO: Get latest snapshot for a location */
  getLatest(lat: number, lon: number): Promise<TelemetrySnapshotRecord | null>;
  /** TODO: Insert new telemetry snapshot */
  insert(snapshot: Omit<TelemetrySnapshotRecord, 'id' | 'created_at'>): Promise<TelemetrySnapshotRecord>;
}

export interface IForecastRepository {
  /** TODO: Get most recent forecast for location */
  getLatest(lat: number, lon: number): Promise<ForecastRecord | null>;
  /** TODO: Get forecast points for a forecast ID */
  getPoints(forecastId: string): Promise<ForecastPointRecord[]>;
}

export interface IMissionReportRepository {
  /** TODO: Get latest report for location */
  getLatest(lat: number, lon: number): Promise<MissionReportRecord | null>;
  /** TODO: Create a new mission report */
  create(report: Omit<MissionReportRecord, 'id' | 'created_at'>): Promise<MissionReportRecord>;
}

export interface IAlertRepository {
  /** TODO: Get active (non-acknowledged) alerts for a mission */
  getActive(missionReportId: string): Promise<AlertRecord[]>;
  /** TODO: Acknowledge an alert */
  acknowledge(alertId: string): Promise<void>;
}
