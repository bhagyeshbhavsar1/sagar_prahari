import { TelemetryState, DiveRecord, SensorQCItem, CommandLogItem, Waypoint, IceHazard } from '../types/telemetry';

export const INITIAL_WAYPOINTS: Waypoint[] = [
  { id: 'WP-01', lat: -62.1834, lng: 58.9921, name: 'Prydz Bay Entry', targetDepth: 0, status: 'COMPLETED' },
  { id: 'WP-02', lat: -62.2011, lng: 59.1023, name: 'Shelf Break Transect', targetDepth: 1.5, status: 'COMPLETED' },
  { id: 'WP-03', lat: -62.2540, lng: 59.4655, name: 'Pack Ice Boundary', targetDepth: 5.2, status: 'ACTIVE' },
  { id: 'WP-04', lat: -62.3122, lng: 59.8841, name: 'Under-Ice Station A', targetDepth: 4.8, status: 'QUEUED' },
  { id: 'WP-05', lat: -62.4015, lng: 60.2203, name: 'Sub-ice CTD Profile', targetDepth: 6.0, status: 'QUEUED' },
  { id: 'WP-06', lat: -62.5112, lng: 60.7811, name: 'Polynya Recovery Pt', targetDepth: 0, status: 'QUEUED' },
];

export const INITIAL_HAZARDS: IceHazard[] = [
  {
    id: 'H1',
    lat: -62.2700,
    lng: 59.5200,
    type: 'High ice concentration floe field',
    severity: 'WARNING',
    distanceKm: 2.1,
    iceConcentration: 78,
    floeSizeMeters: 45
  },
  {
    id: 'H2',
    lat: -62.3500,
    lng: 60.0500,
    type: 'Subsurface ice keel overhang',
    severity: 'CAUTION',
    distanceKm: 11.8,
    iceConcentration: 62,
    floeSizeMeters: 120
  }
];

export const INITIAL_DIVE_LOGS: DiveRecord[] = [
  {
    id: 12,
    startTimeUTC: '2026-10-04 07:14:12',
    durationSeconds: 112,
    maxDepthMeters: 5.2,
    minBottomClearanceMeters: 1.4,
    deadReckoningErrorMeters: 0.85,
    energyUsedWh: 7.6,
    purpose: 'Under-ice CTD & sonar survey',
    abortReason: null,
    profilePoints: [
      { time: 0, depth: 0.0 },
      { time: 10, depth: 0.8 },
      { time: 25, depth: 2.4 },
      { time: 40, depth: 5.2 },
      { time: 70, depth: 5.2 },
      { time: 90, depth: 2.1 },
      { time: 112, depth: 0.0 }
    ]
  },
  {
    id: 11,
    startTimeUTC: '2026-10-03 04:21:05',
    durationSeconds: 95,
    maxDepthMeters: 3.8,
    minBottomClearanceMeters: 2.1,
    deadReckoningErrorMeters: 0.62,
    energyUsedWh: 6.8,
    purpose: 'Underside ice draft scan',
    abortReason: null,
    profilePoints: [
      { time: 0, depth: 0.0 },
      { time: 15, depth: 1.5 },
      { time: 35, depth: 3.8 },
      { time: 65, depth: 3.8 },
      { time: 80, depth: 1.2 },
      { time: 95, depth: 0.0 }
    ]
  },
  {
    id: 10,
    startTimeUTC: '2026-10-02 21:10:40',
    durationSeconds: 108,
    maxDepthMeters: 4.6,
    minBottomClearanceMeters: 1.8,
    deadReckoningErrorMeters: 0.91,
    energyUsedWh: 7.4,
    purpose: 'Science sampling profile',
    abortReason: null,
    profilePoints: [
      { time: 0, depth: 0.0 },
      { time: 20, depth: 2.1 },
      { time: 45, depth: 4.6 },
      { time: 75, depth: 4.6 },
      { time: 95, depth: 1.8 },
      { time: 108, depth: 0.0 }
    ]
  },
  {
    id: 9,
    startTimeUTC: '2026-10-02 16:03:12',
    durationSeconds: 120,
    maxDepthMeters: 5.0,
    minBottomClearanceMeters: 1.5,
    deadReckoningErrorMeters: 1.10,
    energyUsedWh: 7.9,
    purpose: 'Max depth test dive',
    abortReason: 'Time limit 120s reached (MVP Gate)',
    profilePoints: [
      { time: 0, depth: 0.0 },
      { time: 20, depth: 2.0 },
      { time: 50, depth: 5.0 },
      { time: 90, depth: 5.0 },
      { time: 110, depth: 2.0 },
      { time: 120, depth: 0.0 }
    ]
  }
];

