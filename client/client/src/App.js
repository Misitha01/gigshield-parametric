import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Shield, CloudRain, Zap, CheckCircle, MapPin, Thermometer, Wind, FileText, ChevronRight, X, Cpu, Radio } from 'lucide-react';

// ── FONTS ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap';
document.head.appendChild(fontLink);

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const ZONES = {
  Standard:  { label: 'Mumbai Central',      premium: 49, risk: 'Baseline city risk applied.',                         color: '#00e5ff' },
  Dharavi:   { label: 'Kurla / Dharavi',      premium: 58, risk: 'High flood risk + high traffic density (+₹9)',        color: '#ff4d4d' },
  SafeZone:  { label: 'Bandra West',          premium: 42, risk: 'Elevated infrastructure · Safe-zone discount (–₹7)', color: '#00e676' },
};

const PARTNERS = ['Zepto', 'Zomato', 'Swiggy', 'Porter'];

// ── PARTICLE BACKGROUND ────────────────────────────────────────────────────
function Particles() {
  const canvas = useRef(null);
  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext('2d');
    let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,0.25)';
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvas} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
}

// ── SCANLINE OVERLAY ───────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    }} />
  );
}

// ── GLITCH TEXT ────────────────────────────────────────────────────────────
function GlitchText({ children, style }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <style>{`
        @keyframes glitch1 {
          0%,100%{clip-path:inset(0 0 98% 0);transform:translate(-2px)}
          20%{clip-path:inset(30% 0 50% 0);transform:translate(2px)}
          40%{clip-path:inset(60% 0 20% 0);transform:translate(-1px)}
        }
        @keyframes glitch2 {
          0%,100%{clip-path:inset(80% 0 5% 0);transform:translate(2px)}
          30%{clip-path:inset(10% 0 70% 0);transform:translate(-2px)}
          60%{clip-path:inset(50% 0 30% 0);transform:translate(1px)}
        }
        @keyframes pulse-glow {
          0%,100%{text-shadow:0 0 20px #00e5ff,0 0 40px #00e5ff44}
          50%{text-shadow:0 0 30px #00e5ff,0 0 60px #00e5ff66,0 0 80px #00e5ff22}
        }
        @keyframes scan {
          0%{top:-100%} 100%{top:100%}
        }
        @keyframes blink {
          0%,100%{opacity:1} 50%{opacity:0}
        }
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
      `}</style>
      <span style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>{children}</span>
      <span aria-hidden style={{
        position: 'absolute', inset: 0, color: '#ff4d4d', opacity: 0.7,
        animation: 'glitch1 4s infinite', ...style,
      }}>{children}</span>
      <span aria-hidden style={{
        position: 'absolute', inset: 0, color: '#00e5ff', opacity: 0.5,
        animation: 'glitch2 4s infinite 0.1s', ...style,
      }}>{children}</span>
    </span>
  );
}

