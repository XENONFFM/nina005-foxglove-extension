import { ReactElement } from "react";

import { TelemetryCard } from "@/components/telemetry-card";
import { RawSignalBrake } from "@/schemas/RawSignalBrake";
import { RawSignalSteeringForce } from "@/schemas/RawSignalSteeringForce";
import { RawSignalSteeringPosition } from "@/schemas/RawSignalSteeringPosition";
import { RawSignalSteeringVelocity } from "@/schemas/RawSignalSteeringVelocity";
import { RawSignalSteeringVelocityCmd } from "@/schemas/RawSignalSteeringVelocityCmd";
import { RawSignalThrottle } from "@/schemas/RawSignalThrottle";
import { RawSignalThrottlePotiCmd } from "@/schemas/RawSignalThrottlePotiCmd";
import { RawSignalVehicleSpeed } from "@/schemas/RawSignalVehicleSpeed";

type SignalsProps = {
  rawSignalBrake?: RawSignalBrake;
  rawSignalThrottle?: RawSignalThrottle;
  rawSignalSteeringPosition?: RawSignalSteeringPosition;
  rawSignalSteeringForce?: RawSignalSteeringForce;
  rawSignalSteeringVelocity?: RawSignalSteeringVelocity;
  rawSignalSteeringVelocityCmd?: RawSignalSteeringVelocityCmd;
  rawSignalThrottlePotiCmd?: RawSignalThrottlePotiCmd;
  rawSignalVehicleSpeed?: RawSignalVehicleSpeed;
};

export function Signals({
  rawSignalBrake,
  rawSignalThrottle,
  rawSignalSteeringPosition,
  rawSignalSteeringForce,
  rawSignalSteeringVelocity,
  rawSignalSteeringVelocityCmd,
  rawSignalThrottlePotiCmd,
  rawSignalVehicleSpeed,
}: SignalsProps): ReactElement {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <TelemetryCard
        title="Brake and Throttle"
        message={{
          ...rawSignalBrake,
          ...rawSignalThrottle,
          ...rawSignalThrottlePotiCmd,
        }}
      />
      <TelemetryCard
        title="Steering Raw"
        message={{
          ...rawSignalSteeringPosition,
          ...rawSignalSteeringForce,
          ...rawSignalSteeringVelocity,
          ...rawSignalSteeringVelocityCmd,
        }}
      />
      <TelemetryCard title="Speed Raw" message={rawSignalVehicleSpeed} />
    </div>
  );
}
