import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Sound {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

const SOUNDS: Sound[] = [
  { id: 'rain',    name: 'Rain',          icon: '🌧️', desc: 'Steady rainfall' },
  { id: 'thunder', name: 'Thunderstorm',  icon: '⛈️', desc: 'Thunder & rain' },
  { id: 'ocean',   name: 'Ocean',         icon: '🌊', desc: 'Rolling waves' },
  { id: 'stream',  name: 'Stream',        icon: '💧', desc: 'Babbling brook' },
  { id: 'forest',  name: 'Forest',        icon: '🌲', desc: 'Birds & leaves' },
  { id: 'wind',    name: 'Wind',          icon: '💨', desc: 'Gentle breeze' },
  { id: 'fire',    name: 'Fireplace',     icon: '🔥', desc: 'Crackling fire' },
  { id: 'night',   name: 'Night',         icon: '🌙', desc: 'Crickets & frogs' },
  { id: 'cafe',    name: 'Coffee Shop',   icon: '☕', desc: 'Ambient chatter' },
  { id: 'space',   name: 'Deep Space',    icon: '🌌', desc: 'Cosmic drone' },
];

// High-quality procedural audio generation
function buildBuffer(ctx: AudioContext, id: string): AudioBuffer {
  const sr = ctx.sampleRate;
  const dur = 12;
  const buf = ctx.createBuffer(2, sr * dur, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);

  // Seeded pseudo-random for deterministic stereo spread
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff * 2 - 1; };

  switch (id) {
    case 'rain': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const base = rand() * 0.18;
        const drop = Math.random() > 0.9985 ? rand() * 0.55 * Math.exp(-Math.random() * 80 * (t % 1)) : 0;
        const mod = 0.7 + 0.3 * Math.sin(t * 0.4);
        L[i] = (base + drop) * mod;
        R[i] = (rand() * 0.18 + (Math.random() > 0.9985 ? rand() * 0.55 : 0)) * mod;
      }
      break;
    }
    case 'thunder': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const rain = rand() * 0.15;
        const rumble = Math.sin(t * 2 * Math.PI * 28) * 0.08 * (0.5 + 0.5 * Math.sin(t * 0.3));
        const crack = (t > 4 && t < 4.3) ? rand() * 0.6 * Math.exp(-(t - 4) * 12) : 0;
        const crack2 = (t > 9 && t < 9.5) ? rand() * 0.5 * Math.exp(-(t - 9) * 8) : 0;
        L[i] = rain + rumble + crack + crack2;
        R[i] = rand() * 0.15 + rumble * 0.9 + crack * 0.8 + crack2 * 0.8;
      }
      break;
    }
    case 'ocean': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const wave = Math.sin(t * 0.45) * 0.5 + Math.sin(t * 0.28 + 1.2) * 0.3;
        const surf = rand() * 0.35 * Math.max(0, wave);
        const foam = rand() * 0.12;
        L[i] = surf + foam;
        R[i] = rand() * 0.35 * Math.max(0, Math.sin(t * 0.45 + 0.5) * 0.5 + Math.sin(t * 0.28 + 1.8) * 0.3) + rand() * 0.12;
      }
      break;
    }
    case 'stream': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const gurgle = Math.sin(t * 2 * Math.PI * 320 + Math.sin(t * 4.5) * 180) * 0.08;
        const splash = rand() * 0.22;
        const trickle = Math.sin(t * 2 * Math.PI * 180 + Math.sin(t * 2.1) * 90) * 0.06;
        L[i] = gurgle + splash + trickle;
        R[i] = Math.sin(t * 2 * Math.PI * 310 + Math.sin(t * 4.2) * 170) * 0.08 + rand() * 0.22 + trickle;
      }
      break;
    }
    case 'forest': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const leaves = rand() * 0.08 * (0.6 + 0.4 * Math.sin(t * 0.7));
        const wind = rand() * 0.06 * Math.sin(t * 0.25);
        const bird1 = (Math.floor(t * 3) % 7 === 0 && (t * 3) % 1 < 0.15)
          ? Math.sin(t * 2 * Math.PI * 2400 + Math.sin(t * 12) * 600) * 0.25 : 0;
        const bird2 = (Math.floor(t * 2.3) % 5 === 0 && (t * 2.3) % 1 < 0.1)
          ? Math.sin(t * 2 * Math.PI * 1800 + Math.sin(t * 9) * 400) * 0.2 : 0;
        L[i] = leaves + wind + bird1 + bird2;
        R[i] = rand() * 0.08 * (0.6 + 0.4 * Math.sin(t * 0.65)) + wind + bird2 + bird1 * 0.7;
      }
      break;
    }
    case 'wind': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const gust = 0.4 + 0.6 * Math.pow(Math.sin(t * 0.18) * 0.5 + 0.5, 2);
        const whoosh = rand() * 0.38 * gust;
        const whistle = Math.sin(t * 2 * Math.PI * 420 + Math.sin(t * 0.9) * 80) * 0.04 * gust;
        L[i] = whoosh + whistle;
        R[i] = rand() * 0.38 * (0.4 + 0.6 * Math.pow(Math.sin(t * 0.18 + 0.4) * 0.5 + 0.5, 2)) + whistle;
      }
      break;
    }
    case 'fire': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const base = rand() * 0.14 * (0.7 + 0.3 * Math.sin(t * 1.2));
        const crackle = Math.random() > 0.9975 ? rand() * 0.7 * Math.exp(-Math.random() * 60) : 0;
        const pop = Math.random() > 0.9992 ? rand() * 0.45 : 0;
        L[i] = base + crackle + pop;
        R[i] = rand() * 0.14 * (0.7 + 0.3 * Math.sin(t * 1.1)) + (Math.random() > 0.9975 ? rand() * 0.7 : 0);
      }
      break;
    }
    case 'night': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const c1 = Math.sin(t * 2 * Math.PI * 3800 + Math.sin(t * 22) * 200) * (Math.random() > 0.88 ? 0.28 : 0);
        const c2 = Math.sin(t * 2 * Math.PI * 3200 + Math.sin(t * 18) * 150) * (Math.random() > 0.91 ? 0.22 : 0);
        const frog = Math.random() > 0.9985 ? Math.sin(t * 2 * Math.PI * 480) * 0.18 : 0;
        const owl = (Math.floor(t / 4) % 3 === 0 && t % 4 < 0.4)
          ? Math.sin(t * 2 * Math.PI * 380 + Math.sin(t * 3) * 40) * 0.15 : 0;
        L[i] = c1 + c2 + frog + owl;
        R[i] = Math.sin(t * 2 * Math.PI * 3700 + Math.sin(t * 20) * 180) * (Math.random() > 0.88 ? 0.28 : 0) + frog + owl * 0.8;
      }
      break;
    }
    case 'cafe': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const chatter = rand() * 0.12;
        const m1 = Math.sin(t * 2 * Math.PI * 160 + Math.sin(t * 0.6) * 40) * 0.07;
        const m2 = Math.sin(t * 2 * Math.PI * 220 + Math.sin(t * 0.4) * 30) * 0.05;
        const clink = Math.random() > 0.9985 ? Math.sin(t * 2 * Math.PI * 900) * 0.22 * Math.exp(-Math.random() * 30) : 0;
        L[i] = chatter + m1 + m2 + clink;
        R[i] = rand() * 0.12 + m2 + m1 * 0.8 + clink * 0.7;
      }
      break;
    }
    case 'space': {
      for (let i = 0; i < buf.length; i++) {
        const t = i / sr;
        const drone = Math.sin(t * 2 * Math.PI * 55) * 0.18 + Math.sin(t * 2 * Math.PI * 82.5) * 0.12;
        const shimmer = Math.sin(t * 2 * Math.PI * 220 + Math.sin(t * 0.15) * 30) * 0.06;
        const cosmic = rand() * 0.04;
        L[i] = drone + shimmer + cosmic;
        R[i] = Math.sin(t * 2 * Math.PI * 55 + 0.3) * 0.18 + Math.sin(t * 2 * Math.PI * 82.5 + 0.2) * 0.12 + shimmer + rand() * 0.04;
      }
      break;
    }
    default: {
      for (let i = 0; i < buf.length; i++) { L[i] = rand() * 0.2; R[i] = rand() * 0.2; }
    }
  }
  return buf;
}

