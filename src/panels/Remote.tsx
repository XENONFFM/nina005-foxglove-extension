import React from "react";

import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

import { RemoteApplicationToggleRequest } from "@/schemas/RemoteApplicationToggleRequest";
import { RemoteDriveRequest } from "@/schemas/RemoteDriveRequest";
import { RemoteIndicatorRequest } from "@/schemas/RemoteIndicatorRequest";

type RemotePanelProps = {
  remoteDriveRequest?: RemoteDriveRequest;
  remoteIndicatorRequest?: RemoteIndicatorRequest;
  remoteApplicationToggleRequest?: RemoteApplicationToggleRequest;
};

function statusLabel(value: boolean | undefined): string {
  if (value === undefined || value === null) {
    return "n/a";
  }
  return value ? "ON" : "OFF";
}

function StatusItem({ label, value }: { label: string; value: boolean | undefined }): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Badge variant="secondary">{statusLabel(value)}</Badge>
    </div>
  );
}

function ValueRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatValue(value: number | undefined, digits = 2): string {
  if (value === undefined || value === null) {
    return "--";
  }
  return value.toFixed(digits);
}

export function RemotePanel({
  remoteDriveRequest,
  remoteIndicatorRequest,
  remoteApplicationToggleRequest,
}: RemotePanelProps): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Remote Drive Request</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ValueRow
            label="Steering Angle"
            value={`${formatValue(remoteDriveRequest?.remote_steering_angle_req, 2)} deg`}
          />
          <ValueRow
            label="Velocity"
            value={`${formatValue(remoteDriveRequest?.remote_velocity_req, 2)} m/s`}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Remote Indicator Request</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ValueRow
            label="Blink Rate"
            value={formatValue(remoteIndicatorRequest?.remote_status_light_blink_rate_req, 0)}
          />
          <ValueRow
            label="Color"
            value={formatValue(remoteIndicatorRequest?.remote_status_light_color_req, 0)}
          />
          <StatusItem label="Horn" value={remoteIndicatorRequest?.remote_horn_req} />
          <StatusItem label="Brake Light" value={remoteIndicatorRequest?.remote_light_brake_req} />
          <StatusItem label="Blink Left" value={remoteIndicatorRequest?.remote_blink_left_req} />
          <StatusItem label="Blink Right" value={remoteIndicatorRequest?.remote_blink_right_req} />
          <StatusItem label="Brights" value={remoteIndicatorRequest?.remote_brights_on_req} />
          <StatusItem
            label="Reverse Light"
            value={remoteIndicatorRequest?.remote_light_reverse_req}
          />
          <StatusItem
            label="Turn Left"
            value={remoteIndicatorRequest?.remote_lights_turn_left_req}
          />
          <StatusItem
            label="Turn Right"
            value={remoteIndicatorRequest?.remote_lights_turn_right_req}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Toggle Request</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <StatusItem
            label="Speed Limit 4kmh"
            value={remoteApplicationToggleRequest?.app_toggle_req_speed_limit4kmh}
          />
          <StatusItem
            label="CAN Debug"
            value={remoteApplicationToggleRequest?.app_toggle_req_send_c_a_n_dbg_messages}
          />
          <StatusItem
            label="Power Assisted Braking"
            value={remoteApplicationToggleRequest?.app_toggle_req_pwr_assisted_braking}
          />
        </CardContent>
      </Card>
    </div>
  );
}
