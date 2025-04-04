import { ExtensionContext } from "@foxglove/extension";
import { initDrivetrainPanel } from "./panels/DrivetrainPanel";
import "./static/output.css"

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "Drivetrain", initPanel: initDrivetrainPanel });
}
