import {PanelExtensionContext, ParameterValue} from "@foxglove/extension";
import { createRoot } from "react-dom/client";

import { ThemeProvider, useTheme} from "./components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

import { DriveTrain } from "./panels/Drivetrain";
import { Driverless } from "./panels/Driverless";
import { useEffect, useLayoutEffect, useState } from "react";

import { Car } from "@/schemas/car";

export type CarMessage = MessageEvent<Car>;

function MainPanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [message, setMessage] = useState<CarMessage>();
  // const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [parameters, setParameters] = useState<Map<string, ParameterValue>>();
  const { theme, setTheme } = useTheme();
  // const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      if (renderState.currentFrame && renderState.currentFrame.length > 0) {
        setMessage(renderState.currentFrame[renderState.currentFrame.length - 1]?.message as CarMessage);
      }
      if (renderState.currentFrame) {
        // setMessages(renderState.currentFrame);
      }
      // setTopics(renderState.topics);
      setParameters(new Map(renderState.parameters as Iterable<[string, ParameterValue]>));
      
      if (renderState.colorScheme && theme != renderState.colorScheme) {
        setTheme(renderState.colorScheme);
      }
    };

    context.watch("topics");
    context.watch("parameters");
    context.watch("currentFrame");
    context.watch("colorScheme");

    context.subscribe([{ topic: "/car" }]);
  }, [context, theme, setTheme, setParameters]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);
  
  return (
      <Tabs defaultValue="drivetrain" >
        <TabsList className="w-[400px] m-4 mx-auto">
          <TabsTrigger value="drivetrain" >Drivetrain</TabsTrigger>
          <TabsTrigger value="driverless" >Driverless</TabsTrigger>
        </TabsList>
        <TabsContent value="drivetrain">
          <DriveTrain context={context} message={message as unknown as Car} parameters={parameters as Map<string, ParameterValue>} />
        </TabsContent>
        <TabsContent value="driverless">
          <Driverless context={context} message={message as unknown as Car} parameters={parameters as Map<string, ParameterValue>}/>
        </TabsContent>
      </Tabs>
  );
}

export function initMainPanel(context: PanelExtensionContext): () => void {
  const root = createRoot(context.panelElement);

  root.render(
    <ThemeProvider defaultTheme="dark">
      <div className="h-full w-full bg-background">
        <MainPanel context={context} />
      </div>
    </ThemeProvider>
  );

  // Return a function to run when the panel is removed
  return () => {
    root.unmount();
  };
}