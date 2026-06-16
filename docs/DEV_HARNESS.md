# Development Harness

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/XENONFFM/nina005-foxglove-extension)

The **Development Harness** is a standalone browser-based testing environment for the Foxglove extension. It renders the extensions panels with a **mocked Foxglove context**, allowing you to iterate on the UI and features without launching Foxglove Studio.

| ![](images/3.webp) | ![](images/4.webp) |
| :----------------: | :----------------: |

## Quick Start

```bash
pnpm install
pnpm run dev       # starts Vite at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You'll see the panel with a development menu at the top.

## Development in Dev Container

Use a VS Code Dev Container for a reproducible setup:

1. Open the repository in VS Code.
2. Run **Dev Containers: Reopen in Container**.
3. In the container terminal, install dependencies and start the harness:

```bash
pnpm install
pnpm run dev
```

The dev container includes the core development tooling (Node.js, pnpm, TypeScript, ESLint, and Git), so you can run lint/build/test commands the same way as on a local machine.

## Features

### Mocked Context

The harness provides a complete mock of the Foxglove `PanelExtensionContext`:

- **Settings Editor**: Full settings tree support with live UI update
- **Local Storage**: Panel state is persisted in browser localStorage (key: `nina005-foxglove-extension:harness:panel-state`)
- **No Network**: All rendering is local; no WebSocket or ROS connection required

### Development Menu

When you hover over the top gray bar, a settings sheet appears with:

- **Settings**: View and edit all panel configuration options in real-time
- **Theme Selection**: Dark/Light/System theme toggle
- **Reset State**: Clear localStorage to start fresh

## Configuration

### Initial State

Edit [dev/mockPanelContext.ts](../dev/mockPanelContext.ts) to adjust the default panel state:

```typescript
const defaultInitialState = {
  // ... other options
};
```

**Note:** Any changes to `defaultInitialState` will be merged with persisted localStorage state. Clear your browser's storage or use the reset button in the dev menu to test new defaults.

### Mock Network Messages

The harness doesn't simulate actual Foxglove topics or ROS messages. If you need to test message subscription or publishing behavior, you can:

1. Modify `mockPanelContext.ts` to implement mock `subscribe()` and `advertise()` callbacks
2. Trigger mock messages from the browser console (e.g., `window.mockMessage = { x: [...], y: [...] }`)
3. Integrate a local WebSocket server for more realistic testing

## File Structure

```
dev/
├── main.tsx                 # Entry point; creates mock context and mounts harness
├── harness.tsx              # Main harness component with panel switcher
├── mockPanelContext.ts      # Mock Foxglove context factory and initial state
└── components/
    └── settings-sheet.tsx   # Dev menu with settings and theme toggle
```

## Workflow

### Iterating on UI

1. **Start the dev server**: `pnpm run dev`
2. **Open browser**: http://localhost:5173
3. **Edit components** in `src/`
4. **Vite hot-reloads**: Changes appear instantly in the browser
5. **Adjust settings** via the dev menu to test different configurations

### Simulating Input

Since the harness doesn't connect to a real Foxglove WebSocket:

- TODO

## Debugging Tips

### Clearing State

- **In Dev Menu**: Click the reset button to clear localStorage
- **Manually**: Open browser DevTools → Application → Local Storage → Remove `nina005-foxglove-extension:harness:panel-state`
- **Programmatically**: Run in console:
  ```javascript
  localStorage.removeItem("nina005-foxglove-extension:harness:panel-state");
  location.reload();
  ```

## Related Commands

```bash
pnpm run dev            # Start dev harness at http://localhost:5173
pnpm run build          # Build extension for Foxglove
pnpm run package        # Package as .foxe file
pnpm run lint           # Run ESLint
pnpm run format:write   # Format code with Prettier
pnpm run test           # Run Jest tests
```

## Next Steps

- After testing in the harness, build and test in Foxglove Studio: `pnpm run local-install`
- For production deployment, package as a `.foxe` file: `pnpm run package`
