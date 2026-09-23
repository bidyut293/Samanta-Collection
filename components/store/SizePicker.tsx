"use client";

import { cn } from "@/lib/utils";

export function SizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          data-cursor="hover"
          onClick={() => onChange(size)}
          className={cn(
            "min-w-11 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            value === size
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink hover:border-ink/50",
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

export function ColorPicker({
  colors,
  value,
  onChange,
}: {
  colors: { name: string; hex: string }[];
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <button
          key={c.name}
          data-cursor="hover"
          onClick={() => onChange(c.name)}
          title={c.name}
          className={cn(
            "h-9 w-9 rounded-full ring-1 ring-offset-2 ring-offset-paper transition",
            value === c.name ? "ring-ink" : "ring-line",
          )}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );
}
