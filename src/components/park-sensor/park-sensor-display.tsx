"use client";

import { ReactElement } from "react";

import { SensorArc } from "./sensor-arc";
import nina005 from "../../assets/Nina005.png";

/**
 * ParkSensorData
 *
 * Each sensor value is 0–8 representing active detection zones.
 *   0 = nothing detected
 *   8 = object extremely close
 *
 * Front sensors (left to right when viewed from above):
 *   frontLeft, frontCenterLeft, frontCenterRight, frontRight
 *
 * Rear sensors (left to right when viewed from above):
 *   rearLeft, rearCenterLeft, rearCenterRight, rearRight
 */
export interface ParkSensorData {
  frontLeft: number;
  frontCenterLeft: number;
  frontCenterRight: number;
  frontRight: number;
  rearLeft: number;
  rearCenterLeft: number;
  rearCenterRight: number;
  rearRight: number;
}

interface ParkSensorDisplayProps {
  sensors: ParkSensorData;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
}

const VB_W = 600;
const VB_H = 800;

// Car silhouette positioning
const CAR_X = 190;
const CAR_Y = 170;
const CAR_W = 220;
const CAR_H = 460;

// Front sensor origin – just ahead of the front bumper
const FRONT_CX = CAR_X + CAR_W / 2;
const FRONT_CY = CAR_Y + 320;

// Rear sensor origin – just behind the rear bumper
const REAR_CX = CAR_X + CAR_W / 2;
const REAR_CY = CAR_Y + CAR_H - 320;

// Arc parameters
const INNER_R = 320; // Much larger for flatter arcs
const RADIUS_STEP = 20;

// Sensor configuration
const SENSOR_PADDING = 1; // degrees between sensors
const OUTER_SENSOR_WIDTH = 14; // degrees (for edge sensors: left, right)
const INNER_SENSOR_WIDTH = 12; // degrees (for center sensors)

// Helper to calculate sensor angle range from center angle and width
const createSensor = (centerAngle: number, width: number) => ({
  startAngle: centerAngle - width / 2,
  endAngle: centerAngle + width / 2,
});

// Helper to calculate sensor center angles from a reference point (0 for front, 180 for rear)
// Sensors are distributed symmetrically around the reference point
const calculateSensorCenters = (
  widths: number[],
  padding: number,
  referenceAngle: number,
): number[] => {
  // Calculate total span needed for all sensors and padding
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + padding * (widths.length - 1);
  const startAngle = referenceAngle - totalWidth / 2;

  // Calculate center angle for each sensor
  let currentAngle = startAngle;
  return widths.map((width) => {
    const centerAngle = currentAngle + width / 2;
    currentAngle += width + padding; // Move to next sensor start, accounting for padding
    return centerAngle;
  });
};

// Sensor widths for front and rear (left to right)
const FRONT_WIDTHS = [
  OUTER_SENSOR_WIDTH,
  INNER_SENSOR_WIDTH,
  INNER_SENSOR_WIDTH,
  OUTER_SENSOR_WIDTH,
];
const REAR_WIDTHS = [
  OUTER_SENSOR_WIDTH,
  INNER_SENSOR_WIDTH,
  INNER_SENSOR_WIDTH,
  OUTER_SENSOR_WIDTH,
];

// Calculate center angles from reference points (0° for front, 180° for rear)
const FRONT_CENTER_ANGLES = calculateSensorCenters(FRONT_WIDTHS, SENSOR_PADDING, 0);
const REAR_CENTER_ANGLES = calculateSensorCenters(REAR_WIDTHS, SENSOR_PADDING, 180);

// Front sensor angles – calculated from center angles and widths
const FRONT_SENSORS = [
  createSensor(FRONT_CENTER_ANGLES[0]!, FRONT_WIDTHS[0]!), // frontLeft
  createSensor(FRONT_CENTER_ANGLES[1]!, FRONT_WIDTHS[1]!), // frontCenterLeft
  createSensor(FRONT_CENTER_ANGLES[2]!, FRONT_WIDTHS[2]!), // frontCenterRight
  createSensor(FRONT_CENTER_ANGLES[3]!, FRONT_WIDTHS[3]!), // frontRight
];

// Rear sensor angles – calculated from center angles and widths
const REAR_SENSORS = [
  createSensor(REAR_CENTER_ANGLES[0]!, REAR_WIDTHS[0]!), // rearLeft
  createSensor(REAR_CENTER_ANGLES[1]!, REAR_WIDTHS[1]!), // rearCenterLeft
  createSensor(REAR_CENTER_ANGLES[2]!, REAR_WIDTHS[2]!), // rearCenterRight
  createSensor(REAR_CENTER_ANGLES[3]!, REAR_WIDTHS[3]!), // rearRight
];

export function ParkSensorDisplay({
  sensors,
  width = 600,
  height = 800,
}: ParkSensorDisplayProps): ReactElement {
  const frontValues = [
    sensors.frontLeft,
    sensors.frontCenterLeft,
    sensors.frontCenterRight,
    sensors.frontRight,
  ];

  const rearValues = [
    sensors.rearLeft,
    sensors.rearCenterLeft,
    sensors.rearCenterRight,
    sensors.rearRight,
  ];

  return (
    <div className="relative inline-block" style={{ width, height }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* SVG filters for glow effects */}
        <defs>
          <filter id="sensorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sensorGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle vignette effect */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Front sensors behind the car */}
        <g>
          {FRONT_SENSORS.map((s, i) => (
            <SensorArc
              key={`front-${i}`}
              value={frontValues[i]!}
              cx={FRONT_CX}
              cy={FRONT_CY}
              startAngle={s.startAngle}
              endAngle={s.endAngle}
              innerRadius={INNER_R}
              radiusStep={RADIUS_STEP}
              outward
            />
          ))}
        </g>

        {/* Rear sensors behind the car */}
        <g>
          {REAR_SENSORS.map((s, i) => (
            <SensorArc
              key={`rear-${i}`}
              value={rearValues[i]!}
              cx={REAR_CX}
              cy={REAR_CY}
              startAngle={s.startAngle}
              endAngle={s.endAngle}
              innerRadius={INNER_R}
              radiusStep={RADIUS_STEP}
              outward
            />
          ))}
        </g>

        {/* Car silhouette on top */}
        {/* Car image on top */}
        <image
          href={nina005}
          x={CAR_X}
          y={CAR_Y}
          width={CAR_W}
          height={CAR_H}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Vignette overlay */}
        {/* <rect width={VB_W} height={VB_H} fill="url(#vignette)" rx="12" /> */}
      </svg>
    </div>
  );
}
