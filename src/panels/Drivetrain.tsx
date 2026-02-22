import { MotorStatus } from "./MotorStatus";
import { RaceCar } from "./RaceCar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

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

function formatValue(value: number | undefined, digits = 2): string {
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

export function DriveTrain({
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
}: DrivetrainProps): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-6 w-full p-4">
      <div className="flex flex-col gap-4">
        <MotorStatus
          scaledSignals={scaledSignals}
          steeringAndSpeed={steeringAndSpeed}
          rawSignalVehicleSpeed={rawSignalVehicleSpeed}
        />
        <Card className="">
          <CardHeader>
            <CardTitle className="text-base">Steering and Speed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <ValueRow
              label="Speed Requested"
              value={`${formatValue(steeringAndSpeed?.vehicle_velocity_requested, 2)} m/s`}
            />
            <ValueRow
              label="Speed Measured"
              value={`${formatValue(steeringAndSpeed?.vehicle_velocity_measured, 2)} m/s`}
            />
            <ValueRow
              label="Steering Requested"
              value={`${formatValue(steeringAndSpeed?.steering_position_requested, 2)} %`}
            />
            <ValueRow
              label="Steering Measured"
              value={`${formatValue(steeringAndSpeed?.steering_position_measured, 2)} %`}
            />
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle className="text-base">Battery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <ValueRow
              label="Discharge"
              value={`${formatValue(batteryStatus?.battery_discharge_percent, 0)} %`}
            />
            <ValueRow
              label="Current"
              value={`${formatValue(batteryStatus?.battery_current, 2)} A`}
            />
            <ValueRow
              label="Voltage"
              value={`${formatValue(batteryStatus?.battery_voltage, 2)} V`}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col items-center gap-4">
        <RaceCar />
      </div>
      <div className="flex flex-col gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-base">Temperatures</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <ValueRow
              label="Steering Inverter"
              value={`${formatValue(temperatures?.steering_motor_inverter_temp, 0)} C`}
            />
            <ValueRow
              label="Steering Motor"
              value={`${formatValue(temperatures?.steering_motor_temp, 0)} C`}
            />
            <ValueRow
              label="Curtis Controller"
              value={`${formatValue(temperatures?.curtis_controller_temp, 0)} C`}
            />
            <ValueRow
              label="Curtis Motor"
              value={`${formatValue(temperatures?.curtis_motor_temp, 0)} C`}
            />
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle className="text-base">Raw Signals</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <ValueRow
              label="Brake A"
              value={formatValue(rawSignalBrake?.uint32_signal_brake_a, 0)}
            />
            <ValueRow
              label="Brake B"
              value={formatValue(rawSignalBrake?.uint32_signal_brake_b, 0)}
            />
            <ValueRow
              label="Throttle A"
              value={formatValue(rawSignalThrottle?.uint32_signal_throttle_a, 0)}
            />
            <ValueRow
              label="Throttle B"
              value={formatValue(rawSignalThrottle?.uint32_signal_throttle_b, 0)}
            />
            <ValueRow
              label="Steering Enc A"
              value={formatValue(rawSignalSteeringPosition?.uint16_encoder_raw_value_a, 0)}
            />
            <ValueRow
              label="Steering Enc B"
              value={formatValue(rawSignalSteeringPosition?.uint16_encoder_raw_value_b, 0)}
            />
            <ValueRow
              label="Steering Force A"
              value={formatValue(rawSignalSteeringForce?.uint32_signal_steering_force_a, 0)}
            />
            <ValueRow
              label="Steering Force B"
              value={formatValue(rawSignalSteeringForce?.uint32_signal_steering_force_b, 0)}
            />
            <ValueRow
              label="Steering Vel"
              value={formatValue(rawSignalSteeringVelocity?.int16_steering_velocity, 2)}
            />
            <ValueRow
              label="Steering Vel Cmd"
              value={formatValue(rawSignalSteeringVelocityCmd?.int16_steering_velocity_cmd, 2)}
            />
            <ValueRow
              label="Throttle Cmd"
              value={formatValue(rawSignalThrottlePotiCmd?.uint16_poti_throttle_cmd, 0)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
