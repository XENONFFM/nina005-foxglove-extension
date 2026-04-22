import { PanelExtensionContext } from "@foxglove/extension";

import { PanelSettings, PanelTab } from "./types";

const PANEL_TABS: readonly PanelTab[] = [
  "cluster",
  "dashboard",
  "modular",
  "drivetrain",
  "signals",
  "status",
  "remote",
  "parking",
];

export const DEFAULT_PANEL_SETTINGS: PanelSettings = {
  tabs: {
    defaultTab: "drivetrain",
    hideMenuBar: false,
  },
  testing: {
    autoRefreshValues: false,
  },
  parkSensors: {
    hideDisplay: false,
    hideControls: false,
  },
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value != undefined && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return undefined;
}

function asPanelTab(value: unknown): PanelTab | undefined {
  if (typeof value === "string" && PANEL_TABS.includes(value as PanelTab)) {
    return value as PanelTab;
  }
  return undefined;
}

export function resolvePanelSettings(...sources: Array<unknown>): PanelSettings {
  const resolved: PanelSettings = {
    tabs: {
      defaultTab: DEFAULT_PANEL_SETTINGS.tabs.defaultTab,
      hideMenuBar: DEFAULT_PANEL_SETTINGS.tabs.hideMenuBar,
    },
    testing: {
      autoRefreshValues: DEFAULT_PANEL_SETTINGS.testing.autoRefreshValues,
    },
    parkSensors: {
      hideDisplay: DEFAULT_PANEL_SETTINGS.parkSensors.hideDisplay,
      hideControls: DEFAULT_PANEL_SETTINGS.parkSensors.hideControls,
    },
  };

  for (const source of sources) {
    const root = asRecord(source);
    if (!root) {
      continue;
    }

    const tabs = asRecord(root.tabs);
    const testing = asRecord(root.testing);
    const parkSensors = asRecord(root.parkSensors);

    const defaultTab = asPanelTab(tabs?.defaultTab);
    if (defaultTab != undefined) {
      resolved.tabs.defaultTab = defaultTab;
    }

    if (typeof tabs?.hideMenuBar === "boolean") {
      resolved.tabs.hideMenuBar = tabs.hideMenuBar;
    }

    if (typeof testing?.autoRefreshValues === "boolean") {
      resolved.testing.autoRefreshValues = testing.autoRefreshValues;
    }

    if (typeof parkSensors?.hideDisplay === "boolean") {
      resolved.parkSensors.hideDisplay = parkSensors.hideDisplay;
    }

    if (typeof parkSensors?.hideControls === "boolean") {
      resolved.parkSensors.hideControls = parkSensors.hideControls;
    }
  }

  return resolved;
}

export function createDefaultPanelSettings(context?: PanelExtensionContext): PanelSettings {
  return resolvePanelSettings(context?.initialState);
}
