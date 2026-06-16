import { EditIcon, PlusIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { type ReactElement, type Ref, useEffect, useMemo, useRef, useState } from "react";
import ReactGridLayout, {
  type Layout,
  type LayoutItem,
  verticalCompactor,
  useContainerWidth,
} from "react-grid-layout";
import { aspectRatio as coreAspectRatio } from "react-grid-layout/core";

import type { AppData } from "@/app";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_WIDGETS,
  WIDGET_DEFINITIONS,
  type WidgetKey,
} from "@/views/modular/widget-definitions";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

type WidgetInstance = {
  id: number;
  key: WidgetKey;
  cols: number;
  rows: number;
};
type BreakpointKey = "lg" | "md" | "sm" | "xs";
type LayoutsByCols = Record<number, Layout>;
const GRID_MIN_CELL_SIZE = 64;
const GRID_GAP = 8;
const GRID_MAX_ROWS = 12;
const DEFAULT_LAYOUT_BASE_COLS = 12;
const ROW_SCALE_EXPONENT = 0.5;
const CORNER_RESIZE_HANDLES = ["nw", "ne", "sw", "se"] as const;
const EDIT_PREVIEW_SCALE = 0.8;
const BREAKPOINTS: Record<BreakpointKey, number> = {
  lg: 1440,
  md: 1024,
  sm: 600,
  xs: 0,
};
const GRID_COLS_BY_BREAKPOINT: Record<BreakpointKey, number> = {
  lg: 12,
  md: 12,
  sm: 12,
  xs: 1,
};
const BREAKPOINT_ORDER: BreakpointKey[] = ["lg", "md", "sm", "xs"];
type GridConstraint = NonNullable<LayoutItem["constraints"]>[number];
type DefaultLayoutTemplate = Partial<Record<WidgetKey, Pick<LayoutItem, "x" | "y" | "w" | "h">>>;

const DEFAULT_LAYOUT_TEMPLATE: DefaultLayoutTemplate = {
  overview: { x: 0, y: 0, w: 4, h: 6 },
  vehicle: { x: 4, y: 0, w: 4, h: 12 },
  status: { x: 9, y: 0, w: 4, h: 6 },
  "drive-inputs": { x: 9, y: 7, w: 4, h: 6 },
  proximity: { x: 0, y: 7, w: 4, h: 6 },
};

type CornerHandleAxis = (typeof CORNER_RESIZE_HANDLES)[number];

function isCornerHandle(axis: string): axis is CornerHandleAxis {
  return CORNER_RESIZE_HANDLES.includes(axis as CornerHandleAxis);
}

function getGridColumns(width: number): number {
  const matched = BREAKPOINT_ORDER.find((key) => width >= BREAKPOINTS[key]);
  return GRID_COLS_BY_BREAKPOINT[matched ?? "xs"];
}

function makeWidget(id: number, key: WidgetKey): WidgetInstance {
  const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === key);

  return {
    id,
    key,
    cols: definition?.defaultCols ?? 2,
    rows: definition?.defaultRows ?? 2,
  };
}

function getWidgetConstraints(key: WidgetKey) {
  const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === key);
  const aspect = definition?.constraints?.aspectRatio;

  if (aspect == undefined) {
    return undefined;
  }

  return [(coreAspectRatio as (ratio: number) => GridConstraint)(aspect)];
}

function buildDefaultWidgets(): WidgetInstance[] {
  return DEFAULT_WIDGETS.map((key, index) => makeWidget(index + 1, key));
}

function scaleRows(value: number, sourceCols: number, targetCols: number): number {
  if (targetCols === 1) {
    return value;
  }

  const ratio = targetCols / sourceCols;
  return Math.max(1, Math.round(value * Math.pow(ratio, ROW_SCALE_EXPONENT)));
}

