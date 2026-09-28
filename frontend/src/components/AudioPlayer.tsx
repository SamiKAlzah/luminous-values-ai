"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // تشغيل السكينة الصوتية (أمواج البحر النقية بدون موسيقى عبر Web Audio API)
  const startOceanWaves = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // إنشاء عازل ضجيج وردي/بني يحاكي صوت تلاطم أمواج البحر الهادئة
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.25;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      noiseSourceRef.current = noiseSource;

      // فلتر تردد منخفض يحاكي حركة الموج المتدرج
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      // مذبذب LFO بطيء لتكرار حركة المد والجزر (0.1 هرتز = دورة موج كل 10 ثوانٍ)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(260, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // التحكم في الصوت العام
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gainNodeRef.current = gainNode;

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      noiseSource.start();

      // محاكاة تغريد عصافير هادئة خافتة على فترات متباعدة
      intervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== "running") return;
        playGentleChirp(audioCtxRef.current, gainNodeRef.current);
      }, 7000);

      setIsPlaying(true);
    } catch (err) {
      console.error("Audio initialization error:", err);
    }
  };

  // محاكاة نغمة عصفور ناعمة جداً وطبيعية
  const playGentleChirp = (ctx: AudioContext, destination: GainNode | null) => {
    try {
      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      const now = ctx.currentTime;

      const baseFreq = 2400 + Math.random() * 600;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.16);

      chirpGain.gain.setValueAtTime(0.001, now);
      chirpGain.gain.linearRampToValueAtTime(0.03 * volume, now + 0.05);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(chirpGain);
      if (destination) {
        chirpGain.connect(destination);
      } else {
        chirpGain.connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  };

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startOceanWaves();
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol * 0.4, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={togglePlay}
        title={isPlaying ? "إيقاف السكينة الصوتية" : "تشغيل السكينة الصوتية (أمواج البحر وزقزقة الطيور)"}
        className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
          isPlaying
            ? "bg-[#6150EA]/20 border-[#2EF2C2] text-[#2EF2C2] shadow-[0_0_15px_rgba(46,242,194,0.3)]"
            : "bg-[#12183F]/80 border-[#6150EA]/30 text-[#9FA9D8] hover:text-[#F2F4FF] hover:border-[#6150EA]"
        }`}
      >
        {isPlaying ? (
          <>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EF2C2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EF2C2]"></span>
            </span>
            <Volume2 className="w-3.5 h-3.5 text-[#2EF2C2] animate-pulse" />
            <span className="font-semibold tracking-wide">السكينة الصوتية: نشطة</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#9FA9D8] group-hover:text-[#2EF2C2] transition-colors" />
            <span>السكينة الصوتية</span>
            <Sparkles className="w-3 h-3 text-[#2EF2C2] opacity-70" />
          </>
        )}
      </button>

      {/* شريط التحكم بالصوت عند التمرير */}
      {isPlaying && (
        <div 
          className="relative"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#12183F]/90 border border-[#6150EA]/30">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 accent-[#2EF2C2] cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
