import { type ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApplicationStatus } from "@/schemas/ApplicationStatus";
import { BatteryStatus } from "@/schemas/BatteryStatus";
import { GeneralVehicleStatus } from "@/schemas/GeneralVehicleStatus";
import { RawSignalBrake } from "@/schemas/RawSignalBrake";
import { RawSignalSteeringForce } from "@/schemas/RawSignalSteeringForce";
import { RawSignalSteeringPosition } from "@/schemas/RawSignalSteeringPosition";
import { RawSignalSteeringVelocity } from "@/schemas/RawSignalSteeringVelocity";
import { RawSignalSteeringVelocityCmd } from "@/schemas/RawSignalSteeringVelocityCmd";
import { RawSignalThrottle } from "@/schemas/RawSignalThrottle";
import { RawSignalThrottlePotiCmd } from "@/schemas/RawSignalThrottlePotiCmd";
import { RawSignalVehicleSpeed } from "@/schemas/RawSignalVehicleSpeed";
import { RemoteDriveRequest } from "@/schemas/RemoteDriveRequest";
import { ScaledSignals } from "@/schemas/ScaledSignals";
import { SteeringAndSpeed } from "@/schemas/SteeringAndSpeed";
import { Temperatures } from "@/schemas/Temperatures";
import { USSensorFront } from "@/schemas/USSensorFront";
import { USSensorRear } from "@/schemas/USSensorRear";

type DashboardProps = {
  applicationStatus?: ApplicationStatus;
  batteryStatus?: BatteryStatus;
  generalVehicleStatus?: GeneralVehicleStatus;
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
  usSensorFront?: USSensorFront;
  usSensorRear?: USSensorRear;
  remoteDriveRequest?: RemoteDriveRequest;
};

function formatNumber(value: number | undefined, digits = 1): string {
  return value == undefined || Number.isNaN(value) ? "--" : value.toFixed(digits);
}

function toPercent(value: number | undefined): number | undefined {
  if (value == undefined || Number.isNaN(value)) {
    return undefined;
  }

  if (Math.abs(value) <= 1) {
    return Math.max(0, Math.min(100, value * 100));
  }

  return Math.max(0, Math.min(100, value));
}

function getMinDistance(sensors: Array<number | undefined>): {
  minDistance: number | undefined;
  isClose: boolean;
} {
  const values = sensors.filter((sensor): sensor is number => sensor != undefined);
  if (values.length === 0) {
    return { minDistance: undefined, isClose: false };
  }

  const minDistance = Math.min(...values);
  return {
    minDistance,
    isClose: minDistance <= 50,
  };
}

