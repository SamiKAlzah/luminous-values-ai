import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface SettingOptionProps {
  groupName: string;
  value: string;
  name: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (value: string) => void;
}

/**
 * One segment of the setting selector (home, school, work, digital space).
 * The selected segment takes the brand fill; the rest sit on surface-card.
 */
export default function SettingOption({
  groupName,
  value,
  name,
  description,
  icon: Icon,
  selected,
  onSelect,
}: SettingOptionProps) {
  return (
    <label
      className={`flex min-h-28 cursor-pointer flex-col justify-between gap-3 rounded-md p-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${
        selected
          ? "bg-brand text-on-brand"
          : "bg-surface-card text-ink hover:bg-brand-tint"
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
      <span className="flex items-center justify-between">
        <Icon
          className={`h-6 w-6 ${selected ? "text-on-brand" : "text-brand"}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        {selected && <Check className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
      </span>
      <span>
        <span className="block text-body font-semibold leading-snug">{name}</span>
        <span className={`mt-1 block text-small ${selected ? "text-on-brand" : "text-ink-muted"}`}>
          {description}
        </span>
      </span>
    </label>
  );
}
