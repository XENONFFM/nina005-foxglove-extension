import { BatteryChargingIcon, CarFrontIcon, LayoutGridIcon, SparklesIcon } from "lucide-react";
import { type ReactElement } from "react";

import type { AppData } from "@/app";
import { Car } from "@/components/car";
import { TelemetryCard } from "@/components/telemetry-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type WidgetKey =
  | "overview"
  | "battery"
  | "drive-inputs"
  | "temperatures"
  | "proximity"
  | "vehicle"
  | "status"
  | "raw-signals"
  | "remote";

export type WidgetDefinition = {
  key: WidgetKey;
  label: string;
  description: string;
  defaultCols: number;
  defaultRows: number;
  minCols: number;
  minRows: number;
  maxCols: number;
  maxRows: number;
  constraints?: {
    aspectRatio?: number;
  };
  icon: ReactElement;
  render: (data: AppData) => ReactElement;
};

const INNER_WIDGET_CARD_CLASS =
  "h-full min-h-0 overflow-hidden bg-card/80 backdrop-blur-sm ring-0 border";

function formatNumber(value: number | undefined, digits = 1): string {
  return value == undefined || Number.isNaN(value) ? "--" : value.toFixed(digits);
}

function getMinDistance(sensors: Array<number | undefined>): number | undefined {
  const values = sensors.filter((sensor): sensor is number => sensor != undefined);
  if (values.length === 0) {
    return undefined;
  }

  return Math.min(...values);
}

function StatusLight({ label, active }: { label: string; active: boolean }): ReactElement {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/25 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Badge variant={active ? "default" : "outline"}>{active ? "On" : "Off"}</Badge>
    </div>
  );
}

