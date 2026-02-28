import { type ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { createMockData, randomizeMockData } from "@dev/mock-vehicle";
import { App, type AppData } from "@/app";
import { usePanelSettings } from "@/components/extension-settings";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsSheet } from "@dev/components/settings-sheet";
import { PanelExtensionContext } from "@foxglove/extension";

export function Harness({ context }: { context: PanelExtensionContext }): ReactElement {
  const [autoRefresh] = useState<boolean>(false);
  const settings = usePanelSettings(context);
  const [data, setData] = useState(() => createMockData());
  const [activeTab, setActiveTab] = useState<string>(settings.tabs.defaultTab);

  const randomize = useCallback(() => {
    setData((prev) => randomizeMockData(prev));
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const intervalId = window.setInterval(() => {
      randomize();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoRefresh, randomize]);

  useEffect(() => {
    setActiveTab(settings.tabs.defaultTab);
  }, [settings.tabs.defaultTab]);

  const tabState = useMemo<AppData>(() => data, [data]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="nina-harness-theme">
      <div className="relative mx-auto flex h-full w-full bg-background">
        <App
          data={tabState}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          defaultTab={settings.tabs.defaultTab}
          showMenuBar={!settings.tabs.hideMenuBar}
          showParkSensorDisplay={!settings.parkSensors.hideDisplay}
          showParkSensorControls={!settings.parkSensors.hideControls}
        />

        <SettingsSheet context={context} />
      </div>
    </ThemeProvider>
  );
}
