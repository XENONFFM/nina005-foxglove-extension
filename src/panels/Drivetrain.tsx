import { PanelExtensionContext, ParameterValue} from "@foxglove/extension";

import { MotorStatus } from "./MotorStatus";
import { RaceCar } from "./RaceCar";

import { Car } from "../schemas/car";

import { Card, CardContent } from "../components/ui/card";


export function DriveTrain({ context, parameters, message }: { context: PanelExtensionContext, parameters: Map<string, ParameterValue>, message: Car }): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2 h-full w-full">
      <div className="col-start-2 row-start-1 row-span-2 flex justify-center items-center">
        <RaceCar></RaceCar>
      </div>
      <div className="col-start-1 row-start-1 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.motor_fl} parameters={parameters ?? new Map()} context={context} name="fl" />
        ) : (
          <Card className="w-[400px] m-4">
            <CardContent>
              <p>Loading...</p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="col-start-3 row-start-1 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.motor_fr} parameters={parameters ?? new Map()} context={context} name="fr" />
        ) : (
          <Card className="w-[400px] m-4">
            <CardContent>
              <p>Loading...</p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="col-start-1 row-start-2 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.motor_rl} parameters={parameters ?? new Map()} context={context} name="rl" />
        ) : (
          <Card className="w-[400px] m-4">
            <CardContent>
              <p>Loading...</p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.motor_rr} parameters={parameters ?? new Map()} context={context} name="rr" />
        ) : (
          <Card className="w-[400px] m-4">
            <CardContent>
              <p>Loading...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
