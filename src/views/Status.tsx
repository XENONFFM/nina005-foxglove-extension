import { type ReactElement } from "react";

import { TelemetryCard } from "@/components/telemetry-card";
import { ApplicationStatus } from "@/schemas/ApplicationStatus";
import { GeneralVehicleStatus } from "@/schemas/GeneralVehicleStatus";

type StatusProps = {
  applicationStatus?: ApplicationStatus;
  generalVehicleStatus?: GeneralVehicleStatus;
};

export function Status({ applicationStatus, generalVehicleStatus }: StatusProps): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <TelemetryCard title="Application Status" message={applicationStatus} />
      <TelemetryCard title="General Vehicle Status" message={generalVehicleStatus} columns={2} />
    </div>
  );
}
