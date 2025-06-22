import { PanelExtensionContext, ParameterValue} from "@foxglove/extension";

import { Car } from "../schemas/car";

import { Card, CardContent } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { DriverlessState, DriverlessSystem } from "../schemas/DriverlessSystem";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Slider } from "../components/ui/slider"
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const defaultState: DriverlessSystem = {
    state: DriverlessState.OFF,
    ebs_activated: false,
    ts_active: false,
    mission_selected: false,
    asms_on: false,
    asb_checks_ok: false,
    r2d: false,
    scd_open_at_res: false,
    mission_finished: false,
    vehicle_at_standstill: false,
};

export function Driverless({ context, message }: { context: PanelExtensionContext, parameters: Map<string, ParameterValue>, message: Car }): JSX.Element {
    const [serviceEnabled, setServiceEnabled] = useState<boolean>(false)
    const [serviceState, setServiceState] = useState<DriverlessSystem>(defaultState);

    const handleServiceDataChange = useCallback(
        (value: Partial<DriverlessSystem>) => {
            setServiceState(prev => {
                const newState = { ...prev, ...value };
                return newState;
            });
        },[context, serviceState]
    );

    const handleServiceCall = useCallback(
        () => {
            if (typeof context.callService === "function") {
                context.callService("/driverless_system", serviceState);
            }
        },[context, serviceState]
    );

    useEffect(() => {
        if (!message.driverless_system.asms_on) {
            setServiceEnabled(false);
        }
    }, [message]);

    return (
        <div>
            <div className="grid grid-cols-3 gap-2 h-full w-full">
                <div className="col-start-1 row-start-1 flex justify-center items-start">
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
                                    <Switch checked={message.driverless_system.asms_on} onCheckedChange={(checked) => {context.setParameter("/zur_ecu.driverless_enabled", checked);}}></Switch>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label>Status</Label>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>ASB OK:</p>
                                        <Badge variant="secondary">{message.driverless_system.asb_checks_ok ? "✅" : "❌"}</Badge>
                                        </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>ASMS Enabled:</p>
                                        <Badge variant="secondary">{message.driverless_system.asms_on ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>EBS Activated:</p>
                                        <Badge variant="secondary">{message.driverless_system.ebs_activated ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Mission Finished:</p>
                                        <Badge variant="secondary">{message.driverless_system.mission_finished ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Mission Selected:</p>
                                        <Badge variant="secondary">{message.driverless_system.mission_selected ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>R2D:</p>
                                        <Badge variant="secondary">{message.driverless_system.r2d ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>SCD Open:</p>
                                        <Badge variant="secondary">{message.driverless_system.scd_open_at_res ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>State:</p>
                                        <Badge variant="secondary">{DriverlessState[message.driverless_system.state]}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>TS Active:</p>
                                        <Badge variant="secondary">{message.driverless_system.ts_active ? "✅" : "❌"}</Badge>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Vehicle at Standstill:</p>
                                        <Badge variant="secondary">{message.driverless_system.vehicle_at_standstill ? "✅" : "❌"}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-start-2 row-start-1 flex justify-center items-start">
                    <Card className="w-[400px] m-4">
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <div className="flex flex-row justify-between items-center">
                                    <div className="flex flex-col">
                                        <p className="scroll-m-20 text-lg font-semibold tracking-tight">
                                        Driverless Service Call
                                        </p>
                                    </div>
                                    <Switch 
                                        disabled={!message.driverless_system.asms_on}
                                        onCheckedChange={(checked) => {
                                            setServiceEnabled(checked)
                                        }}
                                        checked={serviceEnabled}
                                    ></Switch>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label>Status</Label>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>ASB OK:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.asb_checks_ok}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ asb_checks_ok: checked });
                                            }}
                                        ></Switch>
                                        </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>ASMS Enabled:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.asms_on}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ asms_on: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>EBS Activated:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.ebs_activated}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ ebs_activated: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Mission Finished:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.mission_finished}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ mission_finished: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Mission Selected:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.mission_selected}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ mission_selected: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>R2D:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.r2d}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ r2d: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>SCD Open:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.scd_open_at_res}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ scd_open_at_res: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>State:</p>
                                        <Select 
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled} 
                                            onValueChange={(value) => {
                                                handleServiceDataChange({ state: Number(value) });
                                            }}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder={DriverlessState[message.driverless_system.state]} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">OFF</SelectItem>
                                                <SelectItem value="1">READY</SelectItem>
                                                <SelectItem value="2">DRIVING</SelectItem>
                                                <SelectItem value="3">EMERGENCY</SelectItem>
                                                <SelectItem value="4">FINISHED</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>TS Active:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.ts_active}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ ts_active: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Vehicle at Standstill:</p>
                                        <Switch
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            // checked={message.driverless_system.vehicle_at_standstill}
                                            onCheckedChange={(checked) => {
                                                handleServiceDataChange({ vehicle_at_standstill: checked });
                                            }}
                                        ></Switch>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <Button
                                            disabled={!message.driverless_system.asms_on || !serviceEnabled}
                                            onClick={handleServiceCall}
                                        >Send</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-start-3 row-start-1 flex justify-center items-start">
                    <Card className="w-[400px] m-4">
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-col">
                                            <p className="scroll-m-20 text-lg font-semibold tracking-tight">
                                            Driverless Control Call
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label>Status</Label>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Throttle:</p>
                                        <Slider
                                            className={"w-[100px]"}
                                            disabled={!message.driverless_system.asms_on}
                                            onValueCommit={(value) => {
                                                if (typeof context.callService === "function") {
                                                    context.callService("/driverless", { dv_throttle: value[0] });
                                                }
                                            }}
                                            defaultValue={[0]} 
                                            min={0}
                                            max={100} 
                                            step={1} 
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Break:</p>
                                        <Slider
                                            className={"w-[100px]"}
                                            disabled={!message.driverless_system.asms_on}
                                            onValueCommit={(value) => {
                                                if (typeof context.callService === "function") {
                                                    context.callService("/driverless", { dv_break: value[0] });
                                                }
                                            }}
                                            defaultValue={[0]}
                                            min={0}
                                            max={100} 
                                            step={1}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Steering Angle:</p>
                                        <Slider
                                            className={"w-[100px]"}
                                            disabled={!message.driverless_system.asms_on}
                                            onValueCommit={(value) => {
                                                if (typeof context.callService === "function") {
                                                    context.callService("/driverless", { steering_angle: value[0] });
                                                }
                                            }}
                                            defaultValue={[0]} 
                                            min={-100}
                                            max={100} 
                                            step={1}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p>Trigger EBS:</p>
                                        <Button
                                            variant="destructive"
                                            disabled={!message.driverless_system.asms_on}
                                            onClick={() => {
                                                if (typeof context.callService === "function") {
                                                    context.callService("/driverless", { activate_ebs: true });
                                                }
                                            }}
                                        >Trigger</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
};