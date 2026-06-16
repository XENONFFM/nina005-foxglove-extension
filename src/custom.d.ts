declare module "*.png" {
  const Path: string;
  export default Path;
}

declare module "*.svg" {
  const Path: string;
  export default Path;
}

declare module "*.css";

declare module "react-grid-layout/core" {
  export type LayoutConstraint = (
    item: unknown,
    valueA: number,
    valueB: number,
    context: unknown,
  ) => { x?: number; y?: number; w?: number; h?: number };

  export function aspectRatio(ratio: number): LayoutConstraint;
}