function SignalBar({ label, value }: { label: string; value?: number }): ReactElement {
  const normalized = toPercent(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{normalized == undefined ? "--" : `${normalized.toFixed(0)}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${normalized ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function StatusLight({ label, active }: { label: string; active: boolean }): ReactElement {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Badge variant={active ? "default" : "outline"}>{active ? "On" : "Off"}</Badge>
    </div>
  );
}

export function Dashboard({
  applicationStatus,
  batteryStatus,
  generalVehicleStatus,
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
  usSensorFront,
  usSensorRear,
  remoteDriveRequest,
}: DashboardProps): ReactElement {
  const measuredSpeed = steeringAndSpeed?.vehicle_velocity_measured;
  const requestedSpeed =
    steeringAndSpeed?.vehicle_velocity_requested ?? remoteDriveRequest?.remote_velocity_req;

  const speedDisplay = measuredSpeed ?? rawSignalVehicleSpeed?.uint8_vehicle_speed;
  const speedKmh = measuredSpeed == undefined ? undefined : measuredSpeed * 3.6;

  const frontDistance = getMinDistance([
    usSensorFront?.u_s_sensor1,
    usSensorFront?.u_s_sensor2,
    usSensorFront?.u_s_sensor3,
    usSensorFront?.u_s_sensor4,
  ]);

  const rearDistance = getMinDistance([
    usSensorRear?.u_s_sensor5,
    usSensorRear?.u_s_sensor6,
    usSensorRear?.u_s_sensor7,
    usSensorRear?.u_s_sensor8,
  ]);

  const appBadges = [
    {
      label: "4 km/h limit",
      active: applicationStatus?.app_status_speed_limit4kmh ?? false,
    },
    {
      label: "CAN debug",
      active: applicationStatus?.app_status_send_c_a_n_dbg_messages ?? false,
    },
    {
      label: "Assist braking",
      active: applicationStatus?.app_status_pwr_assisted_braking ?? false,
    },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7 border-border/60 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Instrument Cluster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-6xl font-semibold leading-none tracking-tight">
                  {formatNumber(speedDisplay, 1)}
                </div>
                <div className="text-sm text-muted-foreground">m/s measured speed</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-medium">{formatNumber(speedKmh, 1)}</div>
                <div className="text-sm text-muted-foreground">km/h</div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Speed request</div>
                <div className="mt-1 text-xl font-medium">
                  {formatNumber(requestedSpeed, 2)} m/s
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Steering measured/requested</div>
                <div className="mt-1 text-xl font-medium">
                  {formatNumber(steeringAndSpeed?.steering_position_measured, 1)} /{" "}
                  {formatNumber(steeringAndSpeed?.steering_position_requested, 1)} %
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-border/60 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Battery</div>
                <div className="text-2xl font-semibold">
                  {formatNumber(batteryStatus?.battery_discharge_percent, 0)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(batteryStatus?.battery_voltage, 1)}V ·{" "}
                  {formatNumber(batteryStatus?.battery_current, 1)}A
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Operation</div>
                <div className="text-2xl font-semibold">
                  {generalVehicleStatus?.active_op_mode ?? "--"}
                </div>
                <div className="text-xs text-muted-foreground">
                  app {generalVehicleStatus?.selected_application ?? "--"} · mode{" "}
                  {generalVehicleStatus?.selected_op_mode ?? "--"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {appBadges.map((badge) => (
                <Badge key={badge.label} variant={badge.active ? "default" : "outline"}>
                  {badge.label}
                </Badge>
              ))}
              <Badge
                variant={(generalVehicleStatus?.e_stop_status ?? false) ? "destructive" : "outline"}
              >
                E-Stop {(generalVehicleStatus?.e_stop_status ?? false) ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4 border-border/60">
          <CardHeader>
            <CardTitle>Drive Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignalBar label="Throttle" value={scaledSignals?.throttle_signal} />
            <SignalBar label="Brake" value={scaledSignals?.brake_signal} />
            <SignalBar label="Steering torque" value={scaledSignals?.steering_torque_signal} />
            <SignalBar label="Steering velocity" value={scaledSignals?.steering_velocity_signal} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-border/60">
          <CardHeader>
            <CardTitle>Temperatures</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">Steer inverter</div>
              <div className="text-lg font-medium">
                {formatNumber(temperatures?.steering_motor_inverter_temp, 1)}°C
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">Steer motor</div>
              <div className="text-lg font-medium">
                {formatNumber(temperatures?.steering_motor_temp, 1)}°C
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">Curtis controller</div>
              <div className="text-lg font-medium">
                {formatNumber(temperatures?.curtis_controller_temp, 1)}°C
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">Curtis motor</div>
              <div className="text-lg font-medium">
                {formatNumber(temperatures?.curtis_motor_temp, 1)}°C
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-border/60">
          <CardHeader>
            <CardTitle>Proximity & Lights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Front nearest</div>
                <div className="text-lg font-medium">
                  {formatNumber(frontDistance.minDistance, 0)} cm
                </div>
                <Badge variant={frontDistance.isClose ? "destructive" : "outline"}>
                  {frontDistance.isClose ? "Close" : "Clear"}
                </Badge>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Rear nearest</div>
                <div className="text-lg font-medium">
                  {formatNumber(rearDistance.minDistance, 0)} cm
                </div>
                <Badge variant={rearDistance.isClose ? "destructive" : "outline"}>
                  {rearDistance.isClose ? "Close" : "Clear"}
                </Badge>
              </div>
            </div>
            <StatusLight
              label="Hazard"
              active={generalVehicleStatus?.signal_hazard_lights ?? false}
            />
            <StatusLight
              label="Left / Right turn"
              active={
                (generalVehicleStatus?.signal_left_turn ?? false) ||
                (generalVehicleStatus?.signal_right_turn ?? false)
              }
            />
            <StatusLight
              label="Brake / Reverse"
              active={
                (generalVehicleStatus?.signal_brake_switch ?? false) ||
                (generalVehicleStatus?.signal_direction_reverse ?? false)
              }
            />
            <StatusLight
              label="Brights / Horn"
              active={
                (generalVehicleStatus?.signal_brights_on ?? false) ||
                (generalVehicleStatus?.signal_horn ?? false)
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Raw Telemetry Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="text-xs text-muted-foreground">Brake A/B</div>
            <div className="font-medium">
              {rawSignalBrake?.uint32_signal_brake_a ?? "--"} /{" "}
              {rawSignalBrake?.uint32_signal_brake_b ?? "--"}
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="text-xs text-muted-foreground">Throttle A/B</div>
            <div className="font-medium">
              {rawSignalThrottle?.uint32_signal_throttle_a ?? "--"} /{" "}
              {rawSignalThrottle?.uint32_signal_throttle_b ?? "--"}
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="text-xs text-muted-foreground">Steering encoder A/B</div>
            <div className="font-medium">
              {rawSignalSteeringPosition?.uint16_encoder_raw_value_a ?? "--"} /{" "}
              {rawSignalSteeringPosition?.uint16_encoder_raw_value_b ?? "--"}
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="text-xs text-muted-foreground">Steering force A/B</div>
            <div className="font-medium">
              {rawSignalSteeringForce?.uint32_signal_steering_force_a ?? "--"} /{" "}
              {rawSignalSteeringForce?.uint32_signal_steering_force_b ?? "--"}
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="text-xs text-muted-foreground">Steering velocity</div>
            <div className="font-medium">
              {rawSignalSteeringVelocity?.int16_steering_velocity ?? "--"} /{" "}
              {rawSignalSteeringVelocityCmd?.int16_steering_velocity_cmd ?? "--"}
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="text-xs text-muted-foreground">Throttle cmd / speed</div>
            <div className="font-medium">
              {rawSignalThrottlePotiCmd?.uint16_poti_throttle_cmd ?? "--"} /{" "}
              {rawSignalVehicleSpeed?.uint8_vehicle_speed ?? "--"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
