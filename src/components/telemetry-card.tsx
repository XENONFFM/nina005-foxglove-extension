import { type ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getFieldMeta } from "@/schemas/field-metadata";

type Primitive = string | number | boolean | null | undefined;

export type TelemetryCardField = {
  key: string;
  label?: string;
  unit?: string;
  digits?: number;
};

type FieldEntry = {
  key: string;
  value: Primitive;
  label: string;
  unit?: string;
  digits: number;
};

type TelemetryCardProps<TMessage extends Record<string, unknown>> = {
  title: string;
  message?: TMessage;
  fields?: Array<string | TelemetryCardField>;
  excludeKeys?: Array<keyof TMessage | string>;
  columns?: 1 | 2;
  numberDigits?: number;
};

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatPrimitive(value: Primitive, numberDigits: number): string {
  if (value == undefined) {
    return "--";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(numberDigits);
  }
  if (typeof value === "boolean") {
    return value ? "ON" : "OFF";
  }
  return value;
}

function PrimitiveValue({
  value,
  numberDigits,
  unit,
}: {
  value: Primitive;
  numberDigits: number;
  unit?: string;
}): ReactElement {
  if (typeof value === "boolean") {
    return <Badge variant="secondary">{formatPrimitive(value, numberDigits)}</Badge>;
  }

  const formattedValue = formatPrimitive(value, numberDigits);

  return (
    <span className="font-medium">
      <span>{formattedValue}</span>
      {formattedValue !== "--" && unit ? (
        <span className="text-muted-foreground"> {unit}</span>
      ) : null}
    </span>
  );
}

export function TelemetryCard<TMessage extends Record<string, unknown>>({
  title,
  message,
  fields,
  excludeKeys = ["header"],
  columns = 1,
  numberDigits = 2,
}: TelemetryCardProps<TMessage>): ReactElement {
  const hiddenKeys = new Set(excludeKeys.map(String));

  const inferredEntries: FieldEntry[] = Object.entries(message ?? {})
    .filter((entry) => {
      const [key, value] = entry;
      if (hiddenKeys.has(key)) {
        return false;
      }
      return ["string", "number", "boolean"].includes(typeof value) || value == undefined;
    })
    .map(([key, value]) => {
      const meta = getFieldMeta(key);

      return {
        key,
        value: value as Primitive,
        label: meta?.label ?? formatLabel(key),
        unit: meta?.unit,
        digits: meta?.digits ?? numberDigits,
      };
    });

  const fieldEntries: FieldEntry[] =
    fields?.map((field) => {
      const normalizedField = typeof field === "string" ? { key: field } : field;
      const value = message?.[normalizedField.key as keyof TMessage] as Primitive;
      const meta = getFieldMeta(normalizedField.key);

      return {
        key: normalizedField.key,
        value,
        label: normalizedField.label ?? meta?.label ?? formatLabel(normalizedField.key),
        unit: normalizedField.unit ?? meta?.unit,
        digits: normalizedField.digits ?? meta?.digits ?? numberDigits,
      };
    }) ?? inferredEntries;

  return (
    <Card className="h-full min-h-0 overflow-hidden bg-card/80 backdrop-blur-sm ring-0 border">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 overflow-hidden text-sm">
        <div className={`grid gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
          {fieldEntries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between gap-2">
              <Label className="font-light">{entry.label}</Label>
              <PrimitiveValue value={entry.value} numberDigits={entry.digits} unit={entry.unit} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
