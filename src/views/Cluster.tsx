import {
  BellIcon,
  CirclePowerIcon,
  LightbulbIcon,
  NavigationIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { type ReactElement } from "react";

import nina005 from "@/assets/Nina005.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationStatus } from "@/schemas/ApplicationStatus";
import { BatteryStatus } from "@/schemas/BatteryStatus";
import { GeneralVehicleStatus } from "@/schemas/GeneralVehicleStatus";
import { RemoteDriveRequest } from "@/schemas/RemoteDriveRequest";
import { ScaledSignals } from "@/schemas/ScaledSignals";
import { SteeringAndSpeed } from "@/schemas/SteeringAndSpeed";
import { Temperatures } from "@/schemas/Temperatures";
import { USSensorFront } from "@/schemas/USSensorFront";
import { USSensorRear } from "@/schemas/USSensorRear";

type ClusterProps = {
  applicationStatus?: ApplicationStatus;
  batteryStatus?: BatteryStatus;
  generalVehicleStatus?: GeneralVehicleStatus;
  scaledSignals?: ScaledSignals;
  steeringAndSpeed?: SteeringAndSpeed;
  temperatures?: Temperatures;
  usSensorFront?: USSensorFront;
  usSensorRear?: USSensorRear;
  remoteDriveRequest?: RemoteDriveRequest;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function format(value: number | undefined, digits = 1): string {
  if (value == undefined || Number.isNaN(value)) {
    return "--";
  }

  return value.toFixed(digits);
}

function toPercent(value: number | undefined): number {
  if (value == undefined || Number.isNaN(value)) {
    return 0;
  }

  if (Math.abs(value) <= 1) {
    return clamp(value * 100, 0, 100);
  }

  return clamp(value, 0, 100);
}

function nearestDistance(front?: USSensorFront, rear?: USSensorRear): number | undefined {
  const values = [
    front?.u_s_sensor1,
    front?.u_s_sensor2,
    front?.u_s_sensor3,
    front?.u_s_sensor4,
    rear?.u_s_sensor5,
    rear?.u_s_sensor6,
    rear?.u_s_sensor7,
    rear?.u_s_sensor8,
  ].filter((item): item is number => item != undefined);

  if (values.length === 0) {
    return undefined;
  }

  return Math.min(...values);
}

function HeaderMetric({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground/80">{label}</div>
      <div className="text-lg font-semibold leading-none">{value}</div>
    </div>
  );
}

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  displayValue: string;
  minDisplay: number;
  maxDisplay: number;
  startAngle: number;
  endAngle: number;
}

function Gauge({
  value,
  min,
  max,
  label,
  displayValue,
  minDisplay,
  maxDisplay,
  startAngle,
  endAngle,
}: GaugeProps): ReactElement {
  const clampedValue = clamp(value, min, max);
  const span = max - min;
  const normalizedValue = span <= 0 ? 0 : Math.min(Math.max((clampedValue - min) / span, 0), 1);
  const rawSweepDegrees = (((endAngle - startAngle) % 360) + 360) % 360;
  const sweepDegrees = rawSweepDegrees === 0 ? 360 : rawSweepDegrees;
  const fillDegrees = normalizedValue * sweepDegrees;
  const sweepPercent = (sweepDegrees / 360) * 100;
  const fillPercent = (fillDegrees / 360) * 100;

  // CSS conic angles are measured clockwise from top (12 o'clock), so convert to
  // math angle space before computing a moving radial hotspot.
  const midAngleCss = (startAngle + fillDegrees / 2) % 360;
  const midAngleRadians = ((midAngleCss - 90) * Math.PI) / 180;
  const hotspotRadius = 22;
  const hotspotX = 50 + Math.cos(midAngleRadians) * hotspotRadius;
  const hotspotY = 50 + Math.sin(midAngleRadians) * hotspotRadius;

  // Determine color based on percentage
  const getColor = (): string => {
    if (normalizedValue < 0.7) {
      return "rgba(123, 212, 211, 0.6)";
    }
    if (normalizedValue < 0.9) {
      return "rgba(255, 255, 255, 0.6)";
    }
    return "rgba(255, 0, 0, 0.6)";
  };

  const getFillColor = (): string => {
    if (normalizedValue < 0.7) {
      return "rgba(123, 212, 211, 0.24)";
    }
    if (normalizedValue < 0.9) {
      return "rgba(255, 255, 255, 0.2)";
    }
    return "rgba(255, 0, 0, 0.22)";
  };

  return (
    <div className="mx-auto flex h-auto w-full max-w-105 min-w-0 items-center justify-center">
      <div className="relative flex aspect-square w-full items-center justify-center rounded-[100px] bg-linear-to-b from-teal-300/5 to-transparent">
        <div className="absolute left-1/2 top-1/2 z-0 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-zinc-700 via-black to-zinc-700" />
        <div className="absolute left-1/2 top-0 z-0 h-1/2 w-px -translate-x-1/2 bg-linear-to-b to-black from-zinc-700" />

        <div className="absolute left-7.5 top-7.5 z-1 h-px w-32 origin-top-left rotate-45 bg-linear-to-r from-zinc-700" />
        <div className="absolute right-7.5 top-7.5 z-20 h-px w-32 origin-top-right -rotate-45 bg-linear-to-r to-zinc-700" />
        <div className="absolute bottom-7.5 left-7.5 z-20 h-px w-32 origin-bottom-left -rotate-45 bg-linear-to-r from-zinc-700" />
        <div className="absolute bottom-7.5 right-7.5 z-20 h-px w-32 origin-bottom-right rotate-45 bg-linear-to-r to-zinc-700" />

        <div
          className="relative flex h-full w-full items-center justify-center rounded-[100px] border-[1.5px] border-b-border border-zinc-700 transition-all duration-500 ease-in-out"
          style={{
            background: `conic-gradient(from ${startAngle}deg, ${getColor()} 0% ${fillPercent}%, rgba(255, 255, 255, 0.08) ${fillPercent}% ${sweepPercent}%, transparent ${sweepPercent}% 100%), conic-gradient(from ${startAngle}deg, ${getFillColor()} 0% ${fillPercent}%, transparent ${fillPercent}% 100%), radial-gradient(circle at ${hotspotX}% ${hotspotY}%, rgba(123, 212, 211, ${normalizedValue > 0 ? 0.25 : 0}) 0%, rgba(123, 212, 211, 0) 38%)`,
          }}
        >
          <div className="absolute left-0 top-0 text-[20px] leading-[77%] text-zinc-500 rotate-315">
            {Math.round(maxDisplay / 3)}
          </div>
          <div className="absolute right-0 top-0 text-[20px] leading-[77%] text-zinc-500 rotate-45">
            {Math.round((maxDisplay / 3) * 2)}
          </div>
          <div className="absolute bottom-0 right-0 text-[20px] leading-[77%] text-zinc-500 rotate-315">
            {maxDisplay}
          </div>
          <div className="absolute bottom-0 left-0 text-[20px] leading-[77%] text-zinc-500 rotate-45">
            {minDisplay}
          </div>

          <div className="absolute z-0 aspect-square w-[75%] rounded-[80px] border-r border-l border-t border-b-none border-zinc-600 bg-black/10 backdrop-blur-[20px] " />

          <div className="absolute z-10 aspect-square w-[50%] rounded-[50px] border-[1.5px] border-teal-500  bg-black/30 backdrop-blur-[100px]" />

          <div className="absolute z-20 flex flex-col items-center justify-center gap-4">
            <h2 className="text-[50px] font-light leading-[77%] tracking-[0.04em]">
              {displayValue}
            </h2>
            <p className="text-sm font-light uppercase tracking-[0.3em] text-zinc-500">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopProgress({
  left,
  right,
  center,
}: {
  left: string;
  right: string;
  center: string;
}): ReactElement {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className="h-3 rounded-full bg-muted/60 overflow-hidden">
        <div className="h-full w-3/5 rounded-full bg-primary/70" />
      </div>
      <div className="text-center text-sm font-medium">{center}</div>
    </div>
  );
}

function IndicatorIconBadge({
  active,
  destructive = false,
  title,
  icon,
}: {
  active: boolean;
  destructive?: boolean;
  title: string;
  icon: ReactElement;
}): ReactElement {
  return (
    <Badge
      variant={destructive ? (active ? "destructive" : "outline") : active ? "default" : "outline"}
      className="h-8 w-10 justify-center"
      title={title}
      aria-label={title}
    >
      {icon}
    </Badge>
  );
}

export function Cluster({
  applicationStatus,
  batteryStatus,
  generalVehicleStatus,
  scaledSignals,
  steeringAndSpeed,
  temperatures,
  usSensorFront,
  usSensorRear,
  remoteDriveRequest,
}: ClusterProps): ReactElement {
  const speedMs = steeringAndSpeed?.vehicle_velocity_measured;
  const speedKmh = speedMs == undefined ? undefined : speedMs * 3.6;
  const speedKmhGauge = clamp(speedKmh ?? 0, 0, 40);
  const requestedMs =
    steeringAndSpeed?.vehicle_velocity_requested ?? remoteDriveRequest?.remote_velocity_req;

  const throttlePercent = toPercent(scaledSignals?.throttle_signal);
  const brakePercent = toPercent(scaledSignals?.brake_signal);

  const batteryVoltage = batteryStatus?.battery_voltage;
  const batteryCurrent = batteryStatus?.battery_current;
  const powerKw =
    batteryVoltage == undefined || batteryCurrent == undefined
      ? undefined
      : Math.abs((batteryVoltage * batteryCurrent) / 1000);
  const powerKwGauge = clamp(powerKw ?? 0, 0, 100);
  const coolantLikeTemp = temperatures?.curtis_controller_temp;

  const proximityCm = nearestDistance(usSensorFront, usSensorRear);
  const proximityState =
    proximityCm == undefined
      ? "--"
      : proximityCm <= 40
        ? "NEAR"
        : proximityCm <= 80
          ? "MID"
          : "CLEAR";

  const steeringMeasured = steeringAndSpeed?.steering_position_measured;
  const steeringRequested = steeringAndSpeed?.steering_position_requested;

  const turnIndicators = {
    left: generalVehicleStatus?.signal_left_turn ?? false,
    right: generalVehicleStatus?.signal_right_turn ?? false,
  };
  const hazardOn = generalVehicleStatus?.signal_hazard_lights ?? false;
  const estopOn = generalVehicleStatus?.e_stop_status ?? false;
  const lightOn = generalVehicleStatus?.signal_brights_on ?? false;
  const hornOn = generalVehicleStatus?.signal_horn ?? false;
  const reverseOn = generalVehicleStatus?.signal_direction_reverse ?? false;

  return (
    <div className="h-full w-full max-w-full overflow-hidden p-3 lg:p-4">
      <Card className="h-full overflow-hidden border-border/60 bg-background/90">
        <CardContent className="flex h-full flex-col px-4 py-4 lg:px-6 lg:py-5">
          <div className="mb-4 grid grid-cols-2 items-start gap-3">
            <HeaderMetric label="Mode" value={`${generalVehicleStatus?.active_op_mode ?? "--"}`} />
            <div className="flex items-center justify-end gap-4">
              <HeaderMetric
                label="Ambient"
                value={`${format(temperatures?.steering_motor_temp, 0)}°C`}
              />
              <HeaderMetric label="Time" value="23:16" />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 xl:grid-cols-[minmax(14rem,26.25rem)_minmax(0,1fr)_minmax(14rem,26.25rem)] xl:gap-5">
            <div className="min-h-0 min-w-0">
              <Gauge
                value={powerKwGauge}
                min={0}
                max={100}
                label="kW"
                displayValue={format(powerKwGauge, 1)}
                minDisplay={0}
                maxDisplay={100}
                startAngle={225}
                endAngle={135}
              />
              <div className="mt-4 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <span className="text-muted-foreground">POWER</span>
                  <span>{format(powerKw, 1)}kW</span>
                  <span className="text-muted-foreground">{format(proximityCm, 0)}cm</span>
                </div>
              </div>

              <div className="mt-4 max-w-[18rem]">
                <TopProgress
                  left={`${format(steeringMeasured, 0)}°`}
                  right={`${format(steeringRequested, 0)}°`}
                  center={`${format(coolantLikeTemp, 0)}°`}
                />
              </div>
            </div>

            <div className="min-h-0 min-w-0">
              <div className="mx-auto w-full max-w-105 min-w-0">
                <div className="relative flex min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
                  <div className="pointer-events-none absolute inset-0">
                    <div
                      className="relative h-full w-full overflow-hidden rounded-lg"
                      style={{
                        background: `
                        linear-gradient(135deg, rgba(123, 212, 211, 0.1) 0%, rgba(20, 25, 30, 0.9) 100%),
                        repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 20px),
                        radial-gradient(circle at 30% 40%, rgba(123, 212, 211, 0.15) 0%, transparent 50%),
                        #0a0f14
                      `,
                      }}
                    >
                      <svg
                        className="h-full w-full opacity-20"
                        viewBox="0 0 320 208"
                        preserveAspectRatio="none"
                      >
                        <line
                          x1="0"
                          y1="80"
                          x2="320"
                          y2="80"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <line
                          x1="0"
                          y1="128"
                          x2="320"
                          y2="128"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <line
                          x1="100"
                          y1="0"
                          x2="100"
                          y2="208"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <line
                          x1="220"
                          y1="0"
                          x2="220"
                          y2="208"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2="120"
                          y2="208"
                          stroke="rgba(123,212,211,0.2)"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                        />
                        <line
                          x1="200"
                          y1="0"
                          x2="320"
                          y2="208"
                          stroke="rgba(123,212,211,0.2)"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                        />
                      </svg>

                      <div className="absolute right-4 top-4">
                        <NavigationIcon
                          className="h-6 w-6 text-teal-400"
                          fill="rgba(123, 212, 211, 0.3)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center">
                    <div className="flex items-center justify-center gap-2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <span>Vehicle Stage</span>
                      <span>·</span>
                      <span>{format(requestedMs, 2)} m/s req</span>
                    </div>

                    <div className="relative mt-3 h-[clamp(160px,34vh,460px)] w-full max-w-104 shrink-0 self-center">
                      <div className="absolute inset-x-0 top-1/2 h-20 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl sm:h-24" />

                      <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
                        <IndicatorIconBadge
                          active={turnIndicators.left || hazardOn}
                          title="Left blinker"
                          icon={<TriangleIcon className="h-4 w-4 -rotate-90" />}
                        />
                        <IndicatorIconBadge
                          active={lightOn}
                          title="Lights"
                          icon={<LightbulbIcon className="h-4 w-4" />}
                        />
                        <IndicatorIconBadge
                          active={hornOn}
                          title="Horn"
                          icon={<BellIcon className="h-4 w-4" />}
                        />
                      </div>

                      <div className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
                        <IndicatorIconBadge
                          active={turnIndicators.right || hazardOn}
                          title="Right blinker"
                          icon={<TriangleIcon className="h-4 w-4 rotate-90" />}
                        />
                        <IndicatorIconBadge
                          active={reverseOn}
                          title="Reverse"
                          icon={<RotateCcwIcon className="h-4 w-4" />}
                        />
                        <IndicatorIconBadge
                          active={estopOn}
                          destructive
                          title="E-stop"
                          icon={
                            estopOn ? (
                              <TriangleAlertIcon className="h-4 w-4" />
                            ) : (
                              <CirclePowerIcon className="h-4 w-4" />
                            )
                          }
                        />
                      </div>

                      <div className="relative flex h-full items-center justify-center overflow-hidden px-4 py-2 sm:px-6">
                        <img
                          src={nina005}
                          alt="Nina005 car"
                          className="mx-auto h-auto w-[56%] max-h-[82%] max-w-[16.666vw] object-contain sm:w-[60%] lg:w-[66%]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 mx-auto grid w-full max-w-105 grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 text-center">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-2 overflow-hidden rounded-full bg-muted/70">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-primary"
                      style={{ height: `${clamp(throttlePercent, 0, 100)}%` }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs uppercase text-muted-foreground">Throttle</div>
                    <div className="mt-1 text-xl font-semibold">{throttlePercent.toFixed(0)}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-2 overflow-hidden rounded-full bg-muted/70">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-primary"
                      style={{ height: `${clamp(brakePercent, 0, 100)}%` }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs uppercase text-muted-foreground">Brake</div>
                    <div className="mt-1 text-xl font-semibold">{brakePercent.toFixed(0)}%</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Obstacle</div>
                  <div className="mt-1 text-xl font-semibold">{proximityState}</div>
                </div>
              </div>
            </div>

            <div className="min-h-0 min-w-0">
              <Gauge
                value={speedKmhGauge}
                min={0}
                max={40}
                label="km/h"
                displayValue={format(speedKmhGauge, 0)}
                minDisplay={0}
                maxDisplay={40}
                startAngle={225}
                endAngle={135}
              />
              <div className="mt-4 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <span className="text-muted-foreground">BATTERY</span>
                  <span>{format(batteryVoltage, 1)}V</span>
                  <span className="text-muted-foreground">{format(batteryCurrent, 1)}A</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant={
                    (applicationStatus?.app_status_speed_limit4kmh ?? false) ? "default" : "outline"
                  }
                >
                  speed limit
                </Badge>
                <Badge
                  variant={
                    (applicationStatus?.app_status_pwr_assisted_braking ?? false)
                      ? "default"
                      : "outline"
                  }
                >
                  assisted brake
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
