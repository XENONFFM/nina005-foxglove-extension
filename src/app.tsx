import { type ReactElement, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ApplicationStatus,
  BatteryStatus,
  GeneralVehicleStatus,
  RawSignalBrake,
  RawSignalSteeringForce,
  RawSignalSteeringPosition,
  RawSignalSteeringVelocity,
  RawSignalSteeringVelocityCmd,
  RawSignalThrottle,
  RawSignalThrottlePotiCmd,
  RawSignalVehicleSpeed,
  RemoteApplicationToggleRequest,
  RemoteDriveRequest,
  RemoteIndicatorRequest,
  ScaledSignals,
  SteeringAndSpeed,
  Temperatures,
  USSensorFront,
  USSensorRear,
} from "@/schemas";
import { Cluster } from "@/views/Cluster";
import { Dashboard } from "@/views/Dashboard";
import { Remote } from "@/views/Remote";
import { Signals } from "@/views/Signals";
import { Status } from "@/views/Status";
import { UsSensors } from "@/views/UsSensors";
import { Vehicle } from "@/views/Vehicle";

export type AppData = {
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
  remoteIndicatorRequest?: RemoteIndicatorRequest;
  remoteApplicationToggleRequest?: RemoteApplicationToggleRequest;
};

type AppProps = {
  data: AppData;
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  showMenuBar?: boolean;
  showParkSensorDisplay?: boolean;
  showParkSensorControls?: boolean;
};

export function App({
  data,
  defaultTab = "drivetrain",
  activeTab,
  onTabChange,
  showMenuBar = true,
  showParkSensorDisplay = true,
  showParkSensorControls = true,
}: AppProps): ReactElement {
  const [internalTab, setInternalTab] = useState<string>(defaultTab);
  const currentTab = activeTab ?? internalTab;

  const handleTabChange = (value: string): void => {
    if (activeTab == undefined) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-col w-full">
      {showMenuBar && (
        <div className="w-full my-4 flex justify-center">
          <TabsList className="w-fit" variant="default">
            <TabsTrigger value="cluster">Cluster</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="drivetrain">Drivetrain</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="remote">Remote</TabsTrigger>
            <TabsTrigger value="parking">Park sensors</TabsTrigger>
          </TabsList>
        </div>
      )}
      <TabsContent value="cluster" className="w-full overflow-hidden">
        <div className="w-full max-w-none overflow-hidden">
          <Cluster
            applicationStatus={data.applicationStatus}
            batteryStatus={data.batteryStatus}
            generalVehicleStatus={data.generalVehicleStatus}
            scaledSignals={data.scaledSignals}
            steeringAndSpeed={data.steeringAndSpeed}
            temperatures={data.temperatures}
            usSensorFront={data.usSensorFront}
            usSensorRear={data.usSensorRear}
            remoteDriveRequest={data.remoteDriveRequest}
          />
        </div>
      </TabsContent>
      <TabsContent value="dashboard" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <Dashboard
            applicationStatus={data.applicationStatus}
            batteryStatus={data.batteryStatus}
            generalVehicleStatus={data.generalVehicleStatus}
            scaledSignals={data.scaledSignals}
            steeringAndSpeed={data.steeringAndSpeed}
            temperatures={data.temperatures}
            rawSignalBrake={data.rawSignalBrake}
            rawSignalThrottle={data.rawSignalThrottle}
            rawSignalSteeringPosition={data.rawSignalSteeringPosition}
            rawSignalSteeringForce={data.rawSignalSteeringForce}
            rawSignalSteeringVelocity={data.rawSignalSteeringVelocity}
            rawSignalSteeringVelocityCmd={data.rawSignalSteeringVelocityCmd}
            rawSignalThrottlePotiCmd={data.rawSignalThrottlePotiCmd}
            rawSignalVehicleSpeed={data.rawSignalVehicleSpeed}
            usSensorFront={data.usSensorFront}
            usSensorRear={data.usSensorRear}
            remoteDriveRequest={data.remoteDriveRequest}
          />
        </div>
      </TabsContent>
      <TabsContent value="drivetrain" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <Vehicle
            batteryStatus={data.batteryStatus}
            scaledSignals={data.scaledSignals}
            steeringAndSpeed={data.steeringAndSpeed}
            temperatures={data.temperatures}
            rawSignalBrake={data.rawSignalBrake}
            rawSignalThrottle={data.rawSignalThrottle}
            rawSignalSteeringPosition={data.rawSignalSteeringPosition}
            rawSignalSteeringForce={data.rawSignalSteeringForce}
            rawSignalSteeringVelocity={data.rawSignalSteeringVelocity}
            rawSignalSteeringVelocityCmd={data.rawSignalSteeringVelocityCmd}
            rawSignalThrottlePotiCmd={data.rawSignalThrottlePotiCmd}
            rawSignalVehicleSpeed={data.rawSignalVehicleSpeed}
          />
        </div>
      </TabsContent>
      <TabsContent value="signals" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <Signals
            rawSignalBrake={data.rawSignalBrake}
            rawSignalThrottle={data.rawSignalThrottle}
            rawSignalSteeringPosition={data.rawSignalSteeringPosition}
            rawSignalSteeringForce={data.rawSignalSteeringForce}
            rawSignalSteeringVelocity={data.rawSignalSteeringVelocity}
            rawSignalSteeringVelocityCmd={data.rawSignalSteeringVelocityCmd}
            rawSignalThrottlePotiCmd={data.rawSignalThrottlePotiCmd}
            rawSignalVehicleSpeed={data.rawSignalVehicleSpeed}
          />
        </div>
      </TabsContent>
      <TabsContent value="status" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <Status
            applicationStatus={data.applicationStatus}
            generalVehicleStatus={data.generalVehicleStatus}
          />
        </div>
      </TabsContent>
      <TabsContent value="remote" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <Remote
            remoteDriveRequest={data.remoteDriveRequest}
            remoteIndicatorRequest={data.remoteIndicatorRequest}
            remoteApplicationToggleRequest={data.remoteApplicationToggleRequest}
          />
        </div>
      </TabsContent>
      <TabsContent value="parking" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <UsSensors
            usSensorFront={data.usSensorFront}
            usSensorRear={data.usSensorRear}
            showDisplay={showParkSensorDisplay}
            showControls={showParkSensorControls}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
