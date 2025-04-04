import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox"

function valueString(value: any, unit: string, decimalPlaces: number = 0, scalar: number = 1) {
  return `${((value ?? 0) * scalar).toFixed(decimalPlaces)} ${unit}`;
}

export function MotorStatus({ motor }: { motor: any; name: string }) {
  return (
    <Card className="w-[400px] m-4">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <p className="scroll-m-20 text-lg font-semibold tracking-tight">
                  {valueString(motor?.inverter_actual_rpm, "RPM")}
                </p>
                <p className="scroll-m-20 text-sm tracking-tight">
                  {valueString(motor?.inverter_actual_torque, "Nm")}
                </p>
              </div>
              <Switch checked={true}></Switch>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label>Temperatures</Label>
            <div className="flex flex-row justify-between items-center">
              <p>Motor:</p>
              <p>{valueString(motor?.motor_temp, "°C", 1, 0.1)} / {valueString(motor?.max_motor_temp, "°C", 1, 0.1)}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p>Inverter:</p>
              <p>{valueString(motor?.inverter_temp, "°C", 1, 0.1)} / {valueString(motor?.max_inverter_temp, "°C", 1, 0.1)}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p>IGBT:</p>
              <p>{valueString(motor?.igbt_temp, "°C", 1, 0.1)} / {valueString(motor?.max_igbp_temp, "°C", 1, 0.1)}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label>Inverter</Label>

            <div className="flex flex-row gap-4">
              <div className="flex-grow flex flex-col space-y-1.5">
                <div className="flex flex-row justify-between items-center">
                  <p>On:</p>
                  <Checkbox checked={motor?.inverter_on ?? false} disabled></Checkbox>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p>DC On:</p>
                  <Checkbox checked={motor?.inverter_dc_on ?? false} disabled></Checkbox>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p>Ready:</p>
                  <Checkbox checked={motor?.inverter_system_ready ?? false} disabled></Checkbox>
                </div>
              </div>
              <div className="flex-grow flex flex-col space-y-1.5">
                <div className="flex flex-row justify-between items-center">
                  <p>Derating:</p>
                  <Checkbox checked={motor?.inverter_derating ?? false} disabled></Checkbox>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p>Error:</p>
                  <Checkbox checked={motor?.inverter_error ?? false} disabled></Checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
