import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

import { RawSignalVehicleSpeed } from "@/schemas/RawSignalVehicleSpeed";
import { ScaledSignals } from "@/schemas/ScaledSignals";
import { SteeringAndSpeed } from "@/schemas/SteeringAndSpeed";

type MotorStatusProps = {
  scaledSignals?: ScaledSignals;
  steeringAndSpeed?: SteeringAndSpeed;
  rawSignalVehicleSpeed?: RawSignalVehicleSpeed;
};

function formatValue(value: number | undefined, digits = 0): string {
  if (value === undefined || value === null) {
    return "--";
  }
  return value.toFixed(digits);
}

export function MotorStatus({
  scaledSignals,
  steeringAndSpeed,
  rawSignalVehicleSpeed,
}: MotorStatusProps): JSX.Element {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-base">Drive Signals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <Label>Throttle</Label>
            <span className="font-medium">{formatValue(scaledSignals?.throttle_signal, 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Brake</Label>
            <span className="font-medium">{formatValue(scaledSignals?.brake_signal, 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Steering Torque</Label>
            <span className="font-medium">
              {formatValue(scaledSignals?.steering_torque_signal, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Steering Motor Cmd</Label>
            <span className="font-medium">
              {formatValue(scaledSignals?.steering_motor_speed_cmd, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Steering Velocity</Label>
            <span className="font-medium">
              {formatValue(scaledSignals?.steering_velocity_signal, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Curtis Speed Cmd</Label>
            <span className="font-medium">{formatValue(scaledSignals?.curtis_speed_cmd, 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Speed Measured</Label>
            <span className="font-medium">
              {formatValue(steeringAndSpeed?.vehicle_velocity_measured, 2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Speed Raw</Label>
            <span className="font-medium">
              {formatValue(rawSignalVehicleSpeed?.uint8_vehicle_speed, 2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
