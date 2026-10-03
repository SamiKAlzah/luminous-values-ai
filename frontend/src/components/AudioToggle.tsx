"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { buttonClasses } from "./Button";

interface Ambient {
  setVolume: (volume: number) => void;
  stop: () => void;
}

// نغمة عصفور ناعمة جداً وطبيعية
function playGentleChirp(ctx: AudioContext, destination: GainNode, volume: number) {
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
    chirpGain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // ignore
  }
}

// السكينة الصوتية: أمواج بحر هادئة بلا موسيقى عبر Web Audio API، مع تغريد خافت متباعد
function startAmbient(initialVolume: number): Ambient | null {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    let volume = initialVolume;

    // ضجيج وردي/بني يحاكي تلاطم الأمواج
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
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

    // فلتر تردد منخفض يحاكي حركة الموج المتدرج
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    // مذبذب بطيء لتكرار المد والجزر (دورة موج كل ~8 ثوانٍ)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(260, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start();

    const interval = setInterval(() => {
      if (ctx.state !== "running") return;
      playGentleChirp(ctx, gainNode, volume);
    }, 7000);

    return {
      setVolume: (v) => {
        volume = v;
        gainNode.gain.setValueAtTime(v * 0.4, ctx.currentTime);
      },
      stop: () => {
        clearInterval(interval);
        ctx.close().catch(() => {});
      },
    };
  } catch (err) {
    console.error("Audio initialization error:", err);
    return null;
  }
}

/** Ambient audio control: off by default, with a labelled on/off state. */
export default function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const ambientRef = useRef<Ambient | null>(null);

  const toggle = () => {
    if (ambientRef.current) {
      ambientRef.current.stop();
      ambientRef.current = null;
      setPlaying(false);
      return;
    }
    const ambient = startAmbient(volume);
    if (ambient) {
      ambientRef.current = ambient;
      setPlaying(true);
    }
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    ambientRef.current?.setVolume(next);
  };

  useEffect(() => {
    return () => {
      ambientRef.current?.stop();
      ambientRef.current = null;
    };
  }, []);

  const Icon = playing ? Volume2 : VolumeX;

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        title="أمواج البحر وزقزقة الطيور، بلا موسيقى"
        className={buttonClasses(playing ? "primary" : "quiet")}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        <span>السكينة الصوتية</span>
        <span className="text-caption">{playing ? "تعمل" : "متوقفة"}</span>
      </button>

      {playing && (
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface-card px-3 text-small text-ink-muted">
          <span className="sr-only">مستوى الصوت</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="h-1 w-20 cursor-pointer accent-brand"
          />
        </label>
      )}
    </div>
  );
}
