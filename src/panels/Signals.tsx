import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

import { RawSignalBrake } from "@/schemas/RawSignalBrake";
import { RawSignalSteeringForce } from "@/schemas/RawSignalSteeringForce";
import { RawSignalSteeringPosition } from "@/schemas/RawSignalSteeringPosition";
import { RawSignalSteeringVelocity } from "@/schemas/RawSignalSteeringVelocity";
import { RawSignalSteeringVelocityCmd } from "@/schemas/RawSignalSteeringVelocityCmd";
import { RawSignalThrottle } from "@/schemas/RawSignalThrottle";
import { RawSignalThrottlePotiCmd } from "@/schemas/RawSignalThrottlePotiCmd";
import { RawSignalVehicleSpeed } from "@/schemas/RawSignalVehicleSpeed";
import { ReactElement } from "react";

type SignalsPanelProps = {
  rawSignalBrake?: RawSignalBrake;
  rawSignalThrottle?: RawSignalThrottle;
  rawSignalSteeringPosition?: RawSignalSteeringPosition;
  rawSignalSteeringForce?: RawSignalSteeringForce;
  rawSignalSteeringVelocity?: RawSignalSteeringVelocity;
  rawSignalSteeringVelocityCmd?: RawSignalSteeringVelocityCmd;
  rawSignalThrottlePotiCmd?: RawSignalThrottlePotiCmd;
  rawSignalVehicleSpeed?: RawSignalVehicleSpeed;
};

function formatValue(value: number | undefined, digits = 0): string {
  if (value === undefined || value === null) {
    return "--";
  }
  return value.toFixed(digits);
}

function ValueRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SignalsPanel({
  rawSignalBrake,
  rawSignalThrottle,
  rawSignalSteeringPosition,
  rawSignalSteeringForce,
  rawSignalSteeringVelocity,
  rawSignalSteeringVelocityCmd,
  rawSignalThrottlePotiCmd,
  rawSignalVehicleSpeed,
}: SignalsPanelProps): ReactElement {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brake and Throttle</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ValueRow label="Brake A" value={formatValue(rawSignalBrake?.uint32_signal_brake_a)} />
          <ValueRow label="Brake B" value={formatValue(rawSignalBrake?.uint32_signal_brake_b)} />
          <ValueRow
            label="Throttle A"
            value={formatValue(rawSignalThrottle?.uint32_signal_throttle_a)}
          />
          <ValueRow
            label="Throttle B"
            value={formatValue(rawSignalThrottle?.uint32_signal_throttle_b)}
          />
          <ValueRow
            label="Throttle Cmd"
            value={formatValue(rawSignalThrottlePotiCmd?.uint16_poti_throttle_cmd)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Steering Raw</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ValueRow
            label="Encoder A"
            value={formatValue(rawSignalSteeringPosition?.uint16_encoder_raw_value_a)}
          />
          <ValueRow
            label="Encoder B"
            value={formatValue(rawSignalSteeringPosition?.uint16_encoder_raw_value_b)}
          />
          <ValueRow
            label="Force A"
            value={formatValue(rawSignalSteeringForce?.uint32_signal_steering_force_a)}
          />
          <ValueRow
            label="Force B"
            value={formatValue(rawSignalSteeringForce?.uint32_signal_steering_force_b)}
          />
          <ValueRow
            label="Velocity"
            value={formatValue(rawSignalSteeringVelocity?.int16_steering_velocity, 2)}
          />
          <ValueRow
            label="Velocity Cmd"
            value={formatValue(rawSignalSteeringVelocityCmd?.int16_steering_velocity_cmd, 2)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Speed Raw</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ValueRow
            label="Vehicle Speed"
            value={formatValue(rawSignalVehicleSpeed?.uint8_vehicle_speed, 2)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
