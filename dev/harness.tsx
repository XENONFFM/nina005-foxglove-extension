import { type ReactElement, useEffect, useRef, useState } from "react";

import { App } from "@/app";
import { usePanelSettings } from "@/components/extension-settings";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemePalettePage } from "@dev/components/theme-palette";
import { SettingsSheet } from "@dev/components/settings-sheet";
import { createMockData, randomizeMockData } from "@dev/mock-vehicle";
import { PanelExtensionContext } from "@foxglove/extension";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Harness({ context }: { context: PanelExtensionContext }): ReactElement {
  const settings = usePanelSettings(context);
  const [mockData, setMockData] = useState(() => createMockData());
  const [view, setView] = useState<"panel" | "palette">(() =>
    window.location.pathname === "/theme" ? "palette" : "panel",
  );
  const overlayMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!settings.testing.autoRefreshValues) {
      return;
    }

    const interval = window.setInterval(() => {
      setMockData((previous) => randomizeMockData(previous));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [settings.testing.autoRefreshValues]);

  const handleOverlayMenuMouseLeave = (): void => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && overlayMenuRef.current?.contains(activeElement)) {
      // Clearing focus ensures group-focus-within drops when the pointer leaves.
      activeElement.blur();
    }
  };

  const setHarnessView = (nextView: "panel" | "palette"): void => {
    setView(nextView);
    window.history.replaceState({}, "", nextView === "palette" ? "/theme" : "/");
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="nina-harness-theme">
      <TooltipProvider delay={1000}>
        <div
          className="relative mx-auto flex h-full w-full bg-secondary dark:bg-black
"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 pt-1.5">
              <div
                ref={overlayMenuRef}
                onMouseLeave={handleOverlayMenuMouseLeave}
                className="group pointer-events-auto relative inline-flex h-1 w-16 items-start justify-center overflow-visible"
              >
                <div className="h-1 w-16 rounded-full bg-foreground/55 shadow-[0_0_0_1px_color-mix(in_oklab,var(--background)_70%,transparent)] transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0" />
                <SettingsSheet
                  context={context}
                  mode={view === "palette" ? "lite" : "full"}
                  onModeToggle={() => {
                    setHarnessView(view === "palette" ? "panel" : "palette");
                  }}
                  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-focus-within:pointer-events-auto group-hover:opacity-100 group-focus-within:opacity-100"
                />
              </div>
            </div>
          </div>

          {view === "panel" ? (
            <App
              data={mockData}
              defaultTab={settings.tabs.defaultTab}
              showMenuBar={!settings.tabs.hideMenuBar}
              showParkSensorDisplay={!settings.parkSensors.hideDisplay}
              showParkSensorControls={!settings.parkSensors.hideControls}
            />
          ) : (
            <ThemePalettePage />
          )}
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
