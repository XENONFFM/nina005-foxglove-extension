import type { MessageEvent, PanelExtensionContext } from "@foxglove/extension";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import { MainTabs } from "./components/main-tabs";
import { ThemeProvider } from "./components/theme-provider";
import { useMainPanelSettings } from "./extension-settings";

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

const TOPICS = {
  applicationStatus: "/application_status",
  batteryStatus: "/battery_status",
  generalVehicleStatus: "/general_vehicle_status",
  scaledSignals: "/scaled_signals",
  steeringAndSpeed: "/steering_and_speed",
  temperatures: "/temperatures",
  rawSignalBrake: "/raw_signal_brake",
  rawSignalThrottle: "/raw_signal_throttle",
  rawSignalSteeringPosition: "/raw_signal_steering_position",
  rawSignalSteeringForce: "/raw_signal_steering_force",
  rawSignalSteeringVelocity: "/raw_signal_steering_velocity",
  rawSignalSteeringVelocityCmd: "/raw_signal_steering_velocity_cmd",
  rawSignalThrottlePotiCmd: "/raw_signal_throttle_poti_cmd",
  rawSignalVehicleSpeed: "/raw_signal_vehicle_speed",
  usSensorFront: "/us_sensor_front",
  usSensorRear: "/us_sensor_rear",
  remoteDriveRequest: "/remote_drive_request",
  remoteIndicatorRequest: "/remote_indicator_request",
  remoteApplicationToggleRequest: "/remote_application_toggle_request",
} as const;

function MainPanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const settings = useMainPanelSettings(context);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>();
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>();
  const [generalVehicleStatus, setGeneralVehicleStatus] = useState<GeneralVehicleStatus>();
  const [scaledSignals, setScaledSignals] = useState<ScaledSignals>();
  const [steeringAndSpeed, setSteeringAndSpeed] = useState<SteeringAndSpeed>();
  const [temperatures, setTemperatures] = useState<Temperatures>();
  const [rawSignalBrake, setRawSignalBrake] = useState<RawSignalBrake>();
  const [rawSignalThrottle, setRawSignalThrottle] = useState<RawSignalThrottle>();
  const [rawSignalSteeringPosition, setRawSignalSteeringPosition] =
    useState<RawSignalSteeringPosition>();
  const [rawSignalSteeringForce, setRawSignalSteeringForce] = useState<RawSignalSteeringForce>();
  const [rawSignalSteeringVelocity, setRawSignalSteeringVelocity] =
    useState<RawSignalSteeringVelocity>();
  const [rawSignalSteeringVelocityCmd, setRawSignalSteeringVelocityCmd] =
    useState<RawSignalSteeringVelocityCmd>();
  const [rawSignalThrottlePotiCmd, setRawSignalThrottlePotiCmd] =
    useState<RawSignalThrottlePotiCmd>();
  const [rawSignalVehicleSpeed, setRawSignalVehicleSpeed] = useState<RawSignalVehicleSpeed>();
  const [usSensorFront, setUsSensorFront] = useState<USSensorFront>();
  const [usSensorRear, setUsSensorRear] = useState<USSensorRear>();
  const [remoteDriveRequest, setRemoteDriveRequest] = useState<RemoteDriveRequest>();
  const [remoteIndicatorRequest, setRemoteIndicatorRequest] = useState<RemoteIndicatorRequest>();
  const [remoteApplicationToggleRequest, setRemoteApplicationToggleRequest] =
    useState<RemoteApplicationToggleRequest>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  const topicHandlers = useMemo(
    () => ({
      [TOPICS.applicationStatus]: (event: MessageEvent) => {
        setApplicationStatus(event.message as ApplicationStatus);
      },
      [TOPICS.batteryStatus]: (event: MessageEvent) => {
        setBatteryStatus(event.message as BatteryStatus);
      },
      [TOPICS.generalVehicleStatus]: (event: MessageEvent) => {
        setGeneralVehicleStatus(event.message as GeneralVehicleStatus);
      },
      [TOPICS.scaledSignals]: (event: MessageEvent) => {
        setScaledSignals(event.message as ScaledSignals);
      },
      [TOPICS.steeringAndSpeed]: (event: MessageEvent) => {
        setSteeringAndSpeed(event.message as SteeringAndSpeed);
      },
      [TOPICS.temperatures]: (event: MessageEvent) => {
        setTemperatures(event.message as Temperatures);
      },
      [TOPICS.rawSignalBrake]: (event: MessageEvent) => {
        setRawSignalBrake(event.message as RawSignalBrake);
      },
      [TOPICS.rawSignalThrottle]: (event: MessageEvent) => {
        setRawSignalThrottle(event.message as RawSignalThrottle);
      },
      [TOPICS.rawSignalSteeringPosition]: (event: MessageEvent) => {
        setRawSignalSteeringPosition(event.message as RawSignalSteeringPosition);
      },
      [TOPICS.rawSignalSteeringForce]: (event: MessageEvent) => {
        setRawSignalSteeringForce(event.message as RawSignalSteeringForce);
      },
      [TOPICS.rawSignalSteeringVelocity]: (event: MessageEvent) => {
        setRawSignalSteeringVelocity(event.message as RawSignalSteeringVelocity);
      },
      [TOPICS.rawSignalSteeringVelocityCmd]: (event: MessageEvent) => {
        setRawSignalSteeringVelocityCmd(event.message as RawSignalSteeringVelocityCmd);
      },
      [TOPICS.rawSignalThrottlePotiCmd]: (event: MessageEvent) => {
        setRawSignalThrottlePotiCmd(event.message as RawSignalThrottlePotiCmd);
      },
      [TOPICS.rawSignalVehicleSpeed]: (event: MessageEvent) => {
        setRawSignalVehicleSpeed(event.message as RawSignalVehicleSpeed);
      },
      [TOPICS.usSensorFront]: (event: MessageEvent) => {
        setUsSensorFront(event.message as USSensorFront);
      },
      [TOPICS.usSensorRear]: (event: MessageEvent) => {
        setUsSensorRear(event.message as USSensorRear);
      },
      [TOPICS.remoteDriveRequest]: (event: MessageEvent) => {
        setRemoteDriveRequest(event.message as RemoteDriveRequest);
      },
      [TOPICS.remoteIndicatorRequest]: (event: MessageEvent) => {
        setRemoteIndicatorRequest(event.message as RemoteIndicatorRequest);
      },
      [TOPICS.remoteApplicationToggleRequest]: (event: MessageEvent) => {
        setRemoteApplicationToggleRequest(event.message as RemoteApplicationToggleRequest);
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      if (renderState.currentFrame) {
        for (const event of renderState.currentFrame) {
          if (event.topic in topicHandlers) {
            const handler = topicHandlers[event.topic as keyof typeof topicHandlers];
            handler(event as MessageEvent);
          }
        }
      }
    };

    context.watch("currentFrame");
    context.watch("colorScheme");

    context.subscribe(Object.values(TOPICS).map((topic) => ({ topic })));
  }, [context, topicHandlers]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  const [activeTab, setActiveTab] = useState<string>(settings.tabs.defaultTab);

  useEffect(() => {
    setActiveTab(settings.tabs.defaultTab);
  }, [settings.tabs.defaultTab]);

  const panelData = useMemo(
    () => ({
      applicationStatus,
      batteryStatus,
      generalVehicleStatus,
      scaledSignals,
      steeringAndSpeed,
      temperatures,
      rawSignalBrake,
      rawSignalThrottle,
      rawSignalSteeringPosition,
      rawSignalSteeringForce,
      rawSignalSteeringVelocity,
      rawSignalSteeringVelocityCmd,
      rawSignalThrottlePotiCmd,
      rawSignalVehicleSpeed,
      usSensorFront,
      usSensorRear,
      remoteDriveRequest,
      remoteIndicatorRequest,
      remoteApplicationToggleRequest,
    }),
    [
      applicationStatus,
      batteryStatus,
      generalVehicleStatus,
      scaledSignals,
      steeringAndSpeed,
      temperatures,
      rawSignalBrake,
      rawSignalThrottle,
      rawSignalSteeringPosition,
      rawSignalSteeringForce,
      rawSignalSteeringVelocity,
      rawSignalSteeringVelocityCmd,
      rawSignalThrottlePotiCmd,
      rawSignalVehicleSpeed,
      usSensorFront,
      usSensorRear,
      remoteDriveRequest,
      remoteIndicatorRequest,
      remoteApplicationToggleRequest,
    ],
  );

  return (
    <>
      <MainTabs
        data={panelData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        defaultTab={settings.tabs.defaultTab}
        showMenuBar={!settings.tabs.hideMenuBar}
      />
    </>
  );
}

export function initMainPanel(context: PanelExtensionContext): () => void {
  const root = createRoot(context.panelElement);

  root.render(
    <ThemeProvider defaultTheme="dark">
      <div className="h-full w-full bg-background">
        <MainPanel context={context} />
      </div>
    </ThemeProvider>,
  );

  // Return a function to run when the panel is removed
  return () => {
    root.unmount();
  };
}
