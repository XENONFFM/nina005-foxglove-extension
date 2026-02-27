import { ExtensionContext } from "@foxglove/extension";

import { initPanel } from "@/panel";
import "@/styles/globals.css";
import "@/styles/output.css";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "ASLZ Nina", initPanel });
}