function buildInitialLayout(widgets: WidgetInstance[], cols: number): Layout {
  let cursorX = 0;
  let cursorY = 0;
  let currentRowMaxHeight = 0;

  return widgets.map((widget) => {
    const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === widget.key);
    const template = DEFAULT_LAYOUT_TEMPLATE[widget.key];
    const minW = Math.max(1, definition?.minCols ?? 1);
    const maxW = Math.max(minW, Math.min(definition?.maxCols ?? cols, cols));
    const minH = definition?.minRows ?? 1;
    const maxH = Math.min(definition?.maxRows ?? GRID_MAX_ROWS, GRID_MAX_ROWS);
    const baseW = template
      ? Math.max(1, Math.round((template.w * cols) / DEFAULT_LAYOUT_BASE_COLS))
      : (definition?.defaultCols ?? widget.cols);
    const baseRows = template ? template.h : (definition?.defaultRows ?? widget.rows);
    const baseH = scaleRows(baseRows, DEFAULT_LAYOUT_BASE_COLS, cols);
    const clampedW = Math.max(minW, Math.min(baseW, maxW));
    const clampedH = Math.max(minH, Math.min(baseH, maxH));
    let x = cursorX;
    let y = cursorY;

    if (template) {
      const scaledX = Math.round((template.x * cols) / DEFAULT_LAYOUT_BASE_COLS);
      x = Math.max(0, Math.min(scaledX, Math.max(0, cols - clampedW)));
      y = template.y;
    } else {
      if (cursorX + clampedW > cols) {
        cursorX = 0;
        cursorY += currentRowMaxHeight;
        currentRowMaxHeight = 0;
      }

      x = cursorX;
      y = cursorY;
      cursorX += clampedW;
      currentRowMaxHeight = Math.max(currentRowMaxHeight, clampedH);
    }

    const clampedMinW = Math.max(1, Math.min(definition?.minCols ?? 1, cols));
    const clampedMaxW = Math.max(clampedMinW, Math.min(definition?.maxCols ?? cols, cols));
    const constraints = getWidgetConstraints(widget.key);

    const layoutItem: LayoutItem = {
      i: String(widget.id),
      x,
      y,
      w: clampedW,
      h: clampedH,
      minW: clampedMinW,
      minH: definition?.minRows,
      maxW: clampedMaxW,
      maxH: Math.min(definition?.maxRows ?? GRID_MAX_ROWS, GRID_MAX_ROWS),
      constraints,
    };

    return layoutItem;
  });
}

function getDefaultColumnSet(): number[] {
  return [...new Set(Object.values(GRID_COLS_BY_BREAKPOINT))].sort((a, b) => b - a);
}

function buildLayoutsByCols(widgets: WidgetInstance[]): LayoutsByCols {
  return getDefaultColumnSet().reduce<LayoutsByCols>((acc, cols) => {
    acc[cols] = buildInitialLayout(widgets, cols);
    return acc;
  }, {});
}

function itemsOverlap(a: LayoutItem, b: LayoutItem): boolean {
  if (a.i === b.i) {
    return false;
  }

  const aRight = a.x + a.w;
  const aBottom = a.y + a.h;
  const bRight = b.x + b.w;
  const bBottom = b.y + b.h;

  return a.x < bRight && aRight > b.x && a.y < bBottom && aBottom > b.y;
}

function resolveLayoutOverlaps(nextLayout: Layout, rows: number): Layout {
  const sorted = [...nextLayout].sort((a, b) => {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });

  const resolved: LayoutItem[] = [];

  sorted.forEach((item) => {
    const candidate = { ...item };

    while (resolved.some((entry) => itemsOverlap(candidate, entry))) {
      candidate.y += 1;
    }

    candidate.y = Math.max(0, Math.min(candidate.y, Math.max(0, rows - candidate.h)));
    resolved.push(candidate);
  });

  return resolved as Layout;
}

function normalizeLayout(
  nextLayout: Layout,
  widgets: WidgetInstance[],
  cols: number,
  rows: number = GRID_MAX_ROWS,
): Layout {
  const normalized = nextLayout.map((item) => {
    const { static: _static, ...restItem } = item;
    const widget = widgets.find((entry) => String(entry.id) === item.i);
    const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === widget?.key);
    const minW = Math.max(1, Math.min(definition?.minCols ?? 1, cols));
    const maxW = Math.max(minW, Math.min(definition?.maxCols ?? cols, cols));
    const w = Math.max(minW, Math.min(item.w, maxW));
    const x = Math.max(0, Math.min(item.x, Math.max(0, cols - w)));
    const minH = definition?.minRows ?? 1;
    const maxH = Math.min(definition?.maxRows ?? rows, rows);
    const h = Math.max(minH, Math.min(item.h, maxH));
    const y = Math.max(0, Math.min(item.y, Math.max(0, rows - h)));
    const constraints = widget ? getWidgetConstraints(widget.key) : undefined;

    return {
      ...restItem,
      x,
      y,
      w,
      h,
      minW,
      minH,
      maxW,
      maxH,
      constraints,
    };
  });

  return resolveLayoutOverlaps(normalized, rows);
}

