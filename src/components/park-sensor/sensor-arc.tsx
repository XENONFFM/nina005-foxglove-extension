"use client";

import React from "react";

/**
 * Each sensor value is 0–8, representing how many of the 8 detection zones are active.
 * 0 = nothing detected, 8 = object extremely close (all zones lit).
 *
 * Color mapping (inspired by Volvo park sensor reference):
 *   Closest zones (7-8):  red        #DC2626
 *   Medium zones  (4-6):  dark-orange #EA580C
 *   Farthest zones (1-3): amber      #D97706
 *
 * Zone 1 = outermost (farthest away), zone 8 = innermost (closest to bumper).
 * When value = 3, the 3 outermost rings light up.
 * When value = 8, all rings light up, with the innermost being red.
 */

interface SensorArcProps {
  /** Number of active zones 0–8 */
  value: number;
  /** Center X of the arc origin */
  cx: number;
  /** Center Y of the arc origin */
  cy: number;
  /** Start angle in degrees (0 = up/north, clockwise) */
  startAngle: number;
  /** End angle in degrees */
  endAngle: number;
  /** Starting radius from centre */
  innerRadius: number;
  /** Radius added per zone ring */
  radiusStep: number;
  /** Direction: true = arcs grow outward from car */
  outward?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: Math.round((cx + r * Math.cos(rad)) * 100) / 100,
    y: Math.round((cy + r * Math.sin(rad)) * 100) / 100,
  };
}

function describeArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
) {
  const s1 = polarToCartesian(cx, cy, outerR, startAngle);
  const e1 = polarToCartesian(cx, cy, outerR, endAngle);
  const s2 = polarToCartesian(cx, cy, innerR, endAngle);
  const e2 = polarToCartesian(cx, cy, innerR, startAngle);

  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;

  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

/**
 * Returns the fill color for a given ring.
 * ringFromInner: 0 = innermost (closest to car), 7 = outermost (farthest)
 */
function getZoneColor(ringFromInner: number): string {
  if (ringFromInner <= 1) {
    return "#DC2626";
  } // red – closest
  if (ringFromInner <= 4) {
    return "#EA580C";
  } // dark orange – mid
  return "#D97706"; // amber – farthest
}

/**
 * Determines opacity of a ring.
 * Rings light up from outermost → innermost as value increases.
 */
function getZoneOpacity(ringFromInner: number, totalActive: number): number {
  // ringFromInner 0 = closest to car, 7 = farthest
  // totalActive = how many zones lit (1–8)
  // Light the *outermost* first: ring 7,6,5... down to (8-totalActive)

  const ringFromOuter = 7 - ringFromInner;
  if (ringFromOuter >= totalActive) {
    return 0;
  }

  // Closer-to-car (inner) rings are brighter when active
  // Outer active rings are dimmer
  const positionFromOuter = ringFromOuter; // 0 = outermost active
  const maxOpacity = 0.92;
  const minOpacity = 0.3;
  const fade = maxOpacity - positionFromOuter * 0.085;
  return Math.round(Math.max(minOpacity, fade) * 1000) / 1000;
}

export function SensorArc({
  value,
  cx,
  cy,
  startAngle,
  endAngle,
  innerRadius,
  radiusStep,
  outward: _outward = true,
}: SensorArcProps): JSX.Element {
  const clampedValue = Math.max(0, Math.min(8, Math.round(value)));
  if (clampedValue === 0) {
    return <g />;
  }

  const zones: React.ReactNode[] = [];
  const gap = 2; // gap between concentric rings

  for (let i = 0; i < 8; i++) {
    // i = 0 is the innermost ring (closest to car bumper)
    const rInner = innerRadius + i * radiusStep + gap / 2;
    const rOuter = innerRadius + (i + 1) * radiusStep - gap / 2;

    const opacity = getZoneOpacity(i, clampedValue);
    if (opacity <= 0) {
      continue;
    }

    const color = getZoneColor(i);
    const path = describeArc(cx, cy, rInner, rOuter, startAngle, endAngle);

    zones.push(<path key={i} d={path} fill={color} opacity={opacity} />);
  }

  return <g>{zones}</g>;
}