export const INITIAL_SENSOR_QC: SensorQCItem[] = [
  { sensorName: 'GNSS (ZED-F9P Stub 1)', subsystem: 'Navigation', status: 'Good', qualityPct: 99.4, lastReadingUTC: '08:31:12', calibrationInfo: 'RTK Base Lock / Baseline 4.2 km' },
  { sensorName: 'IMU (Pixhawk 6C Control)', subsystem: 'Attitude', status: 'Good', qualityPct: 98.6, lastReadingUTC: '08:31:12', calibrationInfo: 'Calibrated 2026-09-28' },
  { sensorName: 'Water Temp (PT-1000 RTD)', subsystem: 'CTD Ocean Science', status: 'Good', qualityPct: 97.8, lastReadingUTC: '08:31:10', calibrationInfo: '±0.15 °C MVP Grade (NIST Traceable)' },
  { sensorName: 'Salinity (EZO-EC Module)', subsystem: 'CTD Ocean Science', status: 'Good', qualityPct: 96.2, lastReadingUTC: '08:31:10', calibrationInfo: 'Calibrated at 53.0 mS/cm std' },
  { sensorName: 'Depth (Blue Robotics Bar30)', subsystem: 'Hydrostatics', status: 'Good', qualityPct: 99.1, lastReadingUTC: '08:31:12', calibrationInfo: 'Zeroed at surface pressure 987 hPa' },
  { sensorName: 'Turbidity (Optical Sensor)', subsystem: 'Ocean Science', status: 'Good', qualityPct: 94.5, lastReadingUTC: '08:31:05', calibrationInfo: 'Formazin 0-100 NTU scale' },
  { sensorName: 'pH (EZO-pH Glass Electrode)', subsystem: 'Ocean Science', status: 'Good', qualityPct: 93.0, lastReadingUTC: '08:31:03', calibrationInfo: 'Field Prototype (2-point cal)' },
  { sensorName: 'Chlorophyll-a Fluorometer', subsystem: 'Ocean Science', status: 'Good', qualityPct: 92.1, lastReadingUTC: '08:31:02', calibrationInfo: 'Field Prototype Tier' },
  { sensorName: 'Dissolved Oxygen Optode', subsystem: 'Ocean Science', status: 'Good', qualityPct: 95.8, lastReadingUTC: '08:31:05', calibrationInfo: 'Production Upgrade / Field Tier' },
  { sensorName: 'Iridium SBD 9603 Modem', subsystem: 'Comms', status: 'Good', qualityPct: 100.0, lastReadingUTC: '06:30:55', calibrationInfo: 'Signal strength 5/5 bars' },
  { sensorName: 'Solar Deck Array Logger', subsystem: 'Power', status: 'Good', qualityPct: 96.4, lastReadingUTC: '08:31:12', calibrationInfo: 'MPPT Efficiency 94.2%' },
  { sensorName: 'Battery Monitor (BMS A/B)', subsystem: 'Power', status: 'Good', qualityPct: 99.0, lastReadingUTC: '08:31:12', calibrationInfo: 'Shunt active 0-50A' }
];

export const INITIAL_COMMAND_LOG: CommandLogItem[] = [
  { id: 32, timestampUTC: '08:29:14', command: 'Set Mode -> SURFACE_TRANSIT', issuedBy: 'Operator (Ground Station)', status: 'Success', approvalState: 'APPROVED' },
  { id: 31, timestampUTC: '08:27:41', command: 'Start Ocean Sampling (CTD + Turbidity)', issuedBy: 'Autonomous Mission Plan', status: 'Success', approvalState: 'SYSTEM_AUTO' },
  { id: 30, timestampUTC: '08:25:10', command: 'Set Waypoint WP-03 (-62.2540°, 59.4655°)', issuedBy: 'Operator (Ground Station)', status: 'Success', approvalState: 'APPROVED' },
  { id: 29, timestampUTC: '08:21:03', command: 'Start Dive (Target Depth 1.5 m)', issuedBy: 'Operator (Ground Station)', status: 'Success', approvalState: 'APPROVED' },
  { id: 28, timestampUTC: '08:18:56', command: 'Capture Forward Mast Photo', issuedBy: 'Autonomous Ice Classifier', status: 'Success', approvalState: 'SYSTEM_AUTO' }
];

