import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { CopyIcon } from "lucide-react";
import { type ReactElement } from "react";

type ThemeVars = React.CSSProperties & Record<`--${string}`, string>;

type ThemeToken = {
  name: string;
  value: string;
  foreground?: string;
};

const LIGHT_THEME_VARS: ThemeVars = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.205 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--destructive-foreground": "oklch(0.577 0.245 27.325)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--chart-1": "oklch(0.646 0.222 41.116)",
  "--chart-2": "oklch(0.6 0.118 184.704)",
  "--chart-3": "oklch(0.398 0.07 227.392)",
  "--chart-4": "oklch(0.828 0.189 84.429)",
  "--chart-5": "oklch(0.769 0.188 70.08)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.145 0 0)",
  "--sidebar-primary": "oklch(0.205 0 0)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.97 0 0)",
  "--sidebar-accent-foreground": "oklch(0.205 0 0)",
  "--sidebar-border": "oklch(0.922 0 0)",
  "--sidebar-ring": "oklch(0.708 0 0)",
  "--inactive": "oklch(0.985 0 0)",
};

const DARK_THEME_VARS: ThemeVars = {
  "--background": "oklch(0.145 0 0)",
  "--foreground": "oklch(0.985 0 0)",
  "--card": "oklch(0.145 0 0)",
  "--card-foreground": "oklch(0.985 0 0)",
  "--popover": "oklch(0.145 0 0)",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--primary": "oklch(0.985 0 0)",
  "--primary-foreground": "oklch(0.205 0 0)",
  "--secondary": "oklch(0.269 0 0)",
  "--secondary-foreground": "oklch(0.985 0 0)",
  "--muted": "oklch(0.269 0 0)",
  "--muted-foreground": "oklch(0.708 0 0)",
  "--accent": "oklch(0.269 0 0)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "oklch(0.396 0.141 25.723)",
  "--destructive-foreground": "oklch(0.637 0.237 25.331)",
  "--border": "oklch(0.269 0 0)",
  "--input": "oklch(0.269 0 0)",
  "--ring": "oklch(0.439 0 0)",
  "--chart-1": "oklch(0.488 0.243 264.376)",
  "--chart-2": "oklch(0.696 0.17 162.48)",
  "--chart-3": "oklch(0.769 0.188 70.08)",
  "--chart-4": "oklch(0.627 0.265 303.9)",
  "--chart-5": "oklch(0.645 0.246 16.439)",
  "--sidebar": "oklch(0.205 0 0)",
  "--sidebar-foreground": "oklch(0.985 0 0)",
  "--sidebar-primary": "oklch(0.488 0.243 264.376)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.269 0 0)",
  "--sidebar-accent-foreground": "oklch(0.985 0 0)",
  "--sidebar-border": "oklch(0.269 0 0)",
  "--sidebar-ring": "oklch(0.439 0 0)",
  "--inactive": "oklch(0.1822 0 0)",
};

const THEME_TOKENS: ThemeToken[] = [
  { name: "background", value: "var(--background)", foreground: "var(--foreground)" },
  { name: "foreground", value: "var(--foreground)", foreground: "var(--background)" },
  { name: "card", value: "var(--card)", foreground: "var(--card-foreground)" },
  { name: "card-foreground", value: "var(--card-foreground)", foreground: "var(--card)" },
  { name: "popover", value: "var(--popover)", foreground: "var(--popover-foreground)" },
  { name: "popover-foreground", value: "var(--popover-foreground)", foreground: "var(--popover)" },
  { name: "primary", value: "var(--primary)", foreground: "var(--primary-foreground)" },
  { name: "primary-foreground", value: "var(--primary-foreground)", foreground: "var(--primary)" },
  { name: "secondary", value: "var(--secondary)", foreground: "var(--secondary-foreground)" },
  {
    name: "secondary-foreground",
    value: "var(--secondary-foreground)",
    foreground: "var(--secondary)",
  },
  { name: "muted", value: "var(--muted)", foreground: "var(--muted-foreground)" },
  { name: "muted-foreground", value: "var(--muted-foreground)", foreground: "var(--muted)" },
  { name: "accent", value: "var(--accent)", foreground: "var(--accent-foreground)" },
  { name: "accent-foreground", value: "var(--accent-foreground)", foreground: "var(--accent)" },
  { name: "destructive", value: "var(--destructive)", foreground: "var(--destructive-foreground)" },
  {
    name: "destructive-foreground",
    value: "var(--destructive-foreground)",
    foreground: "var(--destructive)",
  },
  { name: "border", value: "var(--border)", foreground: "var(--foreground)" },
  { name: "input", value: "var(--input)", foreground: "var(--foreground)" },
  { name: "ring", value: "var(--ring)", foreground: "var(--background)" },
  { name: "chart-1", value: "var(--chart-1)", foreground: "var(--background)" },
  { name: "chart-2", value: "var(--chart-2)", foreground: "var(--background)" },
  { name: "chart-3", value: "var(--chart-3)", foreground: "var(--background)" },
  { name: "chart-4", value: "var(--chart-4)", foreground: "var(--background)" },
  { name: "chart-5", value: "var(--chart-5)", foreground: "var(--background)" },
  { name: "sidebar", value: "var(--sidebar)", foreground: "var(--sidebar-foreground)" },
  {
    name: "sidebar-foreground",
    value: "var(--sidebar-foreground)",
    foreground: "var(--sidebar)",
  },
  {
    name: "sidebar-primary",
    value: "var(--sidebar-primary)",
    foreground: "var(--sidebar-primary-foreground)",
  },
  {
    name: "sidebar-primary-foreground",
    value: "var(--sidebar-primary-foreground)",
    foreground: "var(--sidebar-primary)",
  },
  {
    name: "sidebar-accent",
    value: "var(--sidebar-accent)",
    foreground: "var(--sidebar-accent-foreground)",
  },
  {
    name: "sidebar-accent-foreground",
    value: "var(--sidebar-accent-foreground)",
    foreground: "var(--sidebar-accent)",
  },
  {
    name: "sidebar-border",
    value: "var(--sidebar-border)",
    foreground: "var(--sidebar-foreground)",
  },
  { name: "sidebar-ring", value: "var(--sidebar-ring)", foreground: "var(--sidebar-foreground)" },
  { name: "inactive", value: "var(--inactive)", foreground: "var(--foreground)" },
];

function ThemeTokenRow({ token }: { token: ThemeToken }): ReactElement {
  return (
    <Item variant="outline">
      <ItemMedia>
        <div className="h-10 w-10 rounded" style={{ backgroundColor: token.value }} aria-hidden />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{token.name}</ItemTitle>
        <ItemDescription>{token.value}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon">
          <CopyIcon />
        </Button>
      </ItemActions>
    </Item>
  );
}

function ThemeColumn({ label, vars }: { label: string; vars: ThemeVars }): ReactElement {
  return (
    <Card style={vars}>
      <CardHeader className="flex gap-3 border-b">
        <CardTitle>{label}</CardTitle>
      </CardHeader>

      <CardContent>
        <ItemGroup className="grid gap-4">
          {THEME_TOKENS.map((token) => (
            <ThemeTokenRow key={`${label}-${token.name}`} token={token} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export function ThemePalettePage(): ReactElement {
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-secondary p-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="grid min-h-0 gap-4 xl:grid-cols-2">
          <ThemeColumn label="Light" vars={LIGHT_THEME_VARS} />
          <ThemeColumn label="Dark" vars={DARK_THEME_VARS} />
        </div>
      </div>
    </div>
  );
}