function remapLayoutToCols(
  sourceLayout: Layout,
  widgets: WidgetInstance[],
  sourceCols: number,
  targetCols: number,
  rows: number,
): Layout {
  const scaled = sourceLayout.map((item) => {
    const scaledW = Math.max(1, Math.round((item.w * targetCols) / sourceCols));
    const scaledX = Math.round((item.x * targetCols) / sourceCols);

    return {
      ...item,
      x: Math.max(0, scaledX),
      y: Math.max(0, scaleRows(item.y, sourceCols, targetCols) - 1),
      w: scaledW,
      h: scaleRows(item.h, sourceCols, targetCols),
    };
  });

  return normalizeLayout(scaled, widgets, targetCols, rows);
}

function getNearestKnownCols(layoutsByCols: LayoutsByCols, targetCols: number): number | undefined {
  const knownCols = Object.keys(layoutsByCols).map(Number);

  if (knownCols.length === 0) {
    return undefined;
  }

  return knownCols.reduce<number | undefined>((closest, current) => {
    if (closest == undefined) {
      return current;
    }

    const currentDistance = Math.abs(current - targetCols);
    const closestDistance = Math.abs(closest - targetCols);

    if (currentDistance < closestDistance) {
      return current;
    }

    if (currentDistance === closestDistance) {
      return current > closest ? current : closest;
    }

    return closest;
  }, undefined);
}

function ensureLayoutForCols(
  layoutsByCols: LayoutsByCols,
  targetCols: number,
  widgets: WidgetInstance[],
  rows: number,
): LayoutsByCols {
  if (layoutsByCols[targetCols] != undefined) {
    return layoutsByCols;
  }

  const nearestCols = getNearestKnownCols(layoutsByCols, targetCols);

  if (nearestCols == undefined) {
    return {
      ...layoutsByCols,
      [targetCols]: buildInitialLayout(widgets, targetCols),
    };
  }

  const sourceLayout = layoutsByCols[nearestCols];
  if (sourceLayout == undefined) {
    return {
      ...layoutsByCols,
      [targetCols]: buildInitialLayout(widgets, targetCols),
    };
  }

  return {
    ...layoutsByCols,
    [targetCols]: remapLayoutToCols(sourceLayout, widgets, nearestCols, targetCols, rows),
  };
}

