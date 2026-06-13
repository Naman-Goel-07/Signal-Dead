/**
 * REPOSITORY PATTERN INTERFACES
 * Defines the data access layer for the backend services.
 * 
 * Future implementation notes:
 * - Implement these interfaces in FastAPI using SQLAlchemy or an async Supabase client.
 * - These act as the boundary between the Service Layer and the Database Layer.
 */

// Domain Entities (Map to DB schema)
export interface UserEntity {
  id: string;
  email: string;
  name: string;
  created_at: Date;
}

export interface SavedLocationEntity {
  id: string;
  user_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  created_at: Date;
}

export interface TelemetryEntity {
  id: string;
  location_id: string | null;
  kp_index: number;
  satellite_count: number;
  pdop: number;
  created_at: Date;
}

export interface ForecastEntity {
  id: string;
  location_id: string;
  timestamp: Date;
  risk_level: string;
  confidence: number;
  created_at: Date;
}

export interface MissionReportEntity {
  id: string;
  location_id: string;
  risk_score: number;
  risk_level: string;
  advisory: string;
  created_at: Date;
}

export interface AlertEntity {
  id: string;
  user_id: string;
  alert_type: string;
  threshold: string;
  is_enabled: boolean;
  created_at: Date;
}

// ---------------------------------------------------------
// Repositories
// ---------------------------------------------------------

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id' | 'created_at'>): Promise<UserEntity>;
}

export interface LocationRepository {
  findByUserId(userId: string): Promise<SavedLocationEntity[]>;
  findById(id: string): Promise<SavedLocationEntity | null>;
  create(location: Omit<SavedLocationEntity, 'id' | 'created_at'>): Promise<SavedLocationEntity>;
  delete(id: string): Promise<boolean>;
}

export interface TelemetryRepository {
  getLatestByLocation(lat: number, lon: number): Promise<TelemetryEntity | null>;
  insertSnapshot(snapshot: Omit<TelemetryEntity, 'id' | 'created_at'>): Promise<TelemetryEntity>;
}

export interface ForecastRepository {
  getForecastWindow(locationId: string, hoursAhead: number): Promise<ForecastEntity[]>;
  insertForecasts(forecasts: Omit<ForecastEntity, 'id' | 'created_at'>[]): Promise<void>;
}

export interface MissionReportRepository {
  getLatestReport(locationId: string): Promise<MissionReportEntity | null>;
  saveReport(report: Omit<MissionReportEntity, 'id' | 'created_at'>): Promise<MissionReportEntity>;
}

export interface AlertRepository {
  findByUserId(userId: string): Promise<AlertEntity[]>;
  create(alert: Omit<AlertEntity, 'id' | 'created_at'>): Promise<AlertEntity>;
  toggleStatus(id: string, isEnabled: boolean): Promise<AlertEntity>;
  delete(id: string): Promise<boolean>;
}
