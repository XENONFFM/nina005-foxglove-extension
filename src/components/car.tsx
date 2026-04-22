import { ReactElement } from "react";

import nina005 from "@/assets/Nina005.png";

export function Car(): ReactElement {
  return (
    <div className="flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-hidden">
      <img
        src={nina005}
        alt="Nina005 car"
        className="block h-full w-full max-h-full max-w-full object-contain"
      />
    </div>
  );
}
