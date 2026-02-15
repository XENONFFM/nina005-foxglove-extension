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

type MockData = {
  applicationStatus: ApplicationStatus;
  batteryStatus: BatteryStatus;
  generalVehicleStatus: GeneralVehicleStatus;
  scaledSignals: ScaledSignals;
  steeringAndSpeed: SteeringAndSpeed;
  temperatures: Temperatures;
  rawSignalBrake: RawSignalBrake;
  rawSignalThrottle: RawSignalThrottle;
  rawSignalSteeringPosition: RawSignalSteeringPosition;
  rawSignalSteeringForce: RawSignalSteeringForce;
  rawSignalSteeringVelocity: RawSignalSteeringVelocity;
  rawSignalSteeringVelocityCmd: RawSignalSteeringVelocityCmd;
  rawSignalThrottlePotiCmd: RawSignalThrottlePotiCmd;
  rawSignalVehicleSpeed: RawSignalVehicleSpeed;
  usSensorFront: USSensorFront;
  usSensorRear: USSensorRear;
  remoteDriveRequest: RemoteDriveRequest;
  remoteIndicatorRequest: RemoteIndicatorRequest;
  remoteApplicationToggleRequest: RemoteApplicationToggleRequest;
};

const header = {
  stamp: { sec: 0, nsec: 0 },
  frame_id: "base_link",
};

export function createMockData(): MockData {
  return {
    applicationStatus: {
      header,
      app_status_speed_limit4kmh: false,
      app_status_send_c_a_n_dbg_messages: false,
      app_status_pwr_assisted_braking: true,
    },
    batteryStatus: {
      header,
      battery_discharge_percent: 72,
      battery_current: 18.4,
      battery_voltage: 321.2,
    },
    generalVehicleStatus: {
      header,
      signal12_switch: true,
      request_zero_throttle: false,
      request_brake: false,
      signal_brights_on: false,
      signal_right_turn: false,
      signal_left_turn: false,
      signal_horn: false,
      signal_hazard_lights: false,
      signal_fog_lights: false,
      signal_direction_reverse: false,
      global_man_sig_mag_brake: false,
      global_curtis_sig_mag_brake: false,
      signal_brake_switch: false,
      signal_seat_switch: true,
      e_stop_status: false,
      selected_application: 1,
      selected_op_mode: 2,
      active_op_mode: 2,
      button_blue: false,
      button_yellow: false,
      button_green: true,
    },
    scaledSignals: {
      header,
      throttle_signal: 12,
      steering_motor_speed_cmd: 8,
      curtis_speed_cmd: 145,
      steering_torque_signal: 5,
      steering_velocity_signal: 2,
      brake_signal: 0,
    },
    steeringAndSpeed: {
      header,
      vehicle_velocity_requested: 2.4,
      steering_position_requested: -3.2,
      vehicle_velocity_measured: 2.1,
      steering_position_measured: -2.7,
    },
    temperatures: {
      header,
      steering_motor_inverter_temp: 44,
      steering_motor_temp: 48,
      curtis_controller_temp: 51,
      curtis_motor_temp: 55,
    },
    rawSignalBrake: {
      header,
      uint32_signal_brake_b: 120,
      uint32_signal_brake_a: 118,
    },
    rawSignalThrottle: {
      header,
      uint32_signal_throttle_b: 310,
      uint32_signal_throttle_a: 305,
    },
    rawSignalSteeringPosition: {
      header,
      uint16_encoder_raw_value_b: 512,
      uint16_encoder_raw_value_a: 508,
    },
    rawSignalSteeringForce: {
      header,
      uint32_signal_steering_force_b: 22,
      uint32_signal_steering_force_a: 20,
    },
    rawSignalSteeringVelocity: {
      header,
      int16_steering_velocity: 1.2,
    },
    rawSignalSteeringVelocityCmd: {
      header,
      int16_steering_velocity_cmd: 1.5,
    },
    rawSignalThrottlePotiCmd: {
      header,
      uint16_poti_throttle_cmd: 210,
    },
    rawSignalVehicleSpeed: {
      header,
      uint8_vehicle_speed: 2.0,
    },
    usSensorFront: {
      header,
      u_s_sensor1: 2,
      u_s_sensor2: 4,
      u_s_sensor3: 3,
      u_s_sensor4: 1,
    },
    usSensorRear: {
      header,
      u_s_sensor5: 1,
      u_s_sensor6: 2,
      u_s_sensor7: 3,
      u_s_sensor8: 2,
    },
    remoteDriveRequest: {
      header,
      remote_steering_angle_req: -5.0,
      remote_velocity_req: 2.5,
    },
    remoteIndicatorRequest: {
      header,
      remote_status_light_blink_rate_req: 2,
      remote_status_light_color_req: 1,
      remote_horn_req: false,
      remote_light_brake_req: false,
      remote_blink_left_req: false,
      remote_blink_right_req: true,
      remote_brights_on_req: false,
      remote_light_reverse_req: false,
      remote_lights_turn_left_req: false,
      remote_lights_turn_right_req: true,
    },
    remoteApplicationToggleRequest: {
      header,
      app_toggle_req_speed_limit4kmh: false,
      app_toggle_req_send_c_a_n_dbg_messages: false,
      app_toggle_req_pwr_assisted_braking: true,
    },
  };
}

