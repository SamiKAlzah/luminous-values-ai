"use client";

import React from "react";
import { ENVIRONMENTS } from "../data/localDatasets";
import { ENVIRONMENT_ICONS } from "./icons";
import SettingOption from "./SettingOption";
import { Globe } from "lucide-react";

interface EnvironmentSelectorProps {
  selectedEnvironment: string;
  onSelectEnvironment: (id: string) => void;
  language: string;
}

export default function EnvironmentSelector({
  selectedEnvironment,
  onSelectEnvironment,
  language,
}: EnvironmentSelectorProps) {
  return (
    <section className="w-full" aria-labelledby="settings-heading">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="settings-heading" className="text-h2 text-ink">
          اختر الموضع
        </h2>
        <span className="text-small text-ink-muted">{ENVIRONMENTS.length} مواضع من الحياة اليومية</span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="settings-heading"
        className="grid grid-cols-1 gap-2 rounded-lg border border-line bg-surface-200 p-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {ENVIRONMENTS.map((env) => (
          <SettingOption
            key={env.id}
            groupName="setting"
            value={env.id}
            name={language === "ar" ? env.name_ar : env.name_en}
            description={env.desc}
            icon={ENVIRONMENT_ICONS[env.id] ?? Globe}
            selected={selectedEnvironment === env.id}
            onSelect={onSelectEnvironment}
          />
        ))}
      </div>
    </section>
  );
}
