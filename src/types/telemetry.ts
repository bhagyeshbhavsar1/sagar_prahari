// SAGAR-PRAHARI Telemetry and Data Models
// SIH 2026 PS-26065 | MoES / NCPOR

export type VehicleMode = 
  | 'SURFACE TRANSIT' 
  | 'UNDERWAY SAMPLING' 
  | 'SHALLOW DIVE' 
  | 'ICE AVOIDANCE' 
  | 'STATION KEEPING' 
  | 'SENTINEL MODE' 
  | 'EMERGENCY ASCENT';

export type QCFlag = 'GOOD' | 'WARNING' | 'SUSPECT' | 'MISSING' | 'INVALID';

export type SubsystemStatus = 'OK' | 'WARNING' | 'FAULT' | 'OFFLINE';

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  targetDepth: number;
  status: 'COMPLETED' | 'ACTIVE' | 'QUEUED';
}

export interface IceHazard {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'WARNING' | 'CAUTION' | 'CRITICAL';
  distanceKm: number;
  iceConcentration: number; // percentage
  floeSizeMeters?: number;
}

export interface DiveRecord {
  id: number;
  startTimeUTC: string;
  durationSeconds: number;
  maxDepthMeters: number;
  minBottomClearanceMeters: number;
  deadReckoningErrorMeters: number;
  energyUsedWh: number;
  purpose: string;
  abortReason: string | null;
  profilePoints: { time: number; depth: number }[];
}

export interface TelemetryState {
  // Navigation & Pose
  timestampUTC: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  headingDeg: number;
  speedMs: number;
  depthMeters: number;
  pitchDeg: number;
  rollDeg: number;
  mode: VehicleMode;
  gnssQuality: number; // 0.0 - 1.0 (e.g. 0.92 RTK Fix)
  gnssSource: string; // 'GNSS (RTK/DGNSS) + INS'
  geofenceStatus: 'OK' | 'WARNING' | 'BREACH';
  
  // Under-ice & Uncertainty
  uncertainty1sigmaKm: number;
  uncertainty2sigmaKm: number;
  underIceSegmentActive: boolean;
  distanceTraveledKm: number;
  plannedDistanceKm: number;
  avgSpeedMs: number;
  maxSpeedMs: number;

  // Power System
  mainBusVoltageV: number;
  mainBusCurrentA: number;
  mainBusPowerW: number;
  mainBatterySOC: number; // percentage (0-100)
  mainBatteryCapacityWh: number; // 1152 Wh total
  mainBatteryRemainingWh: number;
  mainBatteryTempC: number;

  sentinelBusSOC: number;
  sentinelBusRemainingWh: number;
  sentinelLowPowerStatus: boolean;

  solarInputWatts: number;
  solarDailyWh: number;
  solarPeakWatts: number;
  solarStatus: string;

  powerBreakdown: {
    propulsionW: number;
    computeW: number;
    sensorsW: number;
    commsW: number;
    othersW: number;
  };

  // Environmental Oceanographic Parameters
  waterTempC: number;
  waterTempTier: 'MVP' | 'PRODUCTION';
  waterTempAccuracy: string;

  practicalSalinityPSU: number;
  practicalSalinityTier: 'MVP' | 'PRODUCTION';

  turbidityNTU: number;
  chlorophyllUgl: number | null;
  phValue: number | null;
  dissolvedOxygenMgL: number | null;
  conductivityMSCm: number;
  orpMV: number | null;

  // Atmospheric & Waves
  airTempC: number;
  relativeHumidityPct: number;
  airPressureHpa: number;
  windSpeedMs: number;
  windDirectionDeg: number;
  windDirectionText: string;

  significantWaveHeightM: number;
  peakWavePeriodS: number;
  waveDirectionDeg: number;
  waveDirectionText: string;

  // Hazards & Ice
  seaIceConcentrationPct: number;
  iceTypeClassification: string;
  detectedHazards: IceHazard[];
  estimatedIceThicknessM: number;

  // System Diagnostics & Safety
  electronicsPodTempC: number;
  mainComputerTempC: number;
  internalHumidityPct: number;
  leakStatus: 'CLEAR' | 'HULL_LEAK' | 'POD_LEAK' | 'DUAL_LEAK';
  mbtBallastState: 'SURFACED' | 'DIVING' | 'NEUTRAL' | 'BLOWN_ASCENT';
  commsLinkStatus: 'CONNECTED' | 'DEGRADED' | 'LOST';
  commsLastContactSecAgo: number;

  subsystemHealth: {
    propulsion: SubsystemStatus;
    power: SubsystemStatus;
    compute: SubsystemStatus;
    sensors: SubsystemStatus;
    communications: SubsystemStatus;
    mechanical: SubsystemStatus;
  };
}

export interface SensorQCItem {
  sensorName: string;
  subsystem: string;
  status: 'Good' | 'Warning' | 'Suspect' | 'Offline';
  qualityPct: number;
  lastReadingUTC: string;
  calibrationInfo: string;
}

export interface CommandLogItem {
  id: number;
  timestampUTC: string;
  command: string;
  issuedBy: string;
  status: 'Pending' | 'Sent' | 'Success' | 'Rejected' | 'Aborted';
  approvalState: 'APPROVED' | 'REQUIRES_CONFIRMATION' | 'SYSTEM_AUTO';
}
