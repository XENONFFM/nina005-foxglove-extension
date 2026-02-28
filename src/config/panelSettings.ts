import { SettingsTreeAction, SettingsTreeNodes } from "@foxglove/extension";
import { produce } from "immer";
import { set } from "lodash";

import { PanelSettings, PanelTabOption } from "./types";

export const TAB_OPTIONS: PanelTabOption[] = [
  { value: "cluster", label: "Cluster" },
  { value: "dashboard", label: "Dashboard" },
  { value: "drivetrain", label: "Drivetrain" },
  { value: "signals", label: "Signals" },
  { value: "status", label: "Status" },
  { value: "remote", label: "Remote" },
  { value: "parking", label: "Park sensors" },
];

export function settingsActionReducer(
  prevSettings: PanelSettings,
  action: SettingsTreeAction,
): PanelSettings {
  return produce(prevSettings, (draft) => {
    if (action.action !== "update") {
      return;
    }

    const { path, value } = action.payload;
    set(draft, path.join("."), value);
  });
}

export function buildSettingsTree(settings: PanelSettings): SettingsTreeNodes {
  return {
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
  };
}
