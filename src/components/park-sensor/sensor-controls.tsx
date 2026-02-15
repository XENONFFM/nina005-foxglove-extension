"use client";

import React from "react";

import type { ParkSensorData } from "./park-sensor-display";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

interface SensorControlsProps {
  sensors: ParkSensorData;
}

const SENSOR_LABELS: { key: keyof ParkSensorData; label: string; group: string }[] = [
  { key: "frontLeft", label: "Front Left", group: "Front" },
  { key: "frontCenterLeft", label: "Front Center-L", group: "Front" },
  { key: "frontCenterRight", label: "Front Center-R", group: "Front" },
  { key: "frontRight", label: "Front Right", group: "Front" },
  { key: "rearLeft", label: "Rear Left", group: "Rear" },
  { key: "rearCenterLeft", label: "Rear Center-L", group: "Rear" },
  { key: "rearCenterRight", label: "Rear Center-R", group: "Rear" },
  { key: "rearRight", label: "Rear Right", group: "Rear" },
];

function getZoneColor(value: number): string {
  if (value === 0) {
    return "hsl(var(--muted))";
  }
  if (value <= 3) {
    return "#D97706";
  }
  if (value <= 5) {
    return "#EA580C";
  }
  return "#DC2626";
}

export function SensorControls({ sensors }: SensorControlsProps): JSX.Element {
  const groups = ["Front", "Rear"];

  return (
    <div className="flex flex-col gap-6 w-full max-w-xs">
      {groups.map((group) => (
        <div key={group} className="space-y-4">
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-amber-600">
              {group} Sensors
            </h3>
            <Separator className="mt-2" />
          </div>
          <div className="space-y-4">
            {SENSOR_LABELS.filter((s) => s.group === group).map((sensor) => {
              const value = sensors[sensor.key];
              const color = getZoneColor(value);
              return (
                <div key={sensor.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">{sensor.label}</Label>
                    <span className="text-xs font-mono font-bold" style={{ color }}>
                      {value}/8
                    </span>
                  </div>
                  {/* Visual bar indicator */}
                  <div className="flex items-center gap-1 w-full">
                    {Array.from({ length: 8 }, (_, i) => {
                      const isActive = i < value;
                      let barColor = "hsl(var(--muted))";
                      if (isActive) {
                        if (i < 3) {
                          barColor = "#D97706";
                        } else if (i < 5) {
                          barColor = "#EA580C";
                        } else {
                          barColor = "#DC2626";
                        }
                      }
                      return (
                        <button
                          key={i}
                          type="button"
                          className="flex-1 h-3 rounded-sm transition-all duration-200 hover:opacity-80 border-0 cursor-pointer min-w-0"
                          style={{
                            backgroundColor: barColor,
                            boxShadow: isActive ? `0 0 8px ${barColor}40` : "none",
                          }}
                          aria-label={`Set ${sensor.label} to zone ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
