import { Immutable, MessageEvent, PanelExtensionContext } from "@foxglove/extension";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import { MotorStatus } from "./MotorStatus"
import { RaceCar } from "./RaceCar"

function ExamplePanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [message, setMessage] = useState<undefined | Immutable<MessageEvent>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      if(renderState.currentFrame !== undefined){
        setMessage(renderState.currentFrame[0]);
      }
    };

    context.watch("currentFrame");

    context.subscribe([{ topic: "/car" }]);
  }, [context]);

  useEffect(() => { renderDone?.(); }, [renderDone]);

  return (
    <div className="dark bg-background grid grid-cols-3 gap-2 h-full w-full">
      <div className="col-start-2 row-start-1 row-span-2 flex justify-center items-center">
        <RaceCar></RaceCar>
      </div>

      <div className="col-start-1 row-start-1 flex justify-center items-center">
        <MotorStatus motor={(message?.message as any)?.motor_fl ?? null} name="Front Left" />
      </div>
      <div className="col-start-3 row-start-1 flex justify-center items-center">
        <MotorStatus motor={(message?.message as any)?.motor_fr ?? null} name="Front Right" />
      </div>
      <div className="col-start-1  row-start-2 flex justify-center items-center">
        <MotorStatus motor={(message?.message as any)?.motor_rl ?? null} name="Rear Left" />
      </div>
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        <MotorStatus motor={(message?.message as any)?.motor_rr ?? null} name="Rear Right" />
      </div>
    </div>
  );
}

export function initDrivetrainPanel(context: PanelExtensionContext): () => void {
  ReactDOM.render(<ExamplePanel context={context} />, context.panelElement);

  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
