import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface ValueCardProps {
  /** Radio group name shared by all cards in the selector. */
  groupName: string;
  value: string;
  name: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (value: string) => void;
}

/**
 * A selectable value. A visually hidden radio input carries the semantics, so
 * Tab, arrow keys and Space work natively; the label is the visible card.
 */
export default function ValueCard({
  groupName,
  value,
  name,
  icon: Icon,
  selected,
  onSelect,
}: ValueCardProps) {
  return (
    <label
      className={`relative flex min-h-32 cursor-pointer flex-col justify-between rounded-lg border p-4 shadow-sm transition-shadow duration-150 hover:shadow-md has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${
        selected
          ? "border-brand bg-brand-tint"
          : "border-line bg-surface-card hover:border-brand"
      }`}
    >
      <input
        type="radio"
        name={groupName}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span className="flex items-start justify-between">
        <Icon className="h-6 w-6 text-brand" strokeWidth={1.5} aria-hidden="true" />
        {selected && (
          <span className="flex h-6 w-6 items-center justify-center rounded-pill bg-brand text-on-brand">
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </span>
      <span className="mt-3 text-body font-semibold leading-snug text-ink">{name}</span>
    </label>
  );
}
