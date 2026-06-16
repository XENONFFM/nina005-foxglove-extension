import { type ReactElement, useState } from "react";

import { TelemetryCard } from "@/components/telemetry-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RemoteApplicationToggleRequest } from "@/schemas/RemoteApplicationToggleRequest";
import { RemoteDriveRequest } from "@/schemas/RemoteDriveRequest";
import { RemoteIndicatorRequest } from "@/schemas/RemoteIndicatorRequest";

type RemoteProps = {
  remoteDriveRequest?: RemoteDriveRequest;
  remoteIndicatorRequest?: RemoteIndicatorRequest;
  remoteApplicationToggleRequest?: RemoteApplicationToggleRequest;
};

export function Remote({
  remoteDriveRequest,
  remoteIndicatorRequest,
  remoteApplicationToggleRequest,
}: RemoteProps): ReactElement {
  const [appToggle, setAppToggle] = useState({
    speed_limit4kmh: remoteApplicationToggleRequest?.app_toggle_req_speed_limit4kmh ?? false,
    send_c_a_n_dbg_messages:
      remoteApplicationToggleRequest?.app_toggle_req_send_c_a_n_dbg_messages ?? false,
    pwr_assisted_braking:
      remoteApplicationToggleRequest?.app_toggle_req_pwr_assisted_braking ?? false,
  });

  const [indicatorRequest, setIndicatorRequest] = useState({
    blink_rate: remoteIndicatorRequest?.remote_status_light_blink_rate_req ?? 0,
    color: remoteIndicatorRequest?.remote_status_light_color_req ?? 0,
    horn: remoteIndicatorRequest?.remote_horn_req ?? false,
    brake: remoteIndicatorRequest?.remote_light_brake_req ?? false,
    blink_left: remoteIndicatorRequest?.remote_blink_left_req ?? false,
    blink_right: remoteIndicatorRequest?.remote_blink_right_req ?? false,
    brights: remoteIndicatorRequest?.remote_brights_on_req ?? false,
    reverse: remoteIndicatorRequest?.remote_light_reverse_req ?? false,
    turn_left: remoteIndicatorRequest?.remote_lights_turn_left_req ?? false,
    turn_right: remoteIndicatorRequest?.remote_lights_turn_right_req ?? false,
  });

  const handleAppToggleChange = (key: keyof typeof appToggle): void => {
    setAppToggle((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleIndicatorChange = (
    key: keyof typeof indicatorRequest,
    value: boolean | number,
  ): void => {
    setIndicatorRequest((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAppToggleSend = (): void => {
    // TODO: Implement ROS2 message publishing
    console.log("Sending RemoteApplicationToggleRequest:", appToggle);
  };

  const handleIndicatorSend = (): void => {
    // TODO: Implement ROS2 message publishing
    console.log("Sending RemoteIndicatorRequest:", indicatorRequest);
  };

  return (
    <div className="grid grid-cols-3 gap-6 w-full p-4">
      {/* Application Toggle Controls */}
      <Card className="p-6 flex flex-col gap-4">
        <div className="text-lg font-semibold">Application Controls</div>

        <div className="flex flex-col gap-4">
          {/* Speed Limit Toggle */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Speed Limit (4 km/h)</Label>
            <Switch
              checked={appToggle.speed_limit4kmh}
              onCheckedChange={() => {
                handleAppToggleChange("speed_limit4kmh");
              }}
              size="default"
            />
          </div>

          {/* Debug CAN Messages Toggle */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Debug CAN Messages</Label>
            <Switch
              checked={appToggle.send_c_a_n_dbg_messages}
              onCheckedChange={() => {
                handleAppToggleChange("send_c_a_n_dbg_messages");
              }}
              size="default"
            />
          </div>

          {/* Power Assisted Braking Toggle */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Power Assisted Braking</Label>
            <Switch
              checked={appToggle.pwr_assisted_braking}
              onCheckedChange={() => {
                handleAppToggleChange("pwr_assisted_braking");
              }}
              size="default"
            />
          </div>
        </div>

        <Button onClick={handleAppToggleSend} className="mt-4 w-full">
          Send Application Toggle
        </Button>
      </Card>

      {/* Indicator Controls */}
      <Card className="p-6 flex flex-col gap-4">
        <div className="text-lg font-semibold">Light & Horn Controls</div>

        <div className="flex flex-col gap-4">
          {/* Horn */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Horn</Label>
            <Switch
              checked={indicatorRequest.horn}
              onCheckedChange={(val) => {
                handleIndicatorChange("horn", val);
              }}
              size="default"
            />
          </div>

          {/* Brake Light */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Brake Light</Label>
            <Switch
              checked={indicatorRequest.brake}
              onCheckedChange={(val) => {
                handleIndicatorChange("brake", val);
              }}
              size="default"
            />
          </div>

          {/* Turn Signals */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Turn Left</Label>
            <Switch
              checked={indicatorRequest.turn_left}
              onCheckedChange={(val) => {
                handleIndicatorChange("turn_left", val);
              }}
              size="default"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Turn Right</Label>
            <Switch
              checked={indicatorRequest.turn_right}
              onCheckedChange={(val) => {
                handleIndicatorChange("turn_right", val);
              }}
              size="default"
            />
          </div>

          {/* Blink Signals */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Blink Left</Label>
            <Switch
              checked={indicatorRequest.blink_left}
              onCheckedChange={(val) => {
                handleIndicatorChange("blink_left", val);
              }}
              size="default"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Blink Right</Label>
            <Switch
              checked={indicatorRequest.blink_right}
              onCheckedChange={(val) => {
                handleIndicatorChange("blink_right", val);
              }}
              size="default"
            />
          </div>

          {/* Brights */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Brights</Label>
            <Switch
              checked={indicatorRequest.brights}
              onCheckedChange={(val) => {
                handleIndicatorChange("brights", val);
              }}
              size="default"
            />
          </div>

          {/* Reverse Light */}
          <div className="flex items-center justify-between gap-3">
            <Label className="text-muted-foreground">Reverse Light</Label>
            <Switch
              checked={indicatorRequest.reverse}
              onCheckedChange={(val) => {
                handleIndicatorChange("reverse", val);
              }}
              size="default"
            />
          </div>

          {/* Blink Rate */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Blink Rate</Label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={indicatorRequest.blink_rate}
              onChange={(e) => {
                handleIndicatorChange("blink_rate", parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-sm text-muted-foreground text-center">
              {indicatorRequest.blink_rate.toFixed(1)}
            </div>
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Light Color</Label>
            <input
              type="range"
              min="0"
              max="255"
              step="1"
              value={indicatorRequest.color}
              onChange={(e) => {
                handleIndicatorChange("color", parseInt(e.target.value, 10));
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-sm text-muted-foreground text-center">
              {indicatorRequest.color}
            </div>
          </div>
        </div>

        <Button onClick={handleIndicatorSend} className="mt-4 w-full">
          Send Indicator Request
        </Button>
      </Card>

      {/* Data Display */}
      <div className="flex flex-col gap-4">
        <TelemetryCard title="Remote Drive Request" message={remoteDriveRequest} />
      </div>
    </div>
  );
}
