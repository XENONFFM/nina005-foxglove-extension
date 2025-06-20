import { PanelExtensionContext, ParameterValue} from "@foxglove/extension";

import { Car } from "../schemas/car";

import { Card, CardContent } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { DriverlessState } from "../schemas/DriverlessSystem";

export function Driverless({ context, parameters, message }: { context: PanelExtensionContext, parameters: Map<string, ParameterValue>, message: Car }): JSX.Element {
  return (
    <Card className="w-[400px] m-4">
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <p className="scroll-m-20 text-lg font-semibold tracking-tight">
                            Driverless System
                            </p>
                        </div>
                        <Switch checked={parameters.get("/zur_ecu.driverless_enabled") as boolean} onCheckedChange={(checked) => {context.setParameter("/zur_ecu.driverless_enabled", checked);}}></Switch>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <Label>Status</Label>
                        <div className="flex flex-row justify-between items-center">
                            <p>ASB OK:</p>
                            <p>
                                {message.driverless_system.asb_checks_ok ? "✅" : "❌"}
                            </p>
                            </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>ASMS Enabled:</p>
                            <p>
                                {message.driverless_system.asms_on ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>EBS Activated:</p>
                            <p>
                                {message.driverless_system.ebs_activated ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Mission Finished:</p>
                            <p>
                                {message.driverless_system.mission_finished ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Mission Selected:</p>
                            <p>
                                {message.driverless_system.mission_selected ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>R2D:</p>
                            <p>
                                {message.driverless_system.r2d ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>SCD Open:</p>
                            <p>
                                {message.driverless_system.scd_open_at_res ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>State:</p>
                            <p>
                                {DriverlessState[message.driverless_system.state]}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>TS Active:</p>
                            <p>
                                {message.driverless_system.ts_active ? "✅" : "❌"}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Vehicle at Standstill:</p>
                            <p>
                                {message.driverless_system.vehicle_at_standstill ? "✅" : "❌"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
  )
};