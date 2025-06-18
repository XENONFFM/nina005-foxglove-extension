import { PanelExtensionContext, ParameterValue } from "@foxglove/extension";

import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

import { Motor } from "@/schemas/Motor";

export function MotorStatus({
  motor,
  parameters,
  context,
  name
}: {
  motor: Motor;
  parameters: Map<string, ParameterValue>;
  context: PanelExtensionContext;
  name: string;
}): JSX.Element {
  return (
    <Card className="w-[400px] m-4">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <p className="scroll-m-20 text-lg font-semibold tracking-tight">
                  {motor.inverter_actual_rpm} RPM
                </p>
                <p className="scroll-m-20 text-sm tracking-tight">
                  {motor.inverter_actual_torque} Nm
                </p>
              </div>
              <Switch checked={parameters.get("/zur_ecu.motor_"+name+"_enabled") as boolean} onCheckedChange={(checked) => {context.setParameter("/zur_ecu.motor_"+name+"_enabled", checked);}}></Switch>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label>Temperatures</Label>
            <div className="flex flex-row justify-between items-center">
              <p>Motor:</p>
              <p>
                {motor.motor_temp} °C/ {motor.max_motor_temp} °C
              </p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p>Inverter:</p>
              <p>
                {motor.inverter_temp} °C/ {motor.max_inverter_temp} °C
              </p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p>IGBT:</p>
              <p>
                {motor.igbt_temp} °C/ {motor.max_igbp_temp} °C
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label>Inverter</Label>

            <div className="flex flex-row gap-4">
              <div className="flex-grow flex flex-col space-y-1.5">
                <div className="flex flex-row justify-between items-center">
                  <p>On:</p>
                  <Checkbox checked={motor.inverter_on} disabled></Checkbox>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p>DC On:</p>
                  <Checkbox checked={motor.inverter_dc_on} disabled></Checkbox>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p>Ready:</p>
                  <Checkbox checked={motor.inverter_system_ready} disabled></Checkbox>
                </div>
              </div>
              <div className="flex-grow flex flex-col space-y-1.5">
                <div className="flex flex-row justify-between items-center">
                  <p>Derating:</p>
                  <Checkbox checked={motor.inverter_derating} disabled></Checkbox>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p>Error:</p>
                  <Checkbox checked={motor.inverter_error} disabled></Checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
