import { type ReactElement, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { StatusPanel } from "../panels/Driverless";
import { DriveTrain } from "../panels/Drivetrain";
import ParkSensorPage from "../panels/ParkSensorPage";
import { RemotePanel } from "../panels/Remote";
import { SignalsPanel } from "../panels/Signals";

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

export type MainTabsData = {
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

type MainTabsProps = {
  data: MainTabsData;
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  showMenuBar?: boolean;
  showParkSensorDisplay?: boolean;
  showParkSensorControls?: boolean;
};

export function MainTabs({
  data,
  defaultTab = "drivetrain",
  activeTab,
  onTabChange,
  showMenuBar = true,
  showParkSensorDisplay = true,
  showParkSensorControls = true,
}: MainTabsProps): ReactElement {
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
            <TabsTrigger value="drivetrain">Drivetrain</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="remote">Remote</TabsTrigger>
            <TabsTrigger value="parking">Park sensors</TabsTrigger>
          </TabsList>
        </div>
      )}
      <TabsContent value="drivetrain" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <DriveTrain
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
          <SignalsPanel
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
          <StatusPanel
            applicationStatus={data.applicationStatus}
            generalVehicleStatus={data.generalVehicleStatus}
          />
        </div>
      </TabsContent>
      <TabsContent value="remote" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <RemotePanel
            remoteDriveRequest={data.remoteDriveRequest}
            remoteIndicatorRequest={data.remoteIndicatorRequest}
            remoteApplicationToggleRequest={data.remoteApplicationToggleRequest}
          />
        </div>
      </TabsContent>
      <TabsContent value="parking" className="w-full">
        <div className="w-full max-w-6xl mx-auto">
          <ParkSensorPage
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
