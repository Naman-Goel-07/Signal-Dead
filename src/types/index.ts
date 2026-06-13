// ── SignalDead Type Definitions ─────────────────────────────────────
// All types correspond to future API responses and database schemas.
// No values are hardcoded or mocked here.

// ── Risk State ─────────────────────────────────────────────────────
export type RiskState = 'SAFE' | 'DEGRADED' | 'HIGH_RISK' | 'UNKNOWN';

export type SeverityLevel = 'NOMINAL' | 'CAUTION' | 'WARNING' | 'CRITICAL';

// ── Location ───────────────────────────────────────────────────────
export interface Location {
  latitude: number;
  longitude: number;
  locationName: string;
  /** ISO 8601 timestamp when location was set */
  setAt?: string;
}

// ── Telemetry ──────────────────────────────────────────────────────
export interface TelemetrySnapshot {
  /** Unique snapshot ID */
  id: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Geomagnetic KP index (0–9 scale) */
  kpIndex: number | null;
  /** Number of GNSS satellites currently overhead */
  satellitesOverhead: number | null;
  /** Position Dilution of Precision */
  pdop: number | null;
  /** Vertical Dilution of Precision */
  vdop: number | null;
  /** Horizontal Dilution of Precision */
  hdop: number | null;
  /** Signal-to-noise ratio (dB-Hz) */
  signalToNoise: number | null;
  /** Location reference for this snapshot */
  latitude: number;
  longitude: number;
}

// ── Forecast ───────────────────────────────────────────────────────
/** A single point in the 24-hour forecast timeline */
export interface ForecastPoint {
  /** ISO 8601 timestamp for this forecast slot */
  timestamp: string;
  /** Predicted risk state at this time */
  riskState: RiskState;
  /** Confidence level (0–1) */
  confidence: number | null;
  /** Predicted KP index */
  predictedKp: number | null;
  /** Human-readable label (e.g. "02:00 UTC") */
  label: string;
}

export interface ForecastWindow {
  generatedAt: string;
  location: Location;
  /** 24 points, one per hour */
  points: ForecastPoint[];
}

// ── Mission Status ─────────────────────────────────────────────────
export interface MissionStatus {
	id: string
	timestamp: string
	/** 0–100 composite risk score */
	riskScore: number | null
	riskState: RiskState
	/** e.g. "GO", "NO-GO", "CAUTION" */
	missionReadiness: string | null
	/** Reliability percentage */
	reliabilityLevel: number | null
	/** Estimated positional accuracy in metres */
	estimatedAccuracy: number | null
	location: Location
	activeAlerts: Alert[]
	advisories: AdvisoryCard[]
	/** Live telemetry injected from the orbital scan */
	telemetry?: {
		kpIndex: number
		satellitesOverhead: number
		pdop: number
	}
}

// ── Advisory ───────────────────────────────────────────────────────
export interface AdvisoryCard {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  title: string;
  body: string;
  /** Source module that generated this advisory */
  source: 'TELEMETRY' | 'FORECAST' | 'GEOMAGNETIC' | 'IONOSPHERIC';
  expiresAt?: string;
}

// ── Alert ──────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  message: string;
  acknowledged: boolean;
}

// ── Mission Report ─────────────────────────────────────────────────
export interface MissionReport {
  id: string;
  createdAt: string;
  location: Location;
  status: MissionStatus;
  telemetry: TelemetrySnapshot[];
  advisories: AdvisoryCard[];
  forecast: ForecastWindow | null;
}

// ── API Response Wrappers ──────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  timestamp: string | null;
}

// ── Nominatim ─────────────────────────────────────────────────────
export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}
