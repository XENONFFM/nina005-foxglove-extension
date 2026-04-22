import { type ReactElement, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { SettingsItem, SettingsSection } from "@/components/settings";
import { SettingsMenuLayout } from "@/components/settings-menu";
import { useTheme } from "@/components/theme-provider";
import { Menubar } from "@/components/ui/menubar";
import { LuSettings } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  PanelExtensionContext,
  SettingsTreeAction,
  SettingsTreeField,
  SettingsTreeFieldValue,
  SettingsTreeNode,
} from "@foxglove/extension";
import {
  ChevronRightIcon,
  ExternalLinkIcon,
  Info,
  MonitorSmartphone,
  Moon,
  Sun,
  XIcon,
} from "lucide-react";
import { MockPanelContext, MockSettingsEditor } from "@dev/mockPanelContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ABOUT_NAME = "Nina005 Extension";
const ABOUT_VERSION = "v1.0.0-beta.3";
const ABOUT_REPOSITORY_URL = "https://github.com/XENONFFM/nina005-foxglove-extension";

type DialogPage = {
  key: string;
  label: string;
  icon: ReactElement;
  content: ReactElement;
};

function isMockPanelContext(context: PanelExtensionContext): context is MockPanelContext {
  return (
    "getSettingsEditor" in context &&
    typeof (context as MockPanelContext).getSettingsEditor === "function" &&
    "subscribeSettingsEditor" in context &&
    typeof (context as MockPanelContext).subscribeSettingsEditor === "function"
  );
}

function createSettingsUpdateAction(
  path: string[],
  input: SettingsTreeFieldValue["input"],
  value: SettingsTreeFieldValue["value"],
): SettingsTreeAction {
  return {
    action: "update",
    payload: {
      path,
      input,
      value,
    },
  } as SettingsTreeAction;
}