export function Modular({
  applicationStatus,
  batteryStatus,
  generalVehicleStatus,
  scaledSignals,
  steeringAndSpeed,
  temperatures,
  rawSignalBrake,
  rawSignalThrottle,
  rawSignalSteeringPosition,
  rawSignalSteeringForce,
  rawSignalSteeringVelocity,
  rawSignalSteeringVelocityCmd,
  rawSignalThrottlePotiCmd,
  rawSignalVehicleSpeed,
  usSensorFront,
  usSensorRear,
  remoteDriveRequest,
  remoteIndicatorRequest,
  remoteApplicationToggleRequest,
}: AppData): ReactElement {
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => buildDefaultWidgets());
  const [layoutsByCols, setLayoutsByCols] = useState<LayoutsByCols>(() =>
    buildLayoutsByCols(buildDefaultWidgets()),
  );
  const [, setIsDraggingWidget] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const nextWidgetId = useRef(DEFAULT_WIDGETS.length + 1);
  const [selectedWidgetKey, setSelectedWidgetKey] = useState<WidgetKey>(DEFAULT_WIDGETS[0]!);
  const { width, mounted, containerRef } = useContainerWidth({ initialWidth: 1200 });
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridContainerHeight, setGridContainerHeight] = useState(0);
  const gridColumns = useMemo(() => getGridColumns(width), [width]);
  const isXsLayout = gridColumns === GRID_COLS_BY_BREAKPOINT.xs;
  const gridRows = GRID_MAX_ROWS;
  const gridCellSize = useMemo(() => {
    if (gridContainerHeight <= 0) {
      return 132;
    }

    return Math.max(1, (gridContainerHeight - GRID_GAP * (gridRows - 1)) / gridRows);
  }, [gridContainerHeight, gridRows]);

  useEffect(() => {
    const container = gridContainerRef.current;

    if (!container) {
      return;
    }

    const updateHeight = (): void => {
      setGridContainerHeight(container.clientHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const snapCellIndexes = useMemo(
    () => Array.from({ length: gridColumns * gridRows }, (_, index) => index),
    [gridColumns, gridRows],
  );

  const addWidget = (widgetKey: WidgetKey = selectedWidgetKey): void => {
    const id = nextWidgetId.current++;
    const widget = makeWidget(id, widgetKey);
    const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === widgetKey);
    const nextWidgets = [...widgets, widget];

    setWidgets(nextWidgets);
    setLayoutsByCols((previous) => {
      const withCurrentCols = ensureLayoutForCols(previous, gridColumns, nextWidgets, gridRows);
      const updated = { ...withCurrentCols };

      Object.entries(withCurrentCols).forEach(([colsKey, currentLayout]) => {
        const cols = Number(colsKey);
        const rows = gridRows;

        updated[cols] = normalizeLayout(
          [
            ...currentLayout,
            {
              i: String(id),
              x: 0,
              y: Infinity,
              w: Math.max(1, Math.min(definition?.defaultCols ?? 1, cols)),
              h: scaleRows(definition?.defaultRows ?? 3, DEFAULT_LAYOUT_BASE_COLS, cols),
              minW: Math.max(1, Math.min(definition?.minCols ?? 1, cols)),
              minH: definition?.minRows,
              maxW: Math.max(1, Math.min(definition?.maxCols ?? cols, cols)),
              maxH: Math.min(definition?.maxRows ?? GRID_MAX_ROWS, GRID_MAX_ROWS),
              constraints: getWidgetConstraints(widgetKey),
            },
          ],
          nextWidgets,
          cols,
          rows,
        );
      });

      return updated;
    });
  };

  const removeWidget = (id: number): void => {
    const nextWidgets = widgets.filter((widget) => widget.id !== id);

    setWidgets(nextWidgets);
    setLayoutsByCols((previous) => {
      const withCurrentCols = ensureLayoutForCols(previous, gridColumns, nextWidgets, gridRows);
      const updated = { ...withCurrentCols };

      Object.entries(withCurrentCols).forEach(([colsKey, layout]) => {
        const cols = Number(colsKey);
        const rows = gridRows;

        updated[cols] = normalizeLayout(
          layout.filter((item) => item.i !== String(id)),
          nextWidgets,
          cols,
          rows,
        );
      });

      return updated;
    });
  };

  const resetLayout = (): void => {
    const defaults = buildDefaultWidgets();
    nextWidgetId.current = DEFAULT_WIDGETS.length + 1;
    setWidgets(defaults);
    setLayoutsByCols(buildLayoutsByCols(defaults));
    setSelectedWidgetKey(DEFAULT_WIDGETS[0]!);
  };

  const gridData = useMemo(
    () => ({
      applicationStatus,
      batteryStatus,
      generalVehicleStatus,
      scaledSignals,
      steeringAndSpeed,
      temperatures,
      rawSignalBrake,
      rawSignalThrottle,
      rawSignalSteeringPosition,
      rawSignalSteeringForce,
      rawSignalSteeringVelocity,
      rawSignalSteeringVelocityCmd,
      rawSignalThrottlePotiCmd,
      rawSignalVehicleSpeed,
      usSensorFront,
      usSensorRear,
      remoteDriveRequest,
      remoteIndicatorRequest,
      remoteApplicationToggleRequest,
    }),
    [
      applicationStatus,
      batteryStatus,
      generalVehicleStatus,
      scaledSignals,
      steeringAndSpeed,
      temperatures,
      rawSignalBrake,
      rawSignalThrottle,
      rawSignalSteeringPosition,
      rawSignalSteeringForce,
      rawSignalSteeringVelocity,
      rawSignalSteeringVelocityCmd,
      rawSignalThrottlePotiCmd,
      rawSignalVehicleSpeed,
      usSensorFront,
      usSensorRear,
      remoteDriveRequest,
      remoteIndicatorRequest,
      remoteApplicationToggleRequest,
    ],
  );

  const handleCommitLayout = (nextLayout: Layout): void => {
    if (!showHeaders) {
      return;
    }

    setLayoutsByCols((previous) => {
      const withCurrentCols = ensureLayoutForCols(previous, gridColumns, widgets, gridRows);

      return {
        ...withCurrentCols,
        [gridColumns]: normalizeLayout(nextLayout, widgets, gridColumns, gridRows),
      };
    });
  };

  const handleDragOrResizeStop = (...args: unknown[]): void => {
    const nextLayout = args[0];

    if (!Array.isArray(nextLayout)) {
      return;
    }

    handleCommitLayout(nextLayout as Layout);
  };

  const effectiveLayout = useMemo(() => {
    return layoutsByCols[gridColumns] ?? buildInitialLayout(widgets, gridColumns);
  }, [gridColumns, layoutsByCols, widgets]);

  const stackedWidgets = useMemo(() => {
    const layoutById = new Map(effectiveLayout.map((item) => [item.i, item]));

    return [...widgets].sort((left, right) => {
      const leftLayout = layoutById.get(String(left.id));
      const rightLayout = layoutById.get(String(right.id));

      if (!leftLayout || !rightLayout) {
        return left.id - right.id;
      }

      if (leftLayout.y !== rightLayout.y) {
        return leftLayout.y - rightLayout.y;
      }

      if (leftLayout.x !== rightLayout.x) {
        return leftLayout.x - rightLayout.x;
      }

      return left.id - right.id;
    });
  }, [effectiveLayout, widgets]);

  const latticeSize = useMemo(() => {
    return {
      x: Math.max(gridCellSize + GRID_GAP, GRID_MIN_CELL_SIZE),
      y: Math.max(gridCellSize + GRID_GAP, GRID_MIN_CELL_SIZE),
    };
  }, [gridCellSize]);

  const gridCompactor = useMemo(() => ({ ...verticalCompactor, preventCollision: false }), []);

  return (
    <div
      ref={containerRef as Ref<HTMLDivElement>}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden p-4"
    >
      <div className="fixed right-3 top-3 z-40 rounded-xl border bg-card px-1 py-1">
        <div className="flex flex-nowrap items-center justify-end gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none">
              <PlusIcon className="size-3.5 text-muted-foreground" />
              <span>Add Widget</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {WIDGET_DEFINITIONS.map((definition) => (
                <DropdownMenuItem
                  key={definition.key}
                  onClick={() => {
                    setSelectedWidgetKey(definition.key);
                    addWidget(definition.key);
                  }}
                >
                  {definition.icon}
                  <span>{definition.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={resetLayout} className="h-7 gap-1.5 px-2.5 text-xs">
            <RotateCcwIcon className="size-3.5" />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setShowHeaders(!showHeaders);
            }}
            className="h-7 gap-1.5 px-2.5 text-xs"
            title={showHeaders ? "Hide headers" : "Show headers"}
          >
            <EditIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {mounted && isXsLayout ? (
        <div className="modular-mobile-scroll relative flex-1 min-h-0 rounded-xl">
          <div className="flex flex-col gap-2">
            {stackedWidgets.map((widget) => {
              const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === widget.key);

              if (!definition) {
                return null;
              }

              return (
                <div key={String(widget.id)} className="relative min-w-0 rounded-xl">
                  <div
                    className={`relative flex min-h-0 flex-col overflow-visible ${
                      showHeaders
                        ? "rounded-xl border border-border/50 bg-background/55 p-2.5 shadow-sm"
                        : "border-transparent bg-transparent shadow-none"
                    }`}
                  >
                    {showHeaders && (
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {definition.icon}
                            <span className="truncate">{definition.label}</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            removeWidget(widget.id);
                          }}
                        >
                          <XIcon className="size-4" />
                          <span className="sr-only">Remove {definition.label}</span>
                        </Button>
                      </div>
                    )}

                    <div className="min-h-0 w-full overflow-visible [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_.text-4xl]:text-3xl [&_.text-2xl]:text-xl [&_.text-xl]:text-lg [&_.text-lg]:text-base [&_.text-base]:text-sm [&_.p-4]:p-3 [&_.px-4]:px-3 [&_.py-4]:py-3">
                      {definition.render(gridData)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : mounted ? (
        <div ref={gridContainerRef} className="relative flex-1 min-h-0 overflow-hidden rounded-xl">
          {showHeaders && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute rounded-xl"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgb(255 255 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.16) 1px, transparent 1px)",
                  backgroundSize: `${latticeSize.x}px ${latticeSize.y}px`,
                  backgroundPosition: "0 0, 0 0",
                  opacity: 0.5,
                }}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-5 grid overflow-hidden rounded-xl"
                style={{
                  gap: `${GRID_GAP}px`,
                  gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridRows}, ${gridCellSize}px)`,
                }}
              >
                {snapCellIndexes.map((index) => (
                  <span
                    key={index}
                    className="rounded-xl shadow-[inset_0_1px_4px_var(--color-border)] bg-muted dark:bg-background dark:shadow-[inset_0_1px_4px_rgb(255_255_255/0.08)]"
                  />
                ))}
              </div>
            </>
          )}

          <ReactGridLayout
            className="modular-grid relative z-10 h-full w-full"
            width={width}
            layout={effectiveLayout}
            compactor={gridCompactor}
            gridConfig={{
              cols: gridColumns,
              rowHeight: gridCellSize,
              margin: [GRID_GAP, GRID_GAP],
              containerPadding: [0, 0],
              maxRows: gridRows,
            }}
            onDragStart={() => {
              setIsDraggingWidget(true);
            }}
            onDragStop={(...args) => {
              setIsDraggingWidget(false);
              handleDragOrResizeStop(...args);
            }}
            onResizeStop={handleDragOrResizeStop}
            dragConfig={
              showHeaders
                ? {
                    enabled: true,
                    handle: ".widget-drag-handle",
                  }
                : {
                    enabled: false,
                  }
            }
            resizeConfig={
              showHeaders
                ? {
                    enabled: true,
                    handles: [...CORNER_RESIZE_HANDLES],
                    handleComponent: (axis, ref) => {
                      if (!isCornerHandle(axis)) {
                        return null;
                      }

                      const handleClassByAxis: Record<CornerHandleAxis, string> = {
                        nw: "left-0 top-0 cursor-nwse-resize rounded-tl-xl",
                        ne: "right-0 top-0 cursor-nesw-resize rounded-tr-xl",
                        sw: "bottom-0 left-0 cursor-nesw-resize rounded-bl-xl",
                        se: "bottom-0 right-0 cursor-nwse-resize rounded-br-xl",
                      };

                      return (
                        <span
                          ref={ref}
                          className={`react-resizable-handle modular-grid-handle absolute z-20 ${handleClassByAxis[axis]}`}
                        >
                          <span className="modular-grid-handle-dot" />
                        </span>
                      );
                    },
                  }
                : {
                    enabled: false,
                    handles: [],
                  }
            }
          >
            {widgets.map((widget) => {
              const definition = WIDGET_DEFINITIONS.find((entry) => entry.key === widget.key);
              if (!definition) {
                return null;
              }

              return (
                <div
                  key={String(widget.id)}
                  className="relative h-full min-h-0 min-w-0 rounded-xl transition-all"
                >
                  <div
                    className={`relative flex h-full min-h-0 flex-col overflow-hidden ${
                      showHeaders
                        ? "rounded-xl border border-border/50 bg-background/55 p-3 shadow-sm"
                        : "border-transparent bg-transparent shadow-none"
                    }`}
                  >
                    {showHeaders && (
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="widget-drag-handle flex cursor-grab items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground active:cursor-grabbing">
                            <span>⋮⋮</span>
                            {definition.icon}
                            <span className="truncate">{definition.label}</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            removeWidget(widget.id);
                          }}
                        >
                          <XIcon className="size-4" />
                          <span className="sr-only">Remove {definition.label}</span>
                        </Button>
                      </div>
                    )}

                    <div className="flex min-h-0 flex-1 items-stretch overflow-hidden">
                      <div
                        className={`min-h-0 w-full ${showHeaders ? "origin-center" : "h-full overflow-hidden"}`}
                        style={
                          showHeaders
                            ? {
                                width: `calc(100% / ${EDIT_PREVIEW_SCALE})`,
                                height: `calc(100% / ${EDIT_PREVIEW_SCALE})`,
                                transform: `scale(${EDIT_PREVIEW_SCALE})`,
                              }
                            : undefined
                        }
                      >
                        {definition.render(gridData)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ReactGridLayout>
        </div>
      ) : null}
    </div>
  );
}
