import { PanelExtensionContext } from "@foxglove/extension";
import { resolvePanelSettings } from "@/config";

const PANEL_STATE_STORAGE_KEY = "nina005:harness:panel-state";

function loadPersistedState(): Record<string, unknown> | undefined {
  if (typeof window === "undefined" || !window.localStorage) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(PANEL_STATE_STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function persistState(state: unknown): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(PANEL_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return undefined;
}

export type MockSettingsEditor = NonNullable<
  Parameters<PanelExtensionContext["updatePanelSettingsEditor"]>[0]
>;

export type MockPanelContext = PanelExtensionContext & {
  getSettingsEditor: () => MockSettingsEditor | undefined;
  subscribeSettingsEditor: (cb: (editor: MockSettingsEditor | undefined) => void) => () => void;
};

export function createMockPanelContext(
  overrides: Partial<PanelExtensionContext> = {},
): MockPanelContext {
  let onRender: PanelExtensionContext["onRender"] | undefined;
  let settingsEditor: MockSettingsEditor | undefined;
  const settingsEditorSubscribers = new Set<(editor: MockSettingsEditor | undefined) => void>();

  const notifySettingsEditorSubscribers = (): void => {
    settingsEditorSubscribers.forEach((subscriber) => {
      subscriber(settingsEditor);
    });
  };

  const persistedState = loadPersistedState();
  const resolvedInitialState = resolvePanelSettings(persistedState, asRecord(overrides.initialState));
  let currentInitialState: unknown = resolvedInitialState;

  const context: Partial<PanelExtensionContext> = {
    initialState: resolvedInitialState,
    updatePanelSettingsEditor: (editor) => {
      settingsEditor = editor;
      notifySettingsEditorSubscribers();
    },
    watch: () => {
      return;
    },
    subscribe: () => {
      return;
    },
    unsubscribeAll: () => {
      return;
    },
    advertise: () => {
      return;
    },
    unadvertise: () => {
      return;
    },
    publish: () => {
      return;
    },
    saveState: (state) => {
      persistState(state);
      currentInitialState = state;
    },
  };

  Object.defineProperty(context, "onRender", {
    get: () => onRender,
    set: (value: PanelExtensionContext["onRender"]) => {
      onRender = value;
    },
    enumerable: true,
  });

  Object.defineProperty(context, "initialState", {
    get: () => currentInitialState,
    set: (value) => {
      currentInitialState = value;
    },
    enumerable: true,
  });

  const mergedContext = {
    ...context,
    ...overrides,
  } as PanelExtensionContext;

  const mockContext: MockPanelContext = Object.assign(mergedContext, {
    getSettingsEditor: () => settingsEditor,
    subscribeSettingsEditor: (cb: (editor: MockSettingsEditor | undefined) => void) => {
      settingsEditorSubscribers.add(cb);
      cb(settingsEditor);
      return () => {
        settingsEditorSubscribers.delete(cb);
      };
    },
  });

  return mockContext;
}
