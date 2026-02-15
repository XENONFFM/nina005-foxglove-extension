import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import { createMockData, randomizeMockData } from "./mock-vehicle";
import { MainTabs, type MainTabsData } from "../components/main-tabs";
import { ThemeProvider } from "../components/theme-provider";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

import "../styles/globals.css";
import "../styles/output.css";

function HarnessApp(): JSX.Element {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [data, setData] = useState(() => createMockData());

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

  const tabState = useMemo<MainTabsData>(() => data, [data]);

  return (
    <ThemeProvider defaultTheme="system">
      <div className="h-full w-full bg-background relative">
        <MainTabs data={tabState} defaultTab="drivetrain" />
        <div className="absolute top-3 right-3 z-10 rounded-md border bg-background/90 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label>Auto Refresh</Label>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <Button variant="secondary" onClick={randomize}>
              Randomize Data
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<HarnessApp />);