// ── HEX GRID ───────────────────────────────────────────────────────────────
function HexGrid({ zone }) {
  const colors = { Standard: '#00e5ff', Dharavi: '#ff4d4d', SafeZone: '#00e676' };
  const hotspot = { Standard: 4, Dharavi: 4, SafeZone: 8 };
  const accent = colors[zone] || '#00e5ff';
  const hot = hotspot[zone] || 4;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, padding: '12px 0' }}>
      {Array.from({ length: 15 }, (_, i) => {
        const isHot = i === hot;
        const isMed = [hot - 1, hot + 1, hot + 5, hot - 5].includes(i);
        return (
          <motion.div key={i}
            animate={{ opacity: isHot ? [0.8, 1, 0.8] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              height: 32, borderRadius: 4, border: `1px solid ${isHot ? accent : 'rgba(255,255,255,0.08)'}`,
              background: isHot ? `${accent}33` : isMed ? `${accent}11` : 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {isHot && <span style={{ fontSize: 7, color: accent, fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: 0.5 }}>HOT</span>}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── SENSOR RING ────────────────────────────────────────────────────────────
function SensorRing({ value, max, label, icon, unit, color, triggered, onClick }) {
  const pct = Math.min(value / max, 1);
  const r = 38, circ = 2 * Math.PI * r;
  return (
    <motion.div whileHover={{ scale: 1.04 }} onClick={onClick} style={{ cursor: 'pointer', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 8px' }}>
        <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={48} cy={48} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
          <motion.circle cx={48} cy={48} r={r} fill="none"
            stroke={triggered ? '#ff4d4d' : color}
            strokeWidth={6} strokeLinecap="round"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${triggered ? '#ff4d4d' : color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: triggered ? '#ff4d4d' : color, marginBottom: 2 }}>{icon}</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: triggered ? '#ff4d4d' : '#fff' }}>
            {value}{unit}
          </span>
        </div>
      </div>
      <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      {triggered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}
          style={{ fontSize: 9, color: '#ff4d4d', fontFamily: 'JetBrains Mono', marginTop: 4, letterSpacing: 1 }}>
          ● TRIGGERED
        </motion.div>
      )}
    </motion.div>
  );
}

// ── TERMINAL LOG ───────────────────────────────────────────────────────────
function TerminalLog({ lines }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);
  return (
    <div ref={ref} style={{
      background: '#000', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8,
      padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 11,
      color: '#00e5ff', height: 110, overflowY: 'auto', lineHeight: 1.8,
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: l.startsWith('[ERR]') ? '#ff4d4d' : l.startsWith('[OK]') ? '#00e676' : '#00e5ff' }}>
          {l}
        </div>
      ))}
      <span style={{ animation: 'blink 1s infinite' }}>█</span>
    </div>
  );
}

