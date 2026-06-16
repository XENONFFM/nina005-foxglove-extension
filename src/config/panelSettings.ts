import { SettingsTreeAction, SettingsTreeNodes } from "@foxglove/extension";
import { produce } from "immer";
import { set } from "lodash";

import { createDefaultPanelSettings } from "./defaultConfig";
import { PanelSettings, PanelTabOption } from "./types";

export const TAB_OPTIONS: PanelTabOption[] = [
  { value: "cluster", label: "Cluster" },
  { value: "dashboard", label: "Dashboard" },
  { value: "modular", label: "Modular" },
  { value: "drivetrain", label: "Drivetrain" },
  { value: "signals", label: "Signals" },
  { value: "status", label: "Status" },
  { value: "remote", label: "Remote" },
  { value: "parking", label: "Park sensors" },
];

const ROOT_SETTING_KEYS = new Set(Object.keys(createDefaultPanelSettings()));

function resolveSettingsPath(path: readonly string[]): string {
  if (path.length === 0) {
    return "";
  }

  const dottedSegmentIndex = path.findIndex((segment) => segment.includes("."));
  if (dottedSegmentIndex >= 0) {
    const segments = path.slice(dottedSegmentIndex).join(".").split(".").filter(Boolean);

    // Handles paths like ["tabs", "tabs.defaultTab"] from nested settings UIs.
    if (
      segments.length >= 2 &&
      segments[0] === segments[1] &&
      ROOT_SETTING_KEYS.has(segments[0] ?? "")
    ) {
      segments.shift();
    }

    return segments.join(".");
  }

  const segments = [...path];
  while (segments.length > 1 && !ROOT_SETTING_KEYS.has(segments[0] ?? "")) {
    segments.shift();
  }

  return segments.join(".");
}

export function settingsActionReducer(
  prevSettings: PanelSettings,
  action: SettingsTreeAction,
): PanelSettings {
  return produce(prevSettings, (draft) => {
    if (action.action !== "update") {
      return;
    }

    const { path, value } = action.payload;
    set(draft, resolveSettingsPath(path), value);
  });
}

export function buildSettingsTree(settings: PanelSettings): SettingsTreeNodes {
  return {
    tabs: {
      label: "Tabs",
      icon: "",
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
    testing: {
      label: "Testing",
      icon: "Settings",
      fields: {
        autoRefreshValues: {
          label: "Auto Refresh Values",
          input: "boolean",
          value: settings.testing.autoRefreshValues,
          help: "Automatically randomize mock values every second.",
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
