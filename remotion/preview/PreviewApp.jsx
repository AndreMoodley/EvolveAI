import { useState } from 'react';
import { Player } from '@remotion/player';
import { RealmAscension, realmAscensionSchema } from '../src/compositions/RealmAscension';
import { StrikeBurst, strikeBurstSchema } from '../src/compositions/StrikeBurst';
import { DailyRecap, dailyRecapSchema } from '../src/compositions/DailyRecap';
import { VowDeclaration, vowDeclarationSchema } from '../src/compositions/VowDeclaration';
import { VoidEntityShowcase, voidEntityShowcaseSchema } from '../src/compositions/VoidEntityShowcase';
import { StreakMilestone, streakMilestoneSchema } from '../src/compositions/StreakMilestone';
import { PALETTE, TYPO } from '../src/theme';

const CATALOG = [
  { id: 'RealmAscension', label: 'Realm Ascension', component: RealmAscension, schema: realmAscensionSchema, w: 1920, h: 1080, dur: 180, fps: 30 },
  { id: 'StrikeBurst', label: 'Strike Burst', component: StrikeBurst, schema: strikeBurstSchema, w: 1080, h: 1080, dur: 75, fps: 30 },
  { id: 'DailyRecap', label: 'Daily Recap', component: DailyRecap, schema: dailyRecapSchema, w: 1080, h: 1920, dur: 210, fps: 30 },
  { id: 'VowDeclaration', label: 'Vow Declaration', component: VowDeclaration, schema: vowDeclarationSchema, w: 1080, h: 1920, dur: 210, fps: 30 },
  { id: 'VoidEntityShowcase', label: 'Void Entity Showcase', component: VoidEntityShowcase, schema: voidEntityShowcaseSchema, w: 1080, h: 1080, dur: 300, fps: 30 },
  { id: 'StreakMilestone', label: 'Streak Milestone', component: StreakMilestone, schema: streakMilestoneSchema, w: 1080, h: 1080, dur: 120, fps: 30 },
];

export const PreviewApp = () => {
  const [activeId, setActiveId] = useState(CATALOG[0].id);
  const [propsByComp, setPropsByComp] = useState(() =>
    Object.fromEntries(CATALOG.map((c) => [c.id, { ...c.schema }])),
  );
  const active = CATALOG.find((c) => c.id === activeId);
  const inputProps = propsByComp[activeId];

  const updateProp = (key, value) => {
    setPropsByComp((prev) => ({
      ...prev,
      [activeId]: { ...prev[activeId], [key]: value },
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: PALETTE.obsidian,
      color: PALETTE.textPrimary,
      fontFamily: TYPO.display.fontFamily,
      display: 'grid',
      gridTemplateColumns: '280px 1fr 320px',
    }}>
      <aside style={{ borderRight: `1px solid ${PALETTE.hairline}`, padding: 24 }}>
        <div style={{ ...TYPO.label, color: PALETTE.crimsonGlow, marginBottom: 16 }}>EVOLVEAI · CINEMATICS</div>
        {CATALOG.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '12px 14px', marginBottom: 6,
              background: c.id === activeId ? PALETTE.voidSurfaceHi : 'transparent',
              border: `1px solid ${c.id === activeId ? PALETTE.crimsonGlow : PALETTE.hairline}`,
              borderRadius: 10,
              color: PALETTE.textPrimary,
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          >
            <div style={{ fontWeight: 700 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: PALETTE.textTertiary, marginTop: 2 }}>
              {c.w}×{c.h} · {(c.dur / c.fps).toFixed(1)}s
            </div>
          </button>
        ))}
      </aside>

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          maxWidth: '90%', maxHeight: '90vh',
          aspectRatio: `${active.w} / ${active.h}`,
          width: active.w >= active.h ? '90%' : 'auto',
          height: active.w < active.h ? '85vh' : 'auto',
          boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <Player
            key={activeId}
            component={active.component}
            inputProps={inputProps}
            durationInFrames={active.dur}
            fps={active.fps}
            compositionWidth={active.w}
            compositionHeight={active.h}
            controls
            loop
            autoPlay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </main>

      <aside style={{ borderLeft: `1px solid ${PALETTE.hairline}`, padding: 24, overflowY: 'auto' }}>
        <div style={{ ...TYPO.label, color: PALETTE.gold, marginBottom: 16 }}>PROPS</div>
        {Object.entries(inputProps).map(([k, v]) => (
          <PropControl key={k} name={k} value={v} onChange={(nv) => updateProp(k, nv)} />
        ))}
        <div style={{ marginTop: 20, padding: 12, background: PALETTE.voidSurface, borderRadius: 8, fontFamily: 'monospace', fontSize: 11, color: PALETTE.textTertiary, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(inputProps, null, 2)}
        </div>
      </aside>
    </div>
  );
};

const PropControl = ({ name, value, onChange }) => {
  const isNum = typeof value === 'number';
  const isBool = typeof value === 'boolean';
  const isArr = Array.isArray(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: PALETTE.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{name}</label>
      {isBool ? (
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      ) : isNum ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle}
        />
      ) : isArr ? (
        <input
          type="text"
          value={value.join(',')}
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()))}
          style={inputStyle}
        />
      ) : (
        <input
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  background: PALETTE.voidSurface,
  border: `1px solid ${PALETTE.hairline}`,
  borderRadius: 6,
  color: PALETTE.textPrimary,
  fontSize: 13,
  fontFamily: 'inherit',
};
