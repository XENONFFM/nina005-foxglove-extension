import { PanelExtensionContext, SettingsTree, SettingsTreeAction } from "@foxglove/extension";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  buildSettingsTree,
  createDefaultPanelSettings,
  PanelSettings,
  settingsActionReducer,
} from "@/config";

export function usePanelSettings(context: PanelExtensionContext): PanelSettings {
  const [settings, setSettings] = useState<PanelSettings>(() => createDefaultPanelSettings(context));

  const actionHandler = useCallback((action: SettingsTreeAction) => {
    setSettings((prevSettings) => settingsActionReducer(prevSettings, action));
  }, []);

  const settingsTree = useMemo<SettingsTree>(
    () => ({
      actionHandler,
      nodes: buildSettingsTree(settings),
    }),
    [actionHandler, settings],
  );

  useEffect(() => {
    context.saveState(settings);
    context.updatePanelSettingsEditor(settingsTree);
  }, [context, settings, settingsTree]);

  return settings;
}
