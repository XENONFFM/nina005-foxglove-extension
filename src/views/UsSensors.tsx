"use client";

import { type ReactElement } from "react";

import {
  ParkSensorDisplay,
  type ParkSensorData,
} from "@/components/park-sensor/park-sensor-display";
import { SensorControls } from "@/components/park-sensor/sensor-controls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { USSensorFront, USSensorRear } from "@/schemas";

/**
 * Maps USSensorFront and USSensorRear ROS messages to ParkSensorData format
 *
 * Sensor mapping (left to right when viewed from above):
 * - Front: u_s_sensor4 (left), u_s_sensor3 (center-left), u_s_sensor2 (center-right), u_s_sensor1 (right)
 * - Rear: u_s_sensor8 (left), u_s_sensor7 (center-left), u_s_sensor6 (center-right), u_s_sensor5 (right)
 */
function mapSensorsToDisplay(front?: USSensorFront, rear?: USSensorRear): ParkSensorData {
  return {
    frontLeft: front?.u_s_sensor4 ?? 0,
    frontCenterLeft: front?.u_s_sensor3 ?? 0,
    frontCenterRight: front?.u_s_sensor2 ?? 0,
    frontRight: front?.u_s_sensor1 ?? 0,
    rearLeft: rear?.u_s_sensor8 ?? 0,
    rearCenterLeft: rear?.u_s_sensor7 ?? 0,
    rearCenterRight: rear?.u_s_sensor6 ?? 0,
    rearRight: rear?.u_s_sensor5 ?? 0,
  };
}

interface UsSensorsProps {
  usSensorFront?: USSensorFront;
  usSensorRear?: USSensorRear;
  showDisplay?: boolean;
  showControls?: boolean;
}

export function UsSensors({
  usSensorFront,
  usSensorRear,
  showDisplay = true,
  showControls = true,
}: UsSensorsProps): ReactElement {
  const sensors = mapSensorsToDisplay(usSensorFront, usSensorRear);

  return (
    <main className="flex flex-row lg:flex-row items-center justify-center gap-10 p-6">
      {showDisplay && <ParkSensorDisplay sensors={sensors} width={480} height={680} />}
      {showControls && (
        <Card className="w-fit max-w-full min-w-xs">
          <CardHeader>
            <h2 className="text-base font-semibold mb-5 tracking-wide">Ultrasonic Sensors</h2>
          </CardHeader>
          <CardContent>
            <SensorControls sensors={sensors} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
