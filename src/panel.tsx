import type { MessageEvent, PanelExtensionContext } from "@foxglove/extension";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";

import { usePanelSettings } from "@/components/extension-settings";
import { App } from "@/app";
import { ThemeProvider } from "@/components/theme-provider";
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

const prefix = "/zhaw_nina";

const TOPICS = {
  applicationStatus: `${prefix}/application_status`,
  batteryStatus: `${prefix}/battery_status`,
  generalVehicleStatus: `${prefix}/general_vehicle_status`,
  scaledSignals: `${prefix}/scaled_signals`,
  steeringAndSpeed: `${prefix}/steering_and_speed`,
  temperatures: `${prefix}/temperatures`,
  rawSignalBrake: `${prefix}/raw_signal_brake`,
  rawSignalThrottle: `${prefix}/raw_signal_throttle`,
  rawSignalSteeringPosition: `${prefix}/raw_signal_steering_position`,
  rawSignalSteeringForce: `${prefix}/raw_signal_steering_force`,
  rawSignalSteeringVelocity: `${prefix}/raw_signal_steering_velocity`,
  rawSignalSteeringVelocityCmd: `${prefix}/raw_signal_steering_velocity_cmd`,
  rawSignalThrottlePotiCmd: `${prefix}/raw_signal_throttle_poti_cmd`,
  rawSignalVehicleSpeed: `${prefix}/raw_signal_vehicle_speed`,
  usSensorFront: `${prefix}/u_s_sensor_front`,
  usSensorRear: `${prefix}/u_s_sensor_rear`,
  remoteDriveRequest: `${prefix}/remote_drive_request`,
  remoteIndicatorRequest: `${prefix}/remote_indicator_request`,
  remoteApplicationToggleRequest: `${prefix}/remote_application_toggle_request`,
} as const;

function Panel({ context }: { context: PanelExtensionContext }): ReactElement {
  const settings = usePanelSettings(context);
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
    <ThemeProvider defaultTheme="system">
      <App
        data={panelData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        defaultTab={settings.tabs.defaultTab}
        showMenuBar={!settings.tabs.hideMenuBar}
        showParkSensorDisplay={!settings.parkSensors.hideDisplay}
        showParkSensorControls={!settings.parkSensors.hideControls}
      />
    </ThemeProvider>
  );
}

export function initPanel(context: PanelExtensionContext): () => void {
  const root = createRoot(context.panelElement);

  root.render(
    <div className="h-full w-full bg-background">
      <Panel context={context} />
    </div>,
  );

  // Return a function to run when the panel is removed
  return () => {
    root.unmount();
  };
}
