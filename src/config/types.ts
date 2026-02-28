export type PanelTab =
  | "cluster"
  | "dashboard"
  | "drivetrain"
  | "signals"
  | "status"
  | "remote"
  | "parking";

export type PanelSettings = {
  tabs: {
    defaultTab: PanelTab;
    hideMenuBar: boolean;
  };
  parkSensors: {
    hideDisplay: boolean;
    hideControls: boolean;
  };
};

export type PanelTabOption = {
  value: PanelTab;
  label: string;
};
