import React, { useState } from "react";

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
};

export function MainTabs({
  data,
  defaultTab = "drivetrain",
  activeTab,
  onTabChange,
  showMenuBar = true,
}: MainTabsProps): JSX.Element {
  const [internalTab, setInternalTab] = useState<string>(defaultTab);
  const currentTab = activeTab ?? internalTab;

  const handleTabChange = (value: string): void => {
    if (activeTab == undefined) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      {showMenuBar && (
        <TabsList className="w-md m-4 mx-auto" variant="line">
          <TabsTrigger value="drivetrain">Drivetrain</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="remote">Remote</TabsTrigger>
          <TabsTrigger value="parking">Park sensors</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="drivetrain">
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
      </TabsContent>
      <TabsContent value="signals">
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
      </TabsContent>
      <TabsContent value="status">
        <StatusPanel
          applicationStatus={data.applicationStatus}
          generalVehicleStatus={data.generalVehicleStatus}
        />
      </TabsContent>
      <TabsContent value="remote">
        <RemotePanel
          remoteDriveRequest={data.remoteDriveRequest}
          remoteIndicatorRequest={data.remoteIndicatorRequest}
          remoteApplicationToggleRequest={data.remoteApplicationToggleRequest}
        />
      </TabsContent>
      <TabsContent value="parking">
        <ParkSensorPage usSensorFront={data.usSensorFront} usSensorRear={data.usSensorRear} />
      </TabsContent>
    </Tabs>
  );
}
