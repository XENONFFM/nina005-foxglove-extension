import React from "react";

import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

import { ApplicationStatus } from "@/schemas/ApplicationStatus";
import { GeneralVehicleStatus } from "@/schemas/GeneralVehicleStatus";

type StatusPanelProps = {
  applicationStatus?: ApplicationStatus;
  generalVehicleStatus?: GeneralVehicleStatus;
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

export function StatusPanel({
  applicationStatus,
  generalVehicleStatus,
}: StatusPanelProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <StatusItem
            label="Speed Limit 4kmh"
            value={applicationStatus?.app_status_speed_limit4kmh}
          />
          <StatusItem
            label="CAN Debug"
            value={applicationStatus?.app_status_send_c_a_n_dbg_messages}
          />
          <StatusItem
            label="Power Assisted Braking"
            value={applicationStatus?.app_status_pwr_assisted_braking}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <StatusItem label="12V Switch" value={generalVehicleStatus?.signal12_switch} />
            <StatusItem label="Zero Throttle" value={generalVehicleStatus?.request_zero_throttle} />
            <StatusItem label="Request Brake" value={generalVehicleStatus?.request_brake} />
            <StatusItem label="Brights On" value={generalVehicleStatus?.signal_brights_on} />
            <StatusItem label="Right Turn" value={generalVehicleStatus?.signal_right_turn} />
            <StatusItem label="Left Turn" value={generalVehicleStatus?.signal_left_turn} />
            <StatusItem label="Horn" value={generalVehicleStatus?.signal_horn} />
            <StatusItem label="Hazard Lights" value={generalVehicleStatus?.signal_hazard_lights} />
            <StatusItem label="Fog Lights" value={generalVehicleStatus?.signal_fog_lights} />
            <StatusItem label="Reverse" value={generalVehicleStatus?.signal_direction_reverse} />
            <StatusItem
              label="Manual Mag Brake"
              value={generalVehicleStatus?.global_man_sig_mag_brake}
            />
            <StatusItem
              label="Curtis Mag Brake"
              value={generalVehicleStatus?.global_curtis_sig_mag_brake}
            />
            <StatusItem label="Brake Switch" value={generalVehicleStatus?.signal_brake_switch} />
            <StatusItem label="Seat Switch" value={generalVehicleStatus?.signal_seat_switch} />
            <StatusItem label="E-Stop" value={generalVehicleStatus?.e_stop_status} />
            <StatusItem label="Button Blue" value={generalVehicleStatus?.button_blue} />
            <StatusItem label="Button Yellow" value={generalVehicleStatus?.button_yellow} />
            <StatusItem label="Button Green" value={generalVehicleStatus?.button_green} />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <ValueRow
              label="Selected Application"
              value={
                generalVehicleStatus?.selected_application !== undefined
                  ? String(generalVehicleStatus.selected_application)
                  : "--"
              }
            />
            <ValueRow
              label="Selected Op Mode"
              value={
                generalVehicleStatus?.selected_op_mode !== undefined
                  ? String(generalVehicleStatus.selected_op_mode)
                  : "--"
              }
            />
            <ValueRow
              label="Active Op Mode"
              value={
                generalVehicleStatus?.active_op_mode !== undefined
                  ? String(generalVehicleStatus.active_op_mode)
                  : "--"
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