// Generate 24-hour historical telemetry time-series
export const generate24hHistory = () => {
  const points = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const hourStr = time.getHours().toString().padStart(2, '0') + ':00';
    
    // Day night cycle for solar
    const hour = time.getHours();
    const isDay = hour >= 4 && hour <= 20;
    const solarVal = isDay ? Math.max(0, Math.sin((hour - 4) / 16 * Math.PI) * 65 + (Math.random() * 6 - 3)) : 0;
    
    points.push({
      timeLabel: `${i === 0 ? 'Now' : `-${i}h`}`,
      timestampUTC: hourStr,
      waterTempC: -1.6 + Math.sin(i / 3) * 0.15 + (Math.random() * 0.04 - 0.02),
      salinityPSU: 34.2 + Math.cos(i / 4) * 0.12 + (Math.random() * 0.05 - 0.025),
      turbidityNTU: 0.8 + Math.sin(i / 2) * 0.2 + (Math.random() * 0.05),
      airTempC: -6.3 + Math.sin(i / 5) * 1.8 + (Math.random() * 0.3 - 0.15),
      windSpeedMs: 8.4 + Math.cos(i / 2) * 2.2 + (Math.random() * 0.8 - 0.4),
      waveHeightM: 0.8 + Math.sin(i / 3) * 0.25 + (Math.random() * 0.06 - 0.03),
      solarWatts: Math.round(solarVal),
      mainBusVoltage: 24.8 + Math.sin(i / 6) * 0.4,
      mainBusCurrent: 3.1 + Math.cos(i / 3) * 0.8,
      batterySOC: Math.max(40, Math.round(85 - (24 - i) * 0.6 + (solarVal > 20 ? 0.3 : 0))),
      iceConcentration: Math.min(90, Math.max(10, Math.round(35 + (24 - i) * 0.8 + Math.sin(i / 2) * 5))),
      iceThicknessM: 1.2 + Math.sin(i / 4) * 0.45,
      uncertainty1sigma: 0.35 + (i > 12 ? 0.2 : 0.05) + (Math.random() * 0.03)
    });
  }
  return points;
};

export const getInitialTelemetryState = (): TelemetryState => ({
  timestampUTC: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
  vehicleId: 'SP-01',
  latitude: -62.1834,
  longitude: 58.9921,
  headingDeg: 214.5,
  speedMs: 0.58,
  depthMeters: 0.42,
  pitchDeg: -0.6,
  rollDeg: 1.8,
  mode: 'SURFACE TRANSIT',
  gnssQuality: 0.92,
  gnssSource: 'Dual ZED-F9P RTK + Pixhawk INS',
  geofenceStatus: 'OK',

  uncertainty1sigmaKm: 0.48,
  uncertainty2sigmaKm: 1.02,
  underIceSegmentActive: false,
  distanceTraveledKm: 18.4,
  plannedDistanceKm: 120.0,
  avgSpeedMs: 0.61,
  maxSpeedMs: 1.12,

  mainBusVoltageV: 24.8,
  mainBusCurrentA: 3.1,
  mainBusPowerW: 77.0,
  mainBatterySOC: 71,
  mainBatteryCapacityWh: 1152,
  mainBatteryRemainingWh: 818,
  mainBatteryTempC: 3.2,

  sentinelBusSOC: 96,
  sentinelBusRemainingWh: 361,
  sentinelLowPowerStatus: false,

  solarInputWatts: 40,
  solarDailyWh: 520,
  solarPeakWatts: 68,
  solarStatus: 'Charging (Normal)',

  powerBreakdown: {
    propulsionW: 48,
    computeW: 16,
    sensorsW: 8,
    commsW: 4,
    othersW: 1
  },

  waterTempC: -1.6,
  waterTempTier: 'MVP',
  waterTempAccuracy: '±0.15 °C',

  practicalSalinityPSU: 34.2,
  practicalSalinityTier: 'MVP',

  turbidityNTU: 0.8,
  chlorophyllUgl: 1.2,
  phValue: 8.1,
  dissolvedOxygenMgL: 7.4,
  conductivityMSCm: 45.8,
  orpMV: 112,

  airTempC: -6.3,
  relativeHumidityPct: 76,
  airPressureHpa: 987,
  windSpeedMs: 8.4,
  windDirectionDeg: 312,
  windDirectionText: '312° (NW)',

  significantWaveHeightM: 0.8,
  peakWavePeriodS: 6.4,
  waveDirectionDeg: 298,
  waveDirectionText: '298° (WNW)',

  seaIceConcentrationPct: 42,
  iceTypeClassification: 'Pack ice (loose floes)',
  detectedHazards: INITIAL_HAZARDS,
  estimatedIceThicknessM: 1.4,

  electronicsPodTempC: 12.4,
  mainComputerTempC: 11.8,
  internalHumidityPct: 28,
  leakStatus: 'CLEAR',
  mbtBallastState: 'SURFACED',
  commsLinkStatus: 'CONNECTED',
  commsLastContactSecAgo: 4,

  subsystemHealth: {
    propulsion: 'OK',
    power: 'OK',
    compute: 'OK',
    sensors: 'OK',
    communications: 'OK',
    mechanical: 'OK'
  }
});
