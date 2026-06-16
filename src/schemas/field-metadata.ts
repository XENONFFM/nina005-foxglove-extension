export type FieldMeta = {
  label?: string;
  unit?: string;
  digits?: number;
};

export const FIELD_METADATA: Record<string, FieldMeta> = {
  app_status_speed_limit4kmh: { label: "Speed Limit 4kmh" },
  app_status_send_c_a_n_dbg_messages: { label: "CAN Debug" },
  app_status_pwr_assisted_braking: { label: "Power Assisted Braking" },

  signal12_switch: { label: "12V Switch" },
  request_zero_throttle: { label: "Zero Throttle" },
  request_brake: { label: "Request Brake" },
  signal_brights_on: { label: "Brights On" },
  signal_right_turn: { label: "Right Turn" },
  signal_left_turn: { label: "Left Turn" },
  signal_horn: { label: "Horn" },
  signal_hazard_lights: { label: "Hazard Lights" },
  signal_fog_lights: { label: "Fog Lights" },
  signal_direction_reverse: { label: "Reverse" },
  global_man_sig_mag_brake: { label: "Manual Mag Brake" },
  global_curtis_sig_mag_brake: { label: "Curtis Mag Brake" },
  signal_brake_switch: { label: "Brake Switch" },
  signal_seat_switch: { label: "Seat Switch" },
  e_stop_status: { label: "E-Stop" },
  selected_application: { label: "Selected Application", digits: 0 },
  selected_op_mode: { label: "Selected Op Mode", digits: 0 },
  active_op_mode: { label: "Active Op Mode", digits: 0 },
  button_blue: { label: "Button Blue" },
  button_yellow: { label: "Button Yellow" },
  button_green: { label: "Button Green" },

  battery_discharge_percent: { label: "Discharge", unit: "%", digits: 0 },
  battery_current: { label: "Current", unit: "A", digits: 2 },
  battery_voltage: { label: "Voltage", unit: "V", digits: 2 },

  vehicle_velocity_requested: { label: "Speed Requested", unit: "m/s", digits: 2 },
  vehicle_velocity_measured: { label: "Speed Measured", unit: "m/s", digits: 2 },
  steering_position_requested: { label: "Steering Requested", unit: "%", digits: 2 },
  steering_position_measured: { label: "Steering Measured", unit: "%", digits: 2 },

  steering_motor_inverter_temp: { label: "Steering Inverter", unit: "C", digits: 0 },
  steering_motor_temp: { label: "Steering Motor", unit: "C", digits: 0 },
  curtis_controller_temp: { label: "Curtis Controller", unit: "C", digits: 0 },
  curtis_motor_temp: { label: "Curtis Motor", unit: "C", digits: 0 },

  throttle_signal: { label: "Throttle", digits: 0 },
  brake_signal: { label: "Brake", digits: 0 },
  steering_torque_signal: { label: "Steering Torque", digits: 0 },
  steering_motor_speed_cmd: { label: "Steering Motor Cmd", digits: 0 },
  steering_velocity_signal: { label: "Steering Velocity", digits: 0 },
  curtis_speed_cmd: { label: "Curtis Speed Cmd", digits: 0 },

  uint8_vehicle_speed: { label: "Vehicle Speed", unit: "m/s", digits: 2 },
  uint32_signal_brake_a: { label: "Brake A", digits: 0 },
  uint32_signal_brake_b: { label: "Brake B", digits: 0 },
  uint32_signal_throttle_a: { label: "Throttle A", digits: 0 },
  uint32_signal_throttle_b: { label: "Throttle B", digits: 0 },
  uint16_poti_throttle_cmd: { label: "Throttle Cmd", digits: 0 },
  uint16_encoder_raw_value_a: { label: "Encoder A", digits: 0 },
  uint16_encoder_raw_value_b: { label: "Encoder B", digits: 0 },
  uint32_signal_steering_force_a: { label: "Force A", digits: 0 },
  uint32_signal_steering_force_b: { label: "Force B", digits: 0 },
  int16_steering_velocity: { label: "Velocity", digits: 2 },
  int16_steering_velocity_cmd: { label: "Velocity Cmd", digits: 2 },

  remote_steering_angle_req: { label: "Steering Angle", unit: "deg", digits: 2 },
  remote_velocity_req: { label: "Velocity", unit: "m/s", digits: 2 },
  remote_status_light_blink_rate_req: { label: "Blink Rate", digits: 0 },
  remote_status_light_color_req: { label: "Color", digits: 0 },
  remote_horn_req: { label: "Horn" },
  remote_light_brake_req: { label: "Brake Light" },
  remote_blink_left_req: { label: "Blink Left" },
  remote_blink_right_req: { label: "Blink Right" },
  remote_brights_on_req: { label: "Brights" },
  remote_light_reverse_req: { label: "Reverse Light" },
  remote_lights_turn_left_req: { label: "Turn Left" },
  remote_lights_turn_right_req: { label: "Turn Right" },
  app_toggle_req_speed_limit4kmh: { label: "Speed Limit 4kmh" },
  app_toggle_req_send_c_a_n_dbg_messages: { label: "CAN Debug" },
  app_toggle_req_pwr_assisted_braking: { label: "Power Assisted Braking" },
};

export function getFieldMeta(fieldKey: string): FieldMeta | undefined {
  return FIELD_METADATA[fieldKey];
}