// ── CERTIFICATE MODAL ──────────────────────────────────────────────────────
function CertModal({ onClose, partner, zone, premium }) {
  const z = ZONES[zone] || ZONES.Standard;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        backdropFilter: 'blur(8px)',
      }}>
      <motion.div initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: 360, background: '#fff', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
          position: 'relative',
        }}>
        {/* Gold foil header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)',
          padding: '28px 28px 20px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'repeating-linear-gradient(45deg, #00e5ff 0, #00e5ff 1px, transparent 0, transparent 50%)',
            backgroundSize: '8px 8px',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#00e5ff', letterSpacing: 3, lineHeight: 1 }}>GIGSHIELD</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: 2 }}>POLICY CERTIFICATE</div>
            </div>
            <Shield size={32} color="#00e5ff" />
          </div>
          <div style={{
            marginTop: 20, padding: '10px 14px', background: 'rgba(0,229,255,0.1)',
            border: '1px solid rgba(0,229,255,0.3)', borderRadius: 6,
          }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>POLICY ID</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, color: '#00e5ff', fontWeight: 700 }}>GS-2026-8892</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', background: '#fff' }}>
          {[
            ['POLICY HOLDER', 'MISITHA T'],
            ['PLATFORM', `${partner} DELIVERY`],
            ['WORK ZONE', z.label],
            ['WEEKLY PREMIUM', `₹${premium}`],
            ['COVERAGE TYPE', 'Parametric · Zero-claim'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' }}>{k}</span>
              <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{v}</span>
            </div>
          ))}

          <div style={{ marginTop: 4, padding: '10px 14px', background: '#f0f9ff', border: '1px dashed #00e5ff', borderRadius: 8, textAlign: 'center' }}>
            <CheckCircle size={16} color="#00e676" style={{ marginBottom: 4 }} />
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#00b0cc', fontWeight: 700, letterSpacing: 1 }}>SECTION 80C TAX DEDUCTIBLE</div>
          </div>

          <button onClick={onClose} style={{
            marginTop: 16, width: '100%', padding: '13px', background: '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'DM Sans',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', letterSpacing: 0.5,
          }}>Close Certificate</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function GigShieldApp() {
  const [step, setStep]           = useState(1);
  const [partner, setPartner]     = useState('Zepto');
  const [zone, setZone]           = useState('Standard');
  const [showCert, setShowCert]   = useState(false);
  const [rainfall, setRainfall]   = useState(10);
  const [temp, setTemp]           = useState(30);
  const [aqi, setAqi]             = useState(100);
  const [logs, setLogs]           = useState(['[SYS] GigShield Sentinel v2.4 initialized.', '[SYS] Awaiting environmental telemetry...']);
  const [claims, setClaims]       = useState([
    { id: 'C-001', date: '2026-03-28', trigger: 'Rainfall 22mm',  payout: '₹500', status: 'Settled' },
    { id: 'C-002', date: '2026-04-01', trigger: 'AQI 310',        payout: '₹300', status: 'Settled' },
  ]);

  const z = ZONES[zone] || ZONES.Standard;
  const premium = z.premium;

  const triggered = rainfall > 20 ? 'rain' : temp > 42 ? 'temp' : aqi > 300 ? 'aqi' : null;
  const triggerLabel = triggered === 'rain' ? `Extreme Rainfall (${rainfall}mm)` : triggered === 'temp' ? `Severe Heatwave (${temp}°C)` : triggered === 'aqi' ? `Hazardous AQI (${aqi})` : null;

  // Log updates
  useEffect(() => {
    if (triggered) {
      setLogs(l => [...l,
        `[ALERT] Trigger threshold breached: ${triggerLabel}`,
        `[SYS] Initiating zero-touch claim C-00${claims.length + 1}...`,
        `[OK] ₹500 dispatched to UPI · Policy #GS-8892 updated.`,
      ]);
    } else {
      setLogs(l => [...l, `[SYS] Sensors nominal · Rain:${rainfall}mm Temp:${temp}°C AQI:${aqi}`]);
    }
  }, [triggered, rainfall, temp, aqi]);

  const simulate = (type) => {
    if (type === 'rain')  { setRainfall(25); setTemp(30);  setAqi(100); }
    if (type === 'temp')  { setTemp(45);     setRainfall(10); setAqi(100); }
    if (type === 'aqi')   { setAqi(350);     setRainfall(10); setTemp(30); }
    if (type === 'reset') { setRainfall(10); setTemp(30);  setAqi(100); }
  };

  const addClaim = () => {
    if (triggered && !claims.find(c => c.trigger.includes(triggerLabel?.split(' ')[0]?.substring(0, 4)))) {
      setClaims(cl => [...cl, {
        id: `C-00${cl.length + 1}`, date: new Date().toISOString().split('T')[0],
        trigger: triggerLabel, payout: '₹500', status: 'Processing',
      }]);
    }
  };

  useEffect(() => { if (triggered) addClaim(); }, [triggered]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 0%, #0a0a1a 0%, #050508 60%, #000 100%)',
      color: '#fff', fontFamily: 'DM Sans, sans-serif', position: 'relative',
      overflow: 'hidden',
    }}>
      <Particles />
      <Scanlines />

      {/* Ambient glow orbs */}
      <div style={{ position: 'fixed', top: '-10%', left: '60%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-5%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0 36px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="#00e5ff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#00e5ff', letterSpacing: 4, lineHeight: 1 }}>GIGSHIELD</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginTop: 2 }}>PARAMETRIC INSURANCE PROTOCOL</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>SENTINEL LIVE</span>
            <span style={{ marginLeft: 16, fontFamily: 'JetBrains Mono', fontSize: 12, color: '#00e5ff' }}>DC 95,000</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════════════════
              STEP 1 — ONBOARDING
          ═══════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>

              {/* Hero headline */}
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(0,229,255,0.6)', letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' }}>
                    Phase 2 · Automation & Protection
                  </div>
                  <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(56px,10vw,96px)', margin: 0, lineHeight: 0.95, letterSpacing: 4 }}>
                    <GlitchText>YOUR SHIELD</GlitchText>
                    <br />
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>AGAINST THE</span>
                    <br />
                    <span style={{ color: '#00e5ff' }}>STORM</span>
                  </h1>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 16, color: 'rgba(255,255,255,0.45)', marginTop: 20, fontWeight: 300 }}>
                    Zero-claim parametric payouts triggered by real-world data.
                  </p>
                </motion.div>
              </div>

              {/* Two-column form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 780, margin: '0 auto' }}>

                {/* Left: Partner selection */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase' }}>01 · Select Platform</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {PARTNERS.map(p => (
                      <motion.button key={p} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setPartner(p)}
                        style={{
                          padding: '14px 10px', borderRadius: 10, border: `1px solid ${partner === p ? '#00e5ff' : 'rgba(255,255,255,0.08)'}`,
                          background: partner === p ? 'rgba(0,229,255,0.1)' : 'transparent',
                          color: partner === p ? '#00e5ff' : 'rgba(255,255,255,0.5)',
                          fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.2s', boxShadow: partner === p ? '0 0 20px rgba(0,229,255,0.15)' : 'none',
                        }}>
                        {p}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Right: Zone selection */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase' }}>02 · Work Zone</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Object.entries(ZONES).map(([key, val]) => (
                      <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setZone(key)}
                        style={{
                          padding: '12px 16px', borderRadius: 10, border: `1px solid ${zone === key ? val.color : 'rgba(255,255,255,0.08)'}`,
                          background: zone === key ? `${val.color}18` : 'transparent',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: zone === key ? val.color : 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{val.label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: zone === key ? val.color : 'rgba(255,255,255,0.3)' }}>₹{val.premium}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Premium summary + CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ maxWidth: 780, margin: '24px auto 0', background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 6 }}>WEEKLY PREMIUM</div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 48, color: '#00e5ff', lineHeight: 1, letterSpacing: 2 }}>₹{premium}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: z.color, marginTop: 6 }}>{z.risk}</div>
                </div>
                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,229,255,0.3)' }} whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(3)}
                  style={{
                    padding: '18px 36px', background: '#00e5ff', color: '#000', border: 'none',
                    borderRadius: 12, fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 2,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                  ACTIVATE SHIELD <ChevronRight size={20} />
                </motion.button>
              </motion.div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 3 — DASHBOARD
          ═══════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Sensor monitors */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Cpu size={16} color="#00e5ff" />
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>SENTINEL TRIGGERS</span>
                      </div>
                      <button onClick={() => simulate('reset')} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', letterSpacing: 1 }}>RESET</button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 28 }}>
                      <SensorRing value={rainfall} max={40} label="Rainfall" icon={<CloudRain size={14} />} unit="mm" color="#00e5ff" triggered={triggered === 'rain'} onClick={() => simulate('rain')} />
                      <SensorRing value={temp} max={55} label="Heat" icon={<Thermometer size={14} />} unit="°" color="#ff9f43" triggered={triggered === 'temp'} onClick={() => simulate('temp')} />
                      <SensorRing value={aqi} max={500} label="AQI" icon={<Wind size={14} />} unit="" color="#a29bfe" triggered={triggered === 'aqi'} onClick={() => simulate('aqi')} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      {[
                        { type: 'rain', label: 'Storm Event', color: '#00e5ff' },
                        { type: 'temp', label: 'Heatwave',    color: '#ff9f43' },
                        { type: 'aqi',  label: 'Pollution',   color: '#a29bfe' },
                      ].map(({ type, label, color }) => (
                        <motion.button key={type} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => simulate(type)}
                          style={{
                            padding: '10px', background: 'transparent', border: `1px solid ${color}44`,
                            borderRadius: 10, color, fontFamily: 'JetBrains Mono', fontSize: 10,
                            cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
                          }}>
                          SIM {label.toUpperCase()}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <MapPin size={13} color={z.color} />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>HYPER-LOCAL RISK MAP · {z.label.toUpperCase()}</span>
                    </div>
                    <HexGrid zone={zone} />
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 8, letterSpacing: 1 }}>
                      * Real-time sensor fusion active in {z.label}
                    </div>
                  </div>

                  {/* Terminal */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Radio size={13} color="#00e5ff" />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>SYSTEM LOG</span>
                    </div>
                    <TerminalLog lines={logs.slice(-6)} />
                  </div>

                  {/* Claims ledger */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                      <FileText size={14} color="#00e5ff" />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>CLAIMS LEDGER</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Date', 'Trigger', 'Payout', 'Status'].map(h => (
                            <th key={h} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textAlign: 'left', paddingBottom: 12, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {claims.map((c, i) => (
                          <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '12px 0', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{c.date}</td>
                            <td style={{ padding: '12px 0', fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{c.trigger}</td>
                            <td style={{ padding: '12px 0', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#00e5ff' }}>{c.payout}</td>
                            <td style={{ padding: '12px 0' }}>
                              <span style={{
                                fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, padding: '3px 8px', borderRadius: 4,
                                background: c.status === 'Settled' ? 'rgba(0,230,118,0.1)' : 'rgba(0,229,255,0.1)',
                                color: c.status === 'Settled' ? '#00e676' : '#00e5ff',
                                border: `1px solid ${c.status === 'Settled' ? 'rgba(0,230,118,0.3)' : 'rgba(0,229,255,0.3)'}`,
                              }}>{c.status.toUpperCase()}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Policy card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(0,229,255,0.02) 100%)',
                    border: '1px solid rgba(0,229,255,0.2)', borderRadius: 16, padding: 24,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>ACTIVE POLICY</div>
                        <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#00e5ff', letterSpacing: 2 }}>GS-2026-8892</div>
                      </div>
                      <Shield size={20} color="#00e5ff" />
                    </div>

                    {[
                      ['Holder',    'MISITHA T'],
                      ['Platform',  partner],
                      ['Zone',      z.label],
                      ['Premium',   `₹${premium}/wk`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{k}</span>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: 16, padding: '8px 12px', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#00e676', letterSpacing: 1 }}>STATUS: PROTECTED</span>
                    </div>

                    <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,229,255,0.2)' }} whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCert(true)}
                      style={{
                        marginTop: 14, width: '100%', padding: '12px', background: 'rgba(0,229,255,0.1)',
                        border: '1px solid rgba(0,229,255,0.3)', borderRadius: 10, color: '#00e5ff',
                        fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer', letterSpacing: 1,
                      }}>
                      VIEW CERTIFICATE
                    </motion.button>
                  </div>

                  {/* Tax card */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(0,229,255,0.2)', borderRadius: 16, padding: 22 }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(0,229,255,0.6)', letterSpacing: 2, marginBottom: 8 }}>TAX BENEFITS</div>
                    <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 0 14px' }}>
                      GigShield policies are deductible under Section 80C. Download your tax receipt anytime.
                    </p>
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowCert(true)}
                      style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 8, color: 'rgba(0,229,255,0.6)', fontFamily: 'JetBrains Mono', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>
                      DOWNLOAD RECEIPT
                    </motion.button>
                  </div>

                  {/* Back button */}
                  <button onClick={() => setStep(1)}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>
                    ← BACK TO ONBOARDING
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PAYOUT TOAST ── */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
            style={{
              position: 'fixed', bottom: 28, right: 28, zIndex: 9000,
              background: 'linear-gradient(135deg, #001a0d 0%, #00150a 100%)',
              border: '1px solid rgba(0,230,118,0.4)', borderRadius: 16,
              padding: '20px 24px', maxWidth: 360,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,230,118,0.1), 0 0 40px rgba(0,230,118,0.1)',
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                <CheckCircle size={28} color="#00e676" />
              </motion.div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#00e676', letterSpacing: 2, lineHeight: 1 }}>ZERO-TOUCH PAYOUT</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{triggerLabel}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#00e676', marginTop: 6 }}>₹500 sent to UPI · No claim required.</div>
                <div style={{ marginTop: 12, background: '#000', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#00e676', lineHeight: 2 }}>
                    [OK] Claim synced to Guidewire ClaimCenter<br />
                    [OK] Policy #GS-8892 updated in PolicyCenter
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CERTIFICATE MODAL ── */}
      <AnimatePresence>
        {showCert && <CertModal onClose={() => setShowCert(false)} partner={partner} zone={zone} premium={premium} />}
      </AnimatePresence>
    </div>
  );
}
