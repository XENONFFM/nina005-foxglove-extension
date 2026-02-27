import { type ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { LuSettings } from "react-icons/lu";

import { createMockData, randomizeMockData } from "@dev/mock-vehicle";
import { App, type AppData } from "@/app";
import { SettingsItem, SettingsSection } from "@/components/settings/settings";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

type HarnessSettings = {
  tabs: {
    defaultTab: string;
    hideMenuBar: boolean;
  };
};

const TAB_OPTIONS = [
  { value: "drivetrain", label: "Drivetrain" },
  { value: "signals", label: "Signals" },
  { value: "status", label: "Status" },
  { value: "remote", label: "Remote" },
  { value: "parking", label: "Park sensors" },
];

export function Harness(): ReactElement {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<HarnessSettings>({
    tabs: {
      defaultTab: "drivetrain",
      hideMenuBar: false,
    },
  });
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
        />

        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <div className="absolute top-3 right-3 z-20">
            <SheetTrigger render={<Button variant="outline" className="whitespace-nowrap" />}>
              <LuSettings />
            </SheetTrigger>
          </div>

          <SheetContent
            side="right"
            className="inset-y-0 right-0 h-full w-80 bg-background/90 backdrop-blur sm:max-w-none"
          >
            <SheetHeader className="pb-2">
              <SheetTitle>Panel Settings</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 overflow-y-auto px-4 pb-4">
              <SettingsSection title="Harness">
                <SettingsItem label="Auto Refresh">
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={(checked) => {
                      setAutoRefresh(checked === true);
                    }}
                  />
                </SettingsItem>
                <SettingsItem label="Randomize Data">
                  <Button variant="secondary" onClick={randomize} size="sm">
                    Randomize
                  </Button>
                </SettingsItem>
              </SettingsSection>

              <SettingsSection title="Settings">
                <SettingsItem label="Default Tab">
                  <Select
                    value={settings.tabs.defaultTab}
                    onValueChange={(value: string | null) => {
                      if (value == undefined) {
                        return;
                      }
                      setSettings((prev) => ({
                        ...prev,
                        tabs: {
                          ...prev.tabs,
                          defaultTab: value,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full max-w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAB_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingsItem>
                <SettingsItem label="Hide Menu Bar">
                  <Switch
                    checked={settings.tabs.hideMenuBar}
                    onCheckedChange={(checked) => {
                      const nextHideMenuBar = checked === true;
                      setSettings((prev) => ({
                        ...prev,
                        tabs: {
                          ...prev.tabs,
                          hideMenuBar: nextHideMenuBar,
                        },
                      }));
                    }}
                  />
                </SettingsItem>
              </SettingsSection>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ThemeProvider>
  );
}
