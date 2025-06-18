import { Immutable, MessageEvent, PanelExtensionContext, ParameterValue, SettingsTreeAction, Topic } from "@foxglove/extension";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { MotorStatus } from "./MotorStatus";
import { RaceCar } from "./RaceCar";

import { Car } from "@/schemas/car";
import { produce } from "immer";
import { set } from "lodash";

import { ThemeProvider, useTheme, Theme } from "../components/theme-provider"

type CarMessage = MessageEvent<Car>;

const ThemeOptions = [
  "light",
  "dark",
  "system",
].map((key) => ({ value: key, label: key }));

// This is the type of state we will use to render the panel and also
// persist to the layout.
type State = {
  appearance: {
    theme: Theme;
  };
};

function ExamplePanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [message, setMessage] = useState<CarMessage>();
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [parameters, setParameters] = useState<Map<string, ParameterValue>>();
  const { setTheme } = useTheme();
  const [foxgloveTheme, setFoxgloveTheme] = useState<Theme>("dark");
  // const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  // Build our panel state from the context's initialState, filling in any possibly missing values.
  const [state, setState] = useState<State>(() => {
    const partialState = context.initialState as Partial<State>;
    return {
      appearance: {
        theme: partialState.appearance?.theme ?? "system",
      },
    };
  });

  // Respond to actions from the settings editor to update our state.
  const actionHandler = useCallback(
    (action: SettingsTreeAction) => {
      if (action.action === "update") {
        const { path, value } = action.payload;
        // We use a combination of immer and lodash to produce a new state object so react will
        // re-render our panel. Because our data node contains a label & and visibility property
        // this will handle editing the label and toggling the node visibility without any special
        // handling.
        setState(produce((draft: any) => set(draft, path, value)));

        // If the topic was changed update our subscriptions.
        if (path[1] === "topic") {
          context.subscribe([{ topic: value as string }]);
        }
        console.log(path, value);
        if (path[1] === "theme") {
          if (value === "system") {
            // If the theme is set to system, we will use the color scheme from the render state.
            setTheme(foxgloveTheme);
          } else {
            setTheme(value as Theme);
          }
        } 
      }
    },
    [context, foxgloveTheme],
  );

  // Update the settings editor every time our state or the list of available topics changes.
  useEffect(() => {
    context.saveState(state);

    // const topicOptions = (topics ?? []).map((topic) => ({ value: topic.name, label: topic.name }));

    // We set up our settings tree to mirror the shape of our panel state so we
    // can use the paths to values from the settings tree to directly update our state.
    context.updatePanelSettingsEditor({
      actionHandler,
      nodes: {
        appearance: {
          label: "Appearance",
          icon: "Shapes",
          fields: {
            theme: {
              label: "Theme",
              input: "select",
              value: state.appearance.theme,
              options: ThemeOptions,
            },
          },
        },
      },
    });
  }, [context, actionHandler, state, topics]);

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      if (renderState.currentFrame && renderState.currentFrame.length > 0) {
        setMessage(renderState.currentFrame[renderState.currentFrame.length - 1] as CarMessage);
      }
      if (renderState.currentFrame) {
        // setMessages(renderState.currentFrame);
      }
      setTopics(renderState.topics);
      setFoxgloveTheme(renderState.colorScheme as Theme);
      setParameters(new Map(renderState.parameters as Iterable<[string, ParameterValue]>));
      if (renderState.colorScheme && state.appearance.theme === "system") {
        setTheme(renderState.colorScheme);
        console.log("Setting theme to", renderState.colorScheme);
      }
    };

    context.watch("topics");
    context.watch("parameters");
    context.watch("currentFrame");
    context.watch("colorScheme");

    context.subscribe([{ topic: "/car" }]);
  }, [context]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
    <div className="grid grid-cols-3 gap-2 h-full w-full">
      <div className="col-start-2 row-start-1 row-span-2 flex justify-center items-center">
        <RaceCar></RaceCar>
      </div>
      <div className="col-start-1 row-start-1 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.message.motor_fl} parameters={parameters ?? new Map()} context={context} name="fl" />
        ) : (
          <div className="text-white">Loading...</div>
        )}
      </div>
      <div className="col-start-3 row-start-1 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.message.motor_fr} parameters={parameters ?? new Map()} context={context} name="fr" />
        ) : (
          <div className="text">Loading...</div>
        )}
      </div>
      <div className="col-start-1 row-start-2 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.message.motor_rl} parameters={parameters ?? new Map()} context={context} name="rl" />
        ) : (
          <div className="text-white">Loading...</div>
        )}
      </div>
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        {message ? (
          <MotorStatus motor={message.message.motor_rr} parameters={parameters ?? new Map()} context={context} name="rr" />
        ) : (
          <div className="text-white">Loading...</div>
        )}
      </div>
    </div>
  );
}

export function initDrivetrainPanel(context: PanelExtensionContext): () => void {
  const root = createRoot(context.panelElement);

  root.render(
    <ThemeProvider>
      <ExamplePanel context={context} />
    </ThemeProvider>
  );

  // Return a function to run when the panel is removed
  return () => {
    root.unmount();
  };
}
