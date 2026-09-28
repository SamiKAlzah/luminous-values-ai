"use client";

import React from "react";
import { ENVIRONMENTS } from "../data/localDatasets";
import { CheckCircle2 } from "lucide-react";

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
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#6150EA]"></span>
          <h2 className="text-sm font-bold tracking-wide uppercase text-[#F2F4FF]">
            2. حدد البيئة والسياق الحياتي
          </h2>
        </div>
        <span className="text-xs text-[#9FA9D8]">4 بيئات واقعية</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ENVIRONMENTS.map((env) => {
          const isSelected = selectedEnvironment === env.id;
          const envName = language === "ar" ? env.name_ar : env.name_en;

          return (
            <button
              key={env.id}
              onClick={() => onSelectEnvironment(env.id)}
              className={`group relative p-4 rounded-2xl text-right transition-all duration-300 border flex flex-col justify-between min-h-[95px] ${
                isSelected
                  ? "bg-gradient-to-b from-[#6150EA]/25 via-[#12183F] to-[#12183F] border-[#2EF2C2] shadow-[0_0_20px_rgba(46,242,194,0.2)] ring-1 ring-[#2EF2C2]/50"
                  : "bg-[#12183F]/60 border-[#6150EA]/20 hover:border-[#6150EA]/50 hover:bg-[#1a2254]/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-2xl">{env.icon}</span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2EF2C2] animate-in zoom-in-50" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#6150EA]/20 group-hover:bg-[#2EF2C2]/40 transition-colors" />
                )}
              </div>

              <div>
                <h3 className={`text-xs sm:text-sm font-bold leading-tight ${
                  isSelected ? "text-[#F2F4FF]" : "text-[#D1D8F5] group-hover:text-white"
                }`}>
                  {envName}
                </h3>
                <p className="text-[10px] text-[#9FA9D8] mt-1 line-clamp-1 font-light">
                  {env.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
