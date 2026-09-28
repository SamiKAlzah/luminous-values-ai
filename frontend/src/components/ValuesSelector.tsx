"use client";

import React from "react";
import { VALUES_DATA, ValueData } from "../data/localDatasets";
import { Sparkles, CheckCircle2 } from "lucide-react";

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
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#2EF2C2]"></span>
          <h2 className="text-sm font-bold tracking-wide uppercase text-[#F2F4FF]">
            1. اختر القيمة النبيلة
          </h2>
        </div>
        <span className="text-xs text-[#9FA9D8]">5 قيم معتمدة</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {valuesList.map((val: ValueData) => {
          const isSelected = selectedValue === val.id;
          const valName = val.value_name[language] || val.value_name["ar"];

          return (
            <button
              key={val.id}
              onClick={() => onSelectValue(val.id)}
              className={`group relative p-3.5 rounded-2xl text-right transition-all duration-300 border flex flex-col justify-between min-h-[105px] ${
                isSelected
                  ? "bg-gradient-to-b from-[#6150EA]/30 to-[#12183F] border-[#2EF2C2] shadow-[0_0_20px_rgba(46,242,194,0.25)] ring-1 ring-[#2EF2C2]/50"
                  : "bg-[#12183F]/60 border-[#6150EA]/20 hover:border-[#6150EA]/60 hover:bg-[#1a2254]/50"
              }`}
            >
              {/* أيقونة القيمة وعلامة الاختيار */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {val.icon}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2EF2C2] animate-in zoom-in-50 duration-200" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#6150EA]/30 group-hover:bg-[#2EF2C2]/60 transition-colors" />
                )}
              </div>

              {/* اسم القيمة */}
              <div>
                <h3 className={`text-xs font-bold leading-snug line-clamp-2 ${
                  isSelected ? "text-[#F2F4FF]" : "text-[#D1D8F5] group-hover:text-white"
                }`}>
                  {valName}
                </h3>
              </div>

              {/* وميض زخرفي ناعم */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#2EF2C2]/5 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