function OverviewCard({ data }: { data: AppData }): ReactElement {
  const measuredSpeed = data.steeringAndSpeed?.vehicle_velocity_measured;
  const requestedSpeed = data.steeringAndSpeed?.vehicle_velocity_requested;
  const speedKmh = measuredSpeed == undefined ? undefined : measuredSpeed * 3.6;
  const eStopActive = data.generalVehicleStatus?.e_stop_status ?? false;
  const hazardLightsActive = data.generalVehicleStatus?.signal_hazard_lights ?? false;
  const hornActive = data.generalVehicleStatus?.signal_horn ?? false;
  const eStopVariant = eStopActive ? "destructive" : "outline";
  const hazardVariant = hazardLightsActive ? "default" : "outline";
  const hornVariant = hornActive ? "default" : "outline";

  return (
    <Card className={INNER_WIDGET_CARD_CLASS}>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-4xl font-semibold leading-none tracking-tight">
              {formatNumber(measuredSpeed, 1)}
              <span className="text-2xl font-medium text-muted-foreground"> m/s</span>
            </div>
            <div className="text-sm text-muted-foreground">measured speed</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-semibold leading-none tracking-tight">
              {formatNumber(speedKmh, 1)}
              <span className="text-2xl font-medium text-muted-foreground"> km/h</span>
            </div>
            <div className="text-sm text-muted-foreground">calculated speed</div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-card-number p-3">
            <div className="text-xs text-muted-foreground">Battery</div>
            <div className="mt-1 text-xl font-medium">
              {formatNumber(data.batteryStatus?.battery_discharge_percent, 0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(data.batteryStatus?.battery_voltage, 1)}V ·{" "}
              {formatNumber(data.batteryStatus?.battery_current, 1)}A
            </div>
          </div>
          <div className="rounded-lg bg-card-number p-3">
            <div className="text-xs text-muted-foreground">Requested speed</div>
            <div className="mt-1 text-xl font-medium">{formatNumber(requestedSpeed, 2)} m/s</div>
            <div className="text-xs text-muted-foreground">
              mode {data.generalVehicleStatus?.active_op_mode ?? "--"} · app{" "}
              {data.generalVehicleStatus?.selected_application ?? "--"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={eStopVariant}>E-Stop {eStopActive ? "Active" : "Inactive"}</Badge>
          <Badge variant={hazardVariant}>Hazard {hazardLightsActive ? "On" : "Off"}</Badge>
          <Badge variant={hornVariant}>Horn {hornActive ? "On" : "Off"}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ProximityCard({ data }: { data: AppData }): ReactElement {
  const frontDistance = getMinDistance([
    data.usSensorFront?.u_s_sensor1,
    data.usSensorFront?.u_s_sensor2,
    data.usSensorFront?.u_s_sensor3,
    data.usSensorFront?.u_s_sensor4,
  ]);
  const rearDistance = getMinDistance([
    data.usSensorRear?.u_s_sensor5,
    data.usSensorRear?.u_s_sensor6,
    data.usSensorRear?.u_s_sensor7,
    data.usSensorRear?.u_s_sensor8,
  ]);

  return (
    <Card className={INNER_WIDGET_CARD_CLASS}>
      <CardHeader>
        <CardTitle>Proximity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Front nearest</div>
            <div className="text-lg font-medium">{formatNumber(frontDistance, 0)} cm</div>
            <Badge
              variant={
                frontDistance != undefined && frontDistance <= 50 ? "destructive" : "outline"
              }
            >
              {frontDistance != undefined && frontDistance <= 50 ? "Close" : "Clear"}
            </Badge>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Rear nearest</div>
            <div className="text-lg font-medium">{formatNumber(rearDistance, 0)} cm</div>
            <Badge
              variant={rearDistance != undefined && rearDistance <= 50 ? "destructive" : "outline"}
            >
              {rearDistance != undefined && rearDistance <= 50 ? "Close" : "Clear"}
            </Badge>
          </div>
        </div>
        <StatusLight
          label="Left / Right turn"
          active={
            (data.generalVehicleStatus?.signal_left_turn ?? false) ||
            (data.generalVehicleStatus?.signal_right_turn ?? false)
          }
        />
        <StatusLight
          label="Brake / Reverse"
          active={
            (data.generalVehicleStatus?.signal_brake_switch ?? false) ||
            (data.generalVehicleStatus?.signal_direction_reverse ?? false)
          }
        />
      </CardContent>
    </Card>
  );
}

export const WIDGET_DEFINITIONS: readonly WidgetDefinition[] = [
  {
    key: "overview",
    label: "Overview",
    description: "Speed, battery, and state at a glance.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 18,
    maxRows: 18,
    icon: <SparklesIcon className="size-4" />,
    render: (data: AppData) => <OverviewCard data={data} />,
  },
  {
    key: "battery",
    label: "Battery",
    description: "Discharge, voltage, and current.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 6,
    icon: <BatteryChargingIcon className="size-4" />,
    render: (data: AppData) => (
      <TelemetryCard
        title="Battery"
        message={data.batteryStatus}
        fields={["battery_discharge_percent", "battery_voltage", "battery_current"]}
      />
    ),
  },
  {
    key: "drive-inputs",
    label: "Drive Inputs",
    description: "Scaled throttle and steering signals.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 6,
    icon: <LayoutGridIcon className="size-4" />,
    render: (data: AppData) => (
      <TelemetryCard
        title="Drive Inputs"
        message={data.scaledSignals}
        fields={[
          "throttle_signal",
          "brake_signal",
          "steering_torque_signal",
          "steering_velocity_signal",
        ]}
      />
    ),
  },
  {
    key: "temperatures",
    label: "Temperatures",
    description: "Thermal state of the drivetrain.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 6,
    icon: <SparklesIcon className="size-4" />,
    render: (data: AppData) => <TelemetryCard title="Temperatures" message={data.temperatures} />,
  },
  {
    key: "proximity",
    label: "Proximity",
    description: "Front and rear park sensor summary.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 9,
    icon: <CarFrontIcon className="size-4" />,
    render: (data: AppData) => <ProximityCard data={data} />,
  },
  {
    key: "vehicle",
    label: "Vehicle",
    description: "A visual vehicle component.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 48,
    maxRows: 48,
    // constraints: {
    //   aspectRatio: 886 / 1829,
    // },
    icon: <CarFrontIcon className="size-4" />,
    render: () => (
      <Card className={INNER_WIDGET_CARD_CLASS}>
        <CardHeader>
          <CardTitle>Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 min-h-0 min-w-0 overflow-hidden px-4 py-0">
          <Car />
        </CardContent>
      </Card>
    ),
  },
  {
    key: "status",
    label: "Status",
    description: "Application and vehicle state.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 9,
    icon: <SparklesIcon className="size-4" />,
    render: (data: AppData) => (
      <TelemetryCard
        title="Status"
        message={data.generalVehicleStatus}
        fields={[
          "selected_application",
          "selected_op_mode",
          "active_op_mode",
          "e_stop_status",
          "signal_hazard_lights",
          "signal_horn",
          "signal_brights_on",
        ]}
      />
    ),
  },
  {
    key: "raw-signals",
    label: "Raw Signals",
    description: "Merged raw drivetrain signal cards.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 12,
    icon: <LayoutGridIcon className="size-4" />,
    render: (data: AppData) => (
      <TelemetryCard
        title="Raw Signals"
        message={{
          ...data.rawSignalBrake,
          ...data.rawSignalThrottle,
          ...data.rawSignalSteeringPosition,
          ...data.rawSignalSteeringForce,
          ...data.rawSignalSteeringVelocity,
          ...data.rawSignalSteeringVelocityCmd,
          ...data.rawSignalThrottlePotiCmd,
          ...data.rawSignalVehicleSpeed,
        }}
      />
    ),
  },
  {
    key: "remote",
    label: "Remote",
    description: "Remote drive, indicator, and app toggle requests.",
    defaultCols: 2,
    defaultRows: 2,
    minCols: 1,
    minRows: 1,
    maxCols: 12,
    maxRows: 15,
    icon: <SparklesIcon className="size-4" />,
    render: (data: AppData) => (
      <TelemetryCard
        title="Remote"
        message={{
          ...data.remoteDriveRequest,
          ...data.remoteIndicatorRequest,
          ...data.remoteApplicationToggleRequest,
        }}
      />
    ),
  },
] as const;

export const DEFAULT_WIDGETS: WidgetKey[] = [
  "overview",
  "vehicle",
  "status",
  "drive-inputs",
  "proximity",
];