const MusicScreen: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.65);

  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopAudio = useCallback(() => {
    try { srcRef.current?.stop(); } catch (_) {}
    srcRef.current?.disconnect();
    gainRef.current?.disconnect();
    srcRef.current = null;
    gainRef.current = null;
  }, []);

  useEffect(() => () => { stopAudio(); ctxRef.current?.close(); }, [stopAudio]);

  const startSound = useCallback((id: string, vol: number) => {
    stopAudio();
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const buf = buildBuffer(ctx, id);
    gainRef.current = ctx.createGain();
    gainRef.current.gain.setValueAtTime(0, ctx.currentTime);
    gainRef.current.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1.2);

    // Subtle reverb via convolver
    const convolver = ctx.createConvolver();
    const revBuf = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = revBuf.getChannelData(c);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    }
    convolver.buffer = revBuf;

    const dryGain = ctx.createGain(); dryGain.gain.value = 0.8;
    const wetGain = ctx.createGain(); wetGain.gain.value = 0.2;

    srcRef.current = ctx.createBufferSource();
    srcRef.current.buffer = buf;
    srcRef.current.loop = true;
    srcRef.current.connect(dryGain);
    srcRef.current.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(gainRef.current);
    wetGain.connect(gainRef.current);
    gainRef.current.connect(ctx.destination);
    srcRef.current.start();
    setPlaying(true);
  }, [stopAudio]);

  const handleSelect = (id: string) => {
    if (active === id && playing) {
      gainRef.current?.gain.linearRampToValueAtTime(0, ctxRef.current!.currentTime + 0.5);
      setTimeout(() => { stopAudio(); setPlaying(false); }, 600);
    } else {
      setActive(id);
      startSound(id, volume);
    }
  };

  const togglePlay = () => {
    if (playing) {
      gainRef.current?.gain.linearRampToValueAtTime(0, ctxRef.current!.currentTime + 0.5);
      setTimeout(() => { stopAudio(); setPlaying(false); }, 600);
    } else if (active) {
      startSound(active, volume);
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(v, ctxRef.current.currentTime, 0.1);
    }
  };

  return (
    <div className="music-screen">
      <h1 className="screen-title">Ambient Sounds</h1>
      <p className="screen-subtitle">Choose a soundscape to anchor your focus</p>

      <div className="sound-grid">
        {SOUNDS.map(s => (
          <button
            key={s.id}
            className={`sound-card${active === s.id ? ' active' : ''}`}
            onClick={() => handleSelect(s.id)}
            aria-pressed={active === s.id && playing}
          >
            <span className="sound-icon">{s.icon}</span>
            <span className="sound-name">{s.name}</span>
            <span className="sound-desc">{s.desc}</span>
            {active === s.id && (
              <span className={`sound-badge${playing ? ' playing' : ''}`}>
                {playing ? '▶ playing' : '⏸ paused'}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div className="player-bar">
          <button className="player-play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <div className="player-vol">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <input
              type="range" min={0} max={1} step={0.02} value={volume}
              onChange={e => handleVolume(parseFloat(e.target.value))}
              className="vol-slider"
              aria-label="Volume"
            />
          </div>
          <span className="player-name">
            {SOUNDS.find(s => s.id === active)?.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default MusicScreen;
