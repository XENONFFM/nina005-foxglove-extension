import nina005 from "../assets/Nina005.png";

export function RaceCar(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
      <img
        src={nina005}
        alt="Nina005 car"
        className="max-h-[calc(100vh-8rem)] w-full object-contain"
      />
    </div>
  );
}
