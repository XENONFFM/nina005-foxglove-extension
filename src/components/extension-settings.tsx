import { PanelExtensionContext, SettingsTree, SettingsTreeAction } from "@foxglove/extension";
import { produce } from "immer";
import { set } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

type PanelSettings = {
  tabs: {
    defaultTab: string;
    hideMenuBar: boolean;
  };
  parkSensors: {
    hideDisplay: boolean;
    hideControls: boolean;
  };
};

const TAB_OPTIONS = [
  { value: "cluster", label: "Cluster" },
  { value: "dashboard", label: "Dashboard" },
  { value: "drivetrain", label: "Drivetrain" },
  { value: "signals", label: "Signals" },
  { value: "status", label: "Status" },
  { value: "remote", label: "Remote" },
  { value: "parking", label: "Park sensors" },
];

function getInitialSettings(context: PanelExtensionContext): PanelSettings {
  const partialState = context.initialState as Partial<PanelSettings>;
  return {
    tabs: {
      defaultTab: partialState.tabs?.defaultTab ?? "drivetrain",
      hideMenuBar: partialState.tabs?.hideMenuBar ?? false,
    },
    parkSensors: {
      hideDisplay: partialState.parkSensors?.hideDisplay ?? false,
      hideControls: partialState.parkSensors?.hideControls ?? false,
    },
  };
}

export function usePanelSettings(context: PanelExtensionContext): PanelSettings {
  const [settings, setSettings] = useState<PanelSettings>(() => getInitialSettings(context));

  const actionHandler = useCallback((action: SettingsTreeAction) => {
    if (action.action === "update") {
      const { path, value } = action.payload;
      setSettings(produce((draft) => set(draft, path, value)));
    }
  }, []);

  const settingsTree = useMemo<SettingsTree>(
    () => ({
      actionHandler,
      nodes: {
        tabs: {
          label: "Tabs",
          icon: "Settings",
          fields: {
            defaultTab: {
              label: "Default Tab",
              input: "select",
              value: settings.tabs.defaultTab,
              options: TAB_OPTIONS,
            },
            hideMenuBar: {
              label: "Hide Menu Bar",
              input: "boolean",
              value: settings.tabs.hideMenuBar,
            },
          },
        },
        parkSensors: {
          label: "Park Sensors",
          icon: "Settings",
          fields: {
            hideDisplay: {
              label: "Hide Display",
              input: "boolean",
              value: settings.parkSensors.hideDisplay,
            },
            hideControls: {
              label: "Hide Controls",
              input: "boolean",
              value: settings.parkSensors.hideControls,
            },
          },
        },
      },
    }),
    [actionHandler, settings],
  );

  useEffect(() => {
    context.saveState(settings);
    context.updatePanelSettingsEditor(settingsTree);
  }, [context, settings, settingsTree]);

  return settings;
}
