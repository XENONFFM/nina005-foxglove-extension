import { type ReactElement } from "react";

import { Car } from "@/components/car";
import { TelemetryCard } from "@/components/telemetry-card";
import { BatteryStatus } from "@/schemas/BatteryStatus";
import { RawSignalBrake } from "@/schemas/RawSignalBrake";
import { RawSignalSteeringForce } from "@/schemas/RawSignalSteeringForce";
import { RawSignalSteeringPosition } from "@/schemas/RawSignalSteeringPosition";
import { RawSignalSteeringVelocity } from "@/schemas/RawSignalSteeringVelocity";
import { RawSignalSteeringVelocityCmd } from "@/schemas/RawSignalSteeringVelocityCmd";
import { RawSignalThrottle } from "@/schemas/RawSignalThrottle";
import { RawSignalThrottlePotiCmd } from "@/schemas/RawSignalThrottlePotiCmd";
import { RawSignalVehicleSpeed } from "@/schemas/RawSignalVehicleSpeed";
import { ScaledSignals } from "@/schemas/ScaledSignals";
import { SteeringAndSpeed } from "@/schemas/SteeringAndSpeed";
import { Temperatures } from "@/schemas/Temperatures";

type DrivetrainProps = {
  batteryStatus?: BatteryStatus;
  scaledSignals?: ScaledSignals;
  steeringAndSpeed?: SteeringAndSpeed;
  temperatures?: Temperatures;
  rawSignalBrake?: RawSignalBrake;
  rawSignalThrottle?: RawSignalThrottle;
  rawSignalSteeringPosition?: RawSignalSteeringPosition;
  rawSignalSteeringForce?: RawSignalSteeringForce;
  rawSignalSteeringVelocity?: RawSignalSteeringVelocity;
  rawSignalSteeringVelocityCmd?: RawSignalSteeringVelocityCmd;
  rawSignalThrottlePotiCmd?: RawSignalThrottlePotiCmd;
  rawSignalVehicleSpeed?: RawSignalVehicleSpeed;
};

export function Vehicle({
  batteryStatus,
  scaledSignals,
  steeringAndSpeed,
  temperatures,
  rawSignalBrake,
  rawSignalThrottle,
  rawSignalSteeringPosition,
  rawSignalSteeringForce,
  rawSignalSteeringVelocity,
  rawSignalSteeringVelocityCmd,
  rawSignalThrottlePotiCmd,
  rawSignalVehicleSpeed,
}: DrivetrainProps): ReactElement {
  return (
    <div className="grid grid-cols-3 gap-6 w-full p-4">
      <div className="flex flex-col gap-4">
        <TelemetryCard
          title="Drive Signals"
          message={{
            ...scaledSignals,
            ...steeringAndSpeed,
            ...rawSignalVehicleSpeed,
          }}
        />
        <TelemetryCard title="Steering and Speed" message={steeringAndSpeed} />
        <TelemetryCard title="Battery" message={batteryStatus} />
      </div>
      <div className="flex flex-col items-center gap-4">
        <Car />
      </div>
      <div className="flex flex-col gap-4">
        <TelemetryCard title="Temperatures" message={temperatures} />
        <TelemetryCard
          title="Raw Signals"
          message={{
            ...rawSignalBrake,
            ...rawSignalThrottle,
            ...rawSignalSteeringPosition,
            ...rawSignalSteeringForce,
            ...rawSignalSteeringVelocity,
            ...rawSignalSteeringVelocityCmd,
            ...rawSignalThrottlePotiCmd,
          }}
        />
      </div>
    </div>
  );
}
