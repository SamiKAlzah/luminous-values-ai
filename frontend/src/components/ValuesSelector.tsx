"use client";

import React from "react";
import { VALUES_DATA } from "../data/localDatasets";
import { VALUE_ICONS } from "./icons";
import ValueCard from "./ValueCard";
import { Leaf } from "lucide-react";

interface ValuesSelectorProps {
  selectedValue: string;
  onSelectValue: (id: string) => void;
  language: string;
}

export default function ValuesSelector({
  selectedValue,
  onSelectValue,
  language,
}: ValuesSelectorProps) {
  const valuesList = Object.values(VALUES_DATA);

  return (
    <section className="w-full" aria-labelledby="values-heading">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="values-heading" className="text-h2 text-ink">
          اختر القيمة
        </h2>
        <span className="text-small text-ink-muted">{valuesList.length} قيم معتمدة</span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="values-heading"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {valuesList.map((val) => (
          <ValueCard
            key={val.id}
            groupName="value"
            value={val.id}
            name={val.value_name[language] || val.value_name["ar"]}
            icon={VALUE_ICONS[val.id] ?? Leaf}
            selected={selectedValue === val.id}
            onSelect={onSelectValue}
          />
        ))}
      </div>
    </section>
  );
}