export function jitter(value: number, spread: number, min = -Infinity, max = Infinity): number {
  const next = value + (Math.random() * spread * 2 - spread);
  return Math.min(max, Math.max(min, next));
}

export function randomizeMockData(prev: MockData): MockData {
  return {
    applicationStatus: prev.applicationStatus,
    batteryStatus: {
      ...prev.batteryStatus,
      battery_discharge_percent: Math.round(
        jitter(prev.batteryStatus.battery_discharge_percent, 2, 0, 100),
      ),
      battery_current: jitter(prev.batteryStatus.battery_current, 3, 0),
      battery_voltage: jitter(prev.batteryStatus.battery_voltage, 2, 250, 400),
    },
    generalVehicleStatus: prev.generalVehicleStatus,
    scaledSignals: {
      ...prev.scaledSignals,
      throttle_signal: Math.round(jitter(prev.scaledSignals.throttle_signal, 5, 0, 100)),
      brake_signal: Math.round(jitter(prev.scaledSignals.brake_signal, 4, 0, 100)),
      steering_velocity_signal: jitter(prev.scaledSignals.steering_velocity_signal, 1, -20, 20),
      steering_torque_signal: jitter(prev.scaledSignals.steering_torque_signal, 1, -50, 50),
      curtis_speed_cmd: Math.round(jitter(prev.scaledSignals.curtis_speed_cmd, 20, 0, 255)),
    },
    steeringAndSpeed: {
      ...prev.steeringAndSpeed,
      vehicle_velocity_requested: jitter(
        prev.steeringAndSpeed.vehicle_velocity_requested,
        0.5,
        -5,
        5,
      ),
      vehicle_velocity_measured: jitter(
        prev.steeringAndSpeed.vehicle_velocity_measured,
        0.4,
        -5,
        5,
      ),
      steering_position_requested: jitter(
        prev.steeringAndSpeed.steering_position_requested,
        1.2,
        -20,
        20,
      ),
      steering_position_measured: jitter(
        prev.steeringAndSpeed.steering_position_measured,
        1.0,
        -20,
        20,
      ),
    },
    temperatures: {
      ...prev.temperatures,
      steering_motor_inverter_temp: Math.round(
        jitter(prev.temperatures.steering_motor_inverter_temp, 1, 20, 90),
      ),
      steering_motor_temp: Math.round(jitter(prev.temperatures.steering_motor_temp, 1, 20, 100)),
      curtis_controller_temp: Math.round(
        jitter(prev.temperatures.curtis_controller_temp, 1, 20, 100),
      ),
      curtis_motor_temp: Math.round(jitter(prev.temperatures.curtis_motor_temp, 1, 20, 110)),
    },
    rawSignalBrake: {
      ...prev.rawSignalBrake,
      uint32_signal_brake_a: Math.round(
        jitter(prev.rawSignalBrake.uint32_signal_brake_a, 10, 0, 1023),
      ),
      uint32_signal_brake_b: Math.round(
        jitter(prev.rawSignalBrake.uint32_signal_brake_b, 10, 0, 1023),
      ),
    },
    rawSignalThrottle: {
      ...prev.rawSignalThrottle,
      uint32_signal_throttle_a: Math.round(
        jitter(prev.rawSignalThrottle.uint32_signal_throttle_a, 10, 0, 1023),
      ),
      uint32_signal_throttle_b: Math.round(
        jitter(prev.rawSignalThrottle.uint32_signal_throttle_b, 10, 0, 1023),
      ),
    },
    rawSignalSteeringPosition: {
      ...prev.rawSignalSteeringPosition,
      uint16_encoder_raw_value_a: Math.round(
        jitter(prev.rawSignalSteeringPosition.uint16_encoder_raw_value_a, 8, 0, 1023),
      ),
      uint16_encoder_raw_value_b: Math.round(
        jitter(prev.rawSignalSteeringPosition.uint16_encoder_raw_value_b, 8, 0, 1023),
      ),
    },
    rawSignalSteeringForce: {
      ...prev.rawSignalSteeringForce,
      uint32_signal_steering_force_a: Math.round(
        jitter(prev.rawSignalSteeringForce.uint32_signal_steering_force_a, 3, 0, 255),
      ),
      uint32_signal_steering_force_b: Math.round(
        jitter(prev.rawSignalSteeringForce.uint32_signal_steering_force_b, 3, 0, 255),
      ),
    },
    rawSignalSteeringVelocity: {
      ...prev.rawSignalSteeringVelocity,
      int16_steering_velocity: jitter(
        prev.rawSignalSteeringVelocity.int16_steering_velocity,
        0.5,
        -10,
        10,
      ),
    },
    rawSignalSteeringVelocityCmd: {
      ...prev.rawSignalSteeringVelocityCmd,
      int16_steering_velocity_cmd: jitter(
        prev.rawSignalSteeringVelocityCmd.int16_steering_velocity_cmd,
        0.5,
        -10,
        10,
      ),
    },
    rawSignalThrottlePotiCmd: {
      ...prev.rawSignalThrottlePotiCmd,
      uint16_poti_throttle_cmd: Math.round(
        jitter(prev.rawSignalThrottlePotiCmd.uint16_poti_throttle_cmd, 10, 0, 1023),
      ),
    },
    rawSignalVehicleSpeed: {
      ...prev.rawSignalVehicleSpeed,
      uint8_vehicle_speed: jitter(prev.rawSignalVehicleSpeed.uint8_vehicle_speed, 0.2, 0, 25),
    },
    usSensorFront: {
      ...prev.usSensorFront,
      u_s_sensor1: Math.round(jitter(prev.usSensorFront.u_s_sensor1, 1, 0, 8)),
      u_s_sensor2: Math.round(jitter(prev.usSensorFront.u_s_sensor2, 1, 0, 8)),
      u_s_sensor3: Math.round(jitter(prev.usSensorFront.u_s_sensor3, 1, 0, 8)),
      u_s_sensor4: Math.round(jitter(prev.usSensorFront.u_s_sensor4, 1, 0, 8)),
    },
    usSensorRear: {
      ...prev.usSensorRear,
      u_s_sensor5: Math.round(jitter(prev.usSensorRear.u_s_sensor5, 1, 0, 8)),
      u_s_sensor6: Math.round(jitter(prev.usSensorRear.u_s_sensor6, 1, 0, 8)),
      u_s_sensor7: Math.round(jitter(prev.usSensorRear.u_s_sensor7, 1, 0, 8)),
      u_s_sensor8: Math.round(jitter(prev.usSensorRear.u_s_sensor8, 1, 0, 8)),
    },
    remoteDriveRequest: {
      ...prev.remoteDriveRequest,
      remote_steering_angle_req: jitter(
        prev.remoteDriveRequest.remote_steering_angle_req,
        1,
        -20,
        20,
      ),
      remote_velocity_req: jitter(prev.remoteDriveRequest.remote_velocity_req, 0.4, -5, 5),
    },
    remoteIndicatorRequest: prev.remoteIndicatorRequest,
    remoteApplicationToggleRequest: prev.remoteApplicationToggleRequest,
  };
}
