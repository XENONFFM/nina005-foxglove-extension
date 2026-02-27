import {
  BellIcon,
  CirclePowerIcon,
  LightbulbIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { type ReactElement, useEffect, useRef } from "react";

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

function drawRoundedSquare(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  color: string,
  lineWidth: number,
): void {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawDashedRoundedSquare(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  color: string,
  lineWidth: number,
): void {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.beginPath();
  ctx.setLineDash([3, 3]);
  ctx.roundRect(x, y, w, h, r);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFilledRoundedSquare(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  color: string,
): void {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
}

function roundedRectIndicatorState(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  t: number,
): { point: { x: number; y: number }; normal: { x: number; y: number } } {
  const clamped = clamp(t, 0, 1);
  const x2 = x + w;
  const y2 = y + h;
  const straightV = Math.max(h - 2 * r, 0);
  const straightH = Math.max(w - 2 * r, 0);
  const arcLen = (Math.PI / 2) * r;

  const seg1 = arcLen;
  const seg2 = straightV;
  const seg3 = arcLen;
  const seg4 = straightH;
  const seg5 = arcLen;
  const seg6 = straightV;
  const seg7 = arcLen;
  const totalLen = seg1 + seg2 + seg3 + seg4 + seg5 + seg6 + seg7;
  let distance = clamped * totalLen;

  if (distance <= seg1) {
    const theta = Math.PI / 2 + distance / r;
    const centerX = x + r;
    const centerY = y2 - r;
    const pointX = centerX + r * Math.cos(theta);
    const pointY = centerY + r * Math.sin(theta);
    return {
      point: { x: pointX, y: pointY },
      normal: { x: -Math.cos(theta), y: -Math.sin(theta) },
    };
  }
  distance -= seg1;

  if (distance <= seg2) {
    return { point: { x, y: y2 - r - distance }, normal: { x: 1, y: 0 } };
  }
  distance -= seg2;

  if (distance <= seg3) {
    const theta = Math.PI + distance / r;
    const centerX = x + r;
    const centerY = y + r;
    const pointX = centerX + r * Math.cos(theta);
    const pointY = centerY + r * Math.sin(theta);
    return {
      point: { x: pointX, y: pointY },
      normal: { x: -Math.cos(theta), y: -Math.sin(theta) },
    };
  }
  distance -= seg3;

  if (distance <= seg4) {
    return { point: { x: x + r + distance, y }, normal: { x: 0, y: 1 } };
  }
  distance -= seg4;

  if (distance <= seg5) {
    const theta = -Math.PI / 2 + distance / r;
    const centerX = x2 - r;
    const centerY = y + r;
    const pointX = centerX + r * Math.cos(theta);
    const pointY = centerY + r * Math.sin(theta);
    return {
      point: { x: pointX, y: pointY },
      normal: { x: -Math.cos(theta), y: -Math.sin(theta) },
    };
  }
  distance -= seg5;

  if (distance <= seg6) {
    return { point: { x: x2, y: y + r + distance }, normal: { x: -1, y: 0 } };
  }
  distance -= seg6;

  const theta = distance / r;
  const centerX = x2 - r;
  const centerY = y2 - r;
  const pointX = centerX + r * Math.cos(theta);
  const pointY = centerY + r * Math.sin(theta);
  return { point: { x: pointX, y: pointY }, normal: { x: -Math.cos(theta), y: -Math.sin(theta) } };
}

function CapsuleGauge({
  progressValue,
  displayValue,
  displayDigits = 0,
  maxLabel,
  minLabel,
  centerLabel,
  unit,
}: {
  progressValue: number;
  displayValue: number;
  displayDigits?: number;
  maxLabel: string;
  minLabel: string;
  centerLabel: string;
  unit: string;
}): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const normalizedProgress = clamp(progressValue, 0, 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == undefined) {
      return;
    }

    const context = canvas.getContext("2d");
    if (context == undefined) {
      return;
    }

    const draw = (): void => {
      const rect = canvas.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height));

      if (size <= 0) {
        return;
      }

      const dpr = window.devicePixelRatio;
      const scale = Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
      canvas.width = Math.floor(size * scale);
      canvas.height = Math.floor(size * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const outerR = size * 0.46;
      const trackRadius = outerR * 0.33;
      const trackSize = outerR * 2;
      const trackX = cx - trackSize / 2;
      const trackY = cy - trackSize / 2;

      const speedFraction = clamp(normalizedProgress / 100, 0, 1);

      drawRoundedSquare(
        context,
        cx,
        cy,
        trackSize,
        trackSize,
        trackRadius,
        "rgba(80,80,80,0.35)",
        1.5,
      );

      drawDashedRoundedSquare(
        context,
        cx,
        cy,
        outerR * 1.55,
        outerR * 1.55,
        outerR * 0.263,
        "rgba(55,55,55,0.5)",
        1,
      );

      const innerSize = outerR * 1.1;
      drawFilledRoundedSquare(
        context,
        cx,
        cy,
        innerSize * 2,
        innerSize * 2,
        outerR * 0.217,
        "rgba(17,17,17,0.3)",
      );
      drawRoundedSquare(
        context,
        cx,
        cy,
        innerSize * 2,
        innerSize * 2,
        outerR * 0.217,
        "rgba(70,70,70,0.4)",
        1,
      );

      const coreSize = outerR * 0.77;
      drawFilledRoundedSquare(
        context,
        cx,
        cy,
        coreSize * 2,
        coreSize * 2,
        outerR * 0.171,
        "rgba(13,13,13,0.9)",
      );
      drawRoundedSquare(
        context,
        cx,
        cy,
        coreSize * 2,
        coreSize * 2,
        outerR * 0.171,
        "rgba(55,55,55,0.35)",
        1,
      );

      if (speedFraction > 0) {
        const indicator = roundedRectIndicatorState(
          trackX,
          trackY,
          trackSize,
          trackSize,
          trackRadius,
          speedFraction,
        );
        const lineHalf = outerR * 0.15;
        const x1 = indicator.point.x - indicator.normal.x * lineHalf;
        const y1 = indicator.point.y - indicator.normal.y * lineHalf;
        const x2 = indicator.point.x + indicator.normal.x * lineHalf;
        const y2 = indicator.point.y + indicator.normal.y * lineHalf;

        context.save();
        context.strokeStyle = "rgba(77, 184, 164, 0.95)";
        context.lineWidth = Math.max(2, outerR * 0.035);
        context.lineCap = "round";
        context.shadowBlur = outerR * 0.2;
        context.shadowColor = "rgba(77, 184, 164, 0.65)";
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
      }
    };

    draw();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      draw();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [normalizedProgress]);

  return (
    <div className="relative aspect-square w-full rounded-[2.6rem] border border-border/70 bg-background/40 p-4 backdrop-blur-sm">
      <div className="absolute inset-0 p-2.5">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-semibold leading-none tracking-tight">
          {displayValue.toFixed(displayDigits)}
        </div>
        <div className="mt-2 text-2xl font-medium text-muted-foreground">{unit}</div>
      </div>

      <div className="absolute left-6 top-5 text-4xl font-medium text-muted-foreground/80">
        {maxLabel}
      </div>
      <div className="absolute right-6 top-5 text-4xl font-medium text-muted-foreground/80">
        {minLabel}
      </div>
      <div className="absolute bottom-5 left-6 text-4xl font-medium text-muted-foreground/80">
        {centerLabel}
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
  const requestedMs =
    steeringAndSpeed?.vehicle_velocity_requested ?? remoteDriveRequest?.remote_velocity_req;

  const throttlePercent = toPercent(scaledSignals?.throttle_signal);
  const brakePercent = toPercent(scaledSignals?.brake_signal);
  const speedPercent = clamp(((speedKmh ?? 0) / 40) * 100, 0, 100);

  const batteryVoltage = batteryStatus?.battery_voltage;
  const batteryCurrent = batteryStatus?.battery_current;
  const powerKw =
    batteryVoltage == undefined || batteryCurrent == undefined
      ? undefined
      : Math.abs((batteryVoltage * batteryCurrent) / 1000);
  const powerPercent = powerKw == undefined ? 0 : clamp((powerKw / 20) * 100, 0, 100);
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
          <div className="mb-4 grid items-start gap-3 lg:grid-cols-3">
            <HeaderMetric label="Mode" value={`${generalVehicleStatus?.active_op_mode ?? "--"}`} />
            <TopProgress
              left={`${format(steeringMeasured, 0)}°`}
              right={`${format(steeringRequested, 0)}°`}
              center={`${format(coolantLikeTemp, 0)}°`}
            />
            <div className="flex items-center justify-end gap-4">
              <HeaderMetric
                label="Ambient"
                value={`${format(temperatures?.steering_motor_temp, 0)}°C`}
              />
              <HeaderMetric label="Time" value="23:16" />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12 lg:gap-5">
            <div className="min-h-0 lg:col-span-3">
              <CapsuleGauge
                progressValue={powerPercent}
                displayValue={powerKw ?? 0}
                displayDigits={1}
                maxLabel="20"
                minLabel="0"
                centerLabel="10"
                unit="kWh"
              />
              <div className="mt-4 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <span className="text-muted-foreground">POWER</span>
                  <span>{format(powerKw, 1)}kW</span>
                  <span className="text-muted-foreground">{format(proximityCm, 0)}cm</span>
                </div>
              </div>
            </div>

            <div className="min-h-0 lg:col-span-6 rounded-3xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>Vehicle Stage</span>
                <span>·</span>
                <span>{format(requestedMs, 2)} m/s req</span>
              </div>

              <div className="relative mt-3 h-[clamp(220px,36vh,420px)]">
                <div className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

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

                <div className="relative flex h-full items-center justify-center">
                  <img
                    src={nina005}
                    alt="Nina005 car"
                    className="mx-auto h-auto max-h-full w-full max-w-130 object-contain"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 text-center">
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

            <div className="min-h-0 lg:col-span-3">
              <CapsuleGauge
                progressValue={speedPercent}
                displayValue={speedKmh ?? 0}
                maxLabel="40"
                minLabel="0"
                centerLabel="20"
                unit="km/h"
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
