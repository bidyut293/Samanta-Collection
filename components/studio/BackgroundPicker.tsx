"use client";

import { cn } from "@/lib/utils";
import { tryonBackgrounds } from "@/lib/mock-data";

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-soft/50">Background</p>
      <div className="flex gap-3">
        {tryonBackgrounds.map((bg) => (
          <button
            key={bg.id}
            data-cursor="hover"
            onClick={() => onChange(bg.id)}
            title={bg.name}
            className={cn(
              "h-12 w-12 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-paper transition",
              value === bg.id ? "ring-ink" : "ring-transparent",
            )}
            style={{
              background: `linear-gradient(135deg, ${bg.tone[0]}, ${bg.tone[1]})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