function renderFieldEditor(
  field: SettingsTreeField,
  path: string[],
  actionHandler: ((action: SettingsTreeAction) => void) | undefined,
): ReactElement {
  const handleUpdate = (value: SettingsTreeFieldValue["value"]): void => {
    if (!actionHandler) {
      return;
    }
    actionHandler(createSettingsUpdateAction(path, field.input, value));
  };

  if (field.input === "boolean") {
    return (
      <Switch
        checked={Boolean(field.value)}
        onCheckedChange={(checked) => {
          handleUpdate(checked);
        }}
        disabled={field.disabled}
      />
    );
  }

  if (field.input === "select") {
    const isGamepadIdField =
      /controller id/i.test(field.label ?? "") ||
      path.some((segment) => /selectedControllerIndex|controller/i.test(segment));

    return (
      <Select
        value={String(field.value ?? "")}
        onValueChange={(value) => {
          handleUpdate(value ?? "");
        }}
        disabled={field.disabled}
      >
        <SelectTrigger className={isGamepadIdField ? "h-9 w-64" : "h-9 w-44"}>
          <SelectValue className={isGamepadIdField ? "truncate" : undefined} />
        </SelectTrigger>
        <SelectContent align="end" className={isGamepadIdField ? "min-w-72 max-w-md" : undefined}>
          <SelectGroup>
            {(field.options ?? []).map((option, index) => {
              if (option.value == undefined) {
                return null;
              }

              const optionLabel = String(option.label ?? "");
              const sanitizedOptionLabel = isGamepadIdField
                ? optionLabel.replace(/\s*\(.*/, "").trim()
                : optionLabel;

              return (
                <SelectItem key={`${option.value}-${index}`} value={String(option.value)}>
                  {isGamepadIdField ? (
                    <span className="block max-w-[24rem] truncate" title={sanitizedOptionLabel}>
                      {sanitizedOptionLabel}
                    </span>
                  ) : (
                    option.label
                  )}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  const isNumberInput = field.input === "number";
  return (
    <Input
      type={isNumberInput ? "number" : "text"}
      className="h-9 w-44"
      value={String(field.value ?? "")}
      onChange={(event) => {
        handleUpdate(event.currentTarget.value);
      }}
      disabled={field.disabled}
    />
  );
}

function renderSettingsNode(
  nodeKey: string,
  node: SettingsTreeNode | undefined,
  nodePath: string[],
  actionHandler: ((action: SettingsTreeAction) => void) | undefined,
  asCollapsible = true,
): ReactElement | null {
  if (!node) {
    return null;
  }

  const fieldEntries = Object.entries(node.fields ?? {}).filter(([, field]) => !!field);
  const childEntries = Object.entries(node.children ?? {}).filter(([, childNode]) => !!childNode);
  const hasContent = fieldEntries.length > 0 || childEntries.length > 0;
  const title = node.label ?? nodeKey;
  const depth = Math.max(nodePath.length - 1, 0);

  if (!hasContent) {
    return (
      <div key={`node-${nodePath.join(".") || nodeKey}`} className="px-2 py-1 text-sm font-medium">
        {title}
      </div>
    );
  }

  const content = (
    <div className="space-y-3">
      {fieldEntries.length > 0 && (
        <SettingsSection>
          {fieldEntries.map(([fieldKey, field]) => {
            const definedField = field as SettingsTreeField;
            const path = [...nodePath, fieldKey];
            return (
              <SettingsItem
                key={`field-${path.join(".")}`}
                label={definedField.label}
                description={definedField.help}
              >
                {renderFieldEditor(definedField, path, actionHandler)}
              </SettingsItem>
            );
          })}
        </SettingsSection>
      )}

      {childEntries.length > 0 && (
        <div className={cn("space-y-2", depth >= 1 && "pl-1")}>
          {childEntries.map(([childKey, childNode]) => (
            <div key={`child-${[...nodePath, childKey].join(".")}`}>
              {renderSettingsNode(
                childKey,
                childNode as unknown as SettingsTreeNode | undefined,
                [...nodePath, childKey],
                actionHandler,
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!asCollapsible) {
    return content;
  }

  if (depth === 1) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-full px-4 text-sm font-bold text-foreground/90 flex items-center">
          <span className="truncate">{title}</span>
        </div>
        <div>{content}</div>
      </div>
    );
  }

  return (
    <Collapsible key={`node-${nodePath.join(".") || nodeKey}`} defaultOpen={nodePath.length <= 3}>
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "group h-10 w-full justify-between rounded-xl px-3",
              depth === 0
                ? "bg-muted/30 text-sm font-semibold text-foreground/95 hover:bg-muted/45"
                : depth === 1
                  ? "text-[13px] font-medium text-foreground/90 hover:bg-muted/20"
                  : "text-[12px] font-medium text-muted-foreground hover:bg-muted/20 hover:text-foreground",
              depth >= 2 && "rounded-lg",
            )}
          >
            <span className="truncate">{title}</span>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-panel-open:rotate-90" />
          </Button>
        }
      />

      <CollapsibleContent
        className={cn("pt-2", depth >= 1 && "ml-1 pl-2", depth >= 2 && "ml-2 pl-3")}
      >
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SettingsSheet({
  context,
  className,
}: {
  context: PanelExtensionContext;
  className?: string;
  mode?: "full" | "lite";
  onModeToggle?: () => void;
}): ReactElement {
  const { theme, setTheme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [settingsEditor, setSettingsEditor] = useState<MockSettingsEditor | undefined>(undefined);
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | undefined>(undefined);

  const themeSequence = ["system", "light", "dark"] as const;
  const currentTheme = themeSequence.includes(theme as (typeof themeSequence)[number])
    ? (theme as (typeof themeSequence)[number])
    : "system";
  const currentThemeIndex = themeSequence.indexOf(currentTheme);
  const nextTheme = themeSequence[(currentThemeIndex + 1) % themeSequence.length]!;
  const ThemeIcon =
    currentTheme === "dark" ? Moon : currentTheme === "light" ? Sun : MonitorSmartphone;

  useEffect(() => {
    if (!isMockPanelContext(context)) {
      return;
    }
    return context.subscribeSettingsEditor(setSettingsEditor);
  }, [context]);

  const topLevelNodes = useMemo(() => {
    if (!settingsEditor?.nodes) {
      return [];
    }

    return Object.entries(settingsEditor.nodes)
      .filter(([, node]) => !!node)
      .map(([nodeKey, node]) => ({
        key: nodeKey,
        label: (node as unknown as SettingsTreeNode).label ?? nodeKey,
        node: node as unknown as SettingsTreeNode,
      }));
  }, [settingsEditor]);

  const dialogPages = useMemo<DialogPage[]>(
    () => [
      {
        key: "about",
        label: "About",
        icon: <Info className="size-4" />,
        content: (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-foreground/95">{ABOUT_NAME}</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground/90">
                    Built for the Nina005 autonomous driving research vehicle under the Autonomous
                    System Lab Zürich (ASLZ) initiative.
                  </p>
                </div>
                <Badge>{ABOUT_VERSION}</Badge>
              </div>
            </div>

            <SettingsSection title="Links">
              <div className="px-4 py-3.5">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between gap-4">
                    <span>Repository</span>
                    <Button size="sm" rel="noreferrer" variant="secondary">
                      <a
                        href={ABOUT_REPOSITORY_URL}
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        GitHub
                        <ExternalLinkIcon />
                      </a>
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-4">
                    <span>ASLZ</span>
                    <Button size="sm" rel="noreferrer" variant="secondary">
                      <a
                        href="https://github.com/Autonomous-System-ZHAW"
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        GitHub
                        <ExternalLinkIcon />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </div>
        ),
      },
    ],
    [],
  );

  const dialogPageByKey = useMemo(
    () => new Map(dialogPages.map((page) => [page.key, page] as const)),
    [dialogPages],
  );

  const menuSections = useMemo(
    () => [
      ...topLevelNodes.map((entry) => ({ key: entry.key, label: entry.label })),
      ...(topLevelNodes.length > 0 && dialogPages.length > 0
        ? [{ key: "dialog-pages-divider", label: "", type: "divider" as const }]
        : []),
      ...dialogPages.map((page) => ({ key: page.key, label: page.label, icon: page.icon })),
    ],
    [dialogPages, topLevelNodes],
  );

  const selectedTopLevelNode = useMemo(() => {
    if (!selectedSectionKey) {
      return undefined;
    }
    return topLevelNodes.find((entry) => entry.key === selectedSectionKey);
  }, [selectedSectionKey, topLevelNodes]);

  const selectedDialogPage = useMemo(
    () => (selectedSectionKey ? dialogPageByKey.get(selectedSectionKey) : undefined),
    [dialogPageByKey, selectedSectionKey],
  );

  useEffect(() => {
    if (menuSections.length === 0) {
      setSelectedSectionKey(undefined);
      return;
    }

    const isValidSelection = menuSections.some((section) => section.key === selectedSectionKey);
    if (!isValidSelection) {
      const firstSelectable = menuSections.find(
        (section) => !("type" in section && section.type === "divider"),
      );
      setSelectedSectionKey(firstSelectable?.key);
    }
  }, [menuSections, selectedSectionKey]);

  const hasAnySections = menuSections.some(
    (section) => !("type" in section && section.type === "divider"),
  );

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className={cn("z-20", className)}>
          <Menubar className="h-8 gap-0 rounded-lg border-border/70 bg-background/92 p-0.5 shadow-sm supports-backdrop-filter:bg-background/75 supports-backdrop-filter:backdrop-blur-xs">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTheme(nextTheme);
                    }}
                    className="h-7 rounded-sm px-2 text-[10px] font-semibold"
                  >
                    <ThemeIcon className="mr-1 size-3" />
                    {currentTheme === "system"
                      ? "System"
                      : currentTheme === "light"
                        ? "Light"
                        : "Dark"}
                  </Button>
                }
              />
              <TooltipContent>
                <p>
                  Theme: {currentTheme}. Click to switch to {nextTheme}.
                </p>
              </TooltipContent>
            </Tooltip>

            <div className="mx-0.5 h-4 w-px bg-border" />

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const firstSettingsKey = topLevelNodes[0]?.key;
                      setSelectedSectionKey(firstSettingsKey ?? dialogPages[0]?.key);
                      setIsDialogOpen(true);
                    }}
                    className="h-7 w-7 rounded-sm p-0 text-muted-foreground hover:text-foreground"
                  >
                    <LuSettings className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Open Panel Settings</p>
              </TooltipContent>
            </Tooltip>
          </Menubar>
        </div>

        <DialogContent
          showCloseButton={false}
          className="h-[min(52rem,calc(100dvh-3rem))] w-[min(48rem,92vw)] max-w-none sm:max-w-none overflow-hidden border bg-background/95 p-0 backdrop-blur-md rounded-3xl"
        >
          <div className="flex h-full min-h-0 flex-1 flex-col p-4">
            {hasAnySections ? (
              <SettingsMenuLayout
                title="Panel Settings"
                compactBreakpoint={680}
                action={
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <DialogClose
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="shrink-0 text-muted-foreground hover:bg-muted/70 hover:text-destructive"
                            />
                          }
                        >
                          <XIcon className="size-4 transition-colors group-hover/button:text-destructive" />
                          <span className="sr-only">Close</span>
                        </DialogClose>
                      }
                    />
                    <TooltipContent>
                      <p>Close Settings</p>
                    </TooltipContent>
                  </Tooltip>
                }
                className="rounded-none border-0 bg-transparent p-0"
                sections={menuSections}
                selectedSectionKey={selectedSectionKey}
                onSectionSelect={(key: any) => {
                  setSelectedSectionKey(key);
                }}
              >
                {selectedDialogPage
                  ? selectedDialogPage.content
                  : renderSettingsNode(
                      selectedTopLevelNode?.key ?? "",
                      selectedTopLevelNode?.node,
                      [selectedTopLevelNode?.key ?? ""],
                      settingsEditor?.actionHandler,
                      false,
                    )}
              </SettingsMenuLayout>
            ) : (
              <p className="px-2 text-sm text-muted-foreground">No settings available yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
