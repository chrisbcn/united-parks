import { useState, useEffect } from 'react'
import { Lock, AlertTriangle, CheckCircle, Undo2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { PLAN } from './Screen1.jsx'

const UPDATED_PLAN_A = PLAN.map(item =>
  item.name === 'Mako'
    ? { ...item, time: '3:30 PM', rationale: 'Moved to afternoon when queues drop below 20 min.' }
    : item.name === 'Wild Arctic'
    ? { ...item, time: '4:00 PM', rationale: 'Shifted to keep afternoon flowing smoothly.' }
    : item
)

function AlertBanner({ onDismiss }) {
  return (
    <div className="mx-4 mt-4 bg-white border border-orange-200 rounded-2xl p-4 shadow-sm animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle size={15} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-sw-navy mb-2">Things have shifted</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎢</span>
              <p className="text-xs text-sw-navy"><span className="font-semibold">Mako</span> queue: <span className="text-red-500 font-bold">75 min</span> <span className="text-sw-muted">(was 20)</span></p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🐧</span>
              <p className="text-xs text-sw-navy"><span className="font-semibold">Penguin Trek</span> slot opened at <span className="text-sw-teal font-bold">11:15 AM</span> — rare</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TRUSTER ─────────────────────────────────────────────────────────────────

function TrusterResponse({ onConfirm }) {
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [secs, setSecs] = useState(300)
  useEffect(() => { const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t) }, [])

  return (
    <div className="mx-4 mt-3 space-y-3 animate-slide-up">
      <div className="bg-sw-teal/10 border border-sw-teal/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={16} className="text-sw-teal" />
          <p className="text-sm font-bold text-sw-tealDark">Done — your day is sorted</p>
        </div>
        <p className="text-sm text-sw-navy leading-relaxed">
          Things shifted. I've updated your afternoon — you'll still hit everything that matters, including the Orcas. Lunch stays at 12:30 PM. Penguin Trek secured at 11:15 AM.
        </p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sw-teal/20">
          <Lock size={11} className="text-sw-teal" strokeWidth={2.5} />
          <p className="text-xs text-sw-tealDark font-medium">Orca Encounter: unchanged · 2:00 PM</p>
        </div>
      </div>

      <button onClick={() => setReceiptOpen(r => !r)}
        className="w-full flex items-center justify-between bg-white border border-sw-border rounded-xl px-4 py-3 shadow-sm">
        <span className="text-xs font-semibold text-sw-muted">What changed</span>
        {receiptOpen ? <ChevronUp size={14} className="text-sw-muted" /> : <ChevronDown size={14} className="text-sw-muted" />}
      </button>

      {receiptOpen && (
        <div className="bg-white border border-sw-border rounded-xl p-3 space-y-2 shadow-sm animate-slide-up">
          {[
            { tag: 'OUT', tagColor: 'text-red-500 bg-red-50', label: 'Mako (morning slot)', note: '75-min queue — not worth it' },
            { tag: 'IN',  tagColor: 'text-emerald-600 bg-emerald-50', label: 'Penguin Trek · 11:15 AM', note: 'Rare slot secured' },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-2">
              <span className={`text-[10px] font-bold ${r.tagColor} rounded px-1.5 py-0.5 mt-0.5 flex-shrink-0`}>{r.tag}</span>
              <div>
                <p className="text-xs font-semibold text-sw-navy">{r.label}</p>
                <p className="text-[11px] text-sw-muted">{r.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        {secs > 0 ? (
          <button className="flex items-center gap-1.5 text-xs text-sw-muted hover:text-sw-navy transition-colors">
            <Undo2 size={13} />Undo · {Math.floor(secs/60)}:{(secs%60).toString().padStart(2,'0')}
          </button>
        ) : <span className="text-xs text-sw-border">Undo window closed</span>}
      </div>
    </div>
  )
}

// ─── CONFIGURATOR ────────────────────────────────────────────────────────────

function ConfiguratorResponse({ onPlanUpdate }) {
  const [chosen, setChosen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const pick = (opt) => {
    setChosen(opt); setLoading(true)
    setTimeout(() => { setLoading(false); setConfirmed(true); if (opt === 'A') onPlanUpdate() }, 1400)
  }

  const OPTIONS = [
    { id: 'A', title: 'Skip Mako this morning', sub: 'Saves 45 min', badge: 'RECOMMENDED', changes: [
      { emoji: '🐧', tag: 'IN',   col: 'emerald', text: 'Penguin Trek · 11:15 AM' },
      { emoji: '🍽️', tag: 'SAME', col: 'blue',    text: 'Lunch stays · 12:30 PM' },
      { emoji: '🎢', tag: 'LATER',col: 'orange',  text: 'Mako at 3:30 PM if queues drop' },
    ]},
    { id: 'B', title: 'Ride Mako now', sub: '+45 min wait', changes: [
      { emoji: '🎢', tag: 'NOW',  col: 'violet',  text: 'Mako · 75-min queue' },
      { emoji: '🐧', tag: 'MOVE', col: 'orange',  text: 'Penguin Trek → 2:30 PM (after Orcas)' },
      { emoji: '🍽️', tag: 'MOVE', col: 'orange',  text: 'Lunch shifts → 1:30 PM' },
    ]},
  ]

  const tagColors = { emerald: 'text-emerald-600 bg-emerald-50', blue: 'text-blue-600 bg-blue-50', orange: 'text-orange-600 bg-orange-50', violet: 'text-purple-600 bg-purple-50' }

  if (loading) return (
    <div className="mx-4 mt-3 bg-white border border-sw-border rounded-2xl p-6 flex items-center justify-center gap-3 animate-fade-in shadow-sm">
      <Loader2 size={18} className="text-sw-teal animate-spin" />
      <p className="text-sm text-sw-muted">Updating your plan...</p>
    </div>
  )

  if (confirmed) return (
    <div className="mx-4 mt-3 bg-sw-teal/10 border border-sw-teal/30 rounded-2xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={16} className="text-sw-teal" />
        <p className="text-sm font-bold text-sw-tealDark">Option {chosen} confirmed</p>
      </div>
      <p className="text-sm text-sw-navy">
        {chosen === 'A' ? 'Penguin Trek locked at 11:15 AM. Lunch stays at 12:30 PM. Mako on watch for this afternoon.' : "Mako happening now. Penguin Trek and lunch shifted to keep the day on track."}
      </p>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sw-teal/20">
        <Lock size={11} className="text-sw-teal" strokeWidth={2.5} />
        <p className="text-xs text-sw-tealDark font-medium">Orca Encounter: unchanged · 2:00 PM</p>
      </div>
    </div>
  )

  return (
    <div className="mx-4 mt-3 space-y-3 animate-slide-up">
      {OPTIONS.map(opt => (
        <div key={opt.id} className="bg-white border border-sw-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              {opt.badge && <span className="text-[9px] font-bold text-sw-teal bg-sw-light px-2 py-0.5 rounded-full">{opt.badge}</span>}
              <p className="text-sm font-bold text-sw-navy mt-1">{opt.title}</p>
              <p className="text-xs text-sw-muted">{opt.sub}</p>
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            {opt.changes.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm">{c.emoji}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tagColors[c.col]}`}>{c.tag}</span>
                <p className="text-xs text-sw-navy">{c.text}</p>
              </div>
            ))}
          </div>
          <button onClick={() => pick(opt.id)}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95
              ${opt.id === 'A' ? 'btn-teal' : 'btn-outline'}`}>
            Go with {opt.id}
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── SKEPTIC ─────────────────────────────────────────────────────────────────

function SkepticResponse({ onPlanUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [showB, setShowB] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  const accept = (choice) => {
    setConfirmed(choice)
    if (choice === 'A') onPlanUpdate()
  }

  if (confirmed) return (
    <div className="mx-4 mt-3 bg-sw-teal/10 border border-sw-teal/30 rounded-2xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={16} className="text-sw-teal" />
        <p className="text-sm font-bold text-sw-tealDark">Option {confirmed} confirmed</p>
      </div>
      <div className="space-y-1.5 pt-3 border-t border-sw-teal/20">
        {[
          { label: 'Penguin Trek', val: '11:15 AM · Booked', col: 'text-sw-teal' },
          { label: 'Orca Encounter', val: '2:00 PM · Unchanged 🔒', col: 'text-sw-teal', lock: true },
          { label: 'Lunch', val: '12:30 PM · Unchanged', col: 'text-emerald-600' },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {r.lock && <Lock size={10} className="text-sw-teal" strokeWidth={2.5} />}
              <span className="text-xs text-sw-navy">{r.label}</span>
            </div>
            <span className={`text-xs font-semibold ${r.col}`}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="mx-4 mt-3 space-y-3 animate-slide-up">
      <button onClick={() => setExpanded(e => !e)}
        className="w-full bg-white border border-sw-border rounded-2xl p-4 text-left flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm font-bold text-sw-navy">Something's changed.</p>
          <p className="text-xs text-sw-muted mt-0.5">Tap to see the data.</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-sw-muted" /> : <ChevronDown size={16} className="text-sw-muted" />}
      </button>

      {expanded && (
        <div className="bg-white border border-sw-border rounded-2xl p-4 space-y-4 shadow-sm animate-slide-up">
          <div className="space-y-2.5">
            {[
              { emoji: '🎢', name: 'Mako',            facts: ['Current wait: 75 min', 'Pattern: stays above 60 min until 2 PM'],      status: 'High wait', sc: 'text-red-500' },
              { emoji: '🐧', name: 'Penguin Trek',     facts: ['Slot opened 11:02 AM', 'Historically books out same day'],             status: 'Rare slot', sc: 'text-sw-purple' },
              { emoji: '🐋', name: 'Orca Encounter',   facts: ['2:00 PM · Status: protected', 'This does not move.'],                  status: 'Locked 🔒', sc: 'text-sw-teal', locked: true },
              { emoji: '🍽️', name: 'Sharks Grill',     facts: ['12:30 PM · On track'],                                                status: 'On track', sc: 'text-emerald-600' },
            ].map(item => (
              <div key={item.name} className={`rounded-xl p-3 border ${item.locked ? 'bg-sw-light border-sw-teal/30' : 'bg-sw-bg border-sw-border'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-sm font-bold text-sw-navy">{item.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.sc}`}>{item.status}</span>
                </div>
                {item.facts.map((f, i) => <p key={i} className="text-xs text-sw-muted">· {f}</p>)}
              </div>
            ))}
          </div>

          <div className="border-t border-sw-border pt-3">
            <p className="text-xs font-bold text-sw-muted uppercase tracking-widest mb-2">Recommendation</p>
            <p className="text-sm text-sw-navy leading-relaxed">
              I'd suggest <span className="text-sw-teal font-bold">Option A</span> — skip Mako this morning. The Penguin Trek slot is genuinely rare. Mako at 75 minutes costs you the slot and still leaves you waiting. Queues typically halve after 2 PM.
            </p>
          </div>

          {!showB ? (
            <div className="flex gap-2">
              <button onClick={() => accept('A')} className="flex-1 btn-teal">Accept Option A</button>
              <button onClick={() => setShowB(true)} className="flex-1 btn-outline">See Option B</button>
            </div>
          ) : (
            <div className="space-y-3 animate-slide-up">
              <div className="bg-sw-bg border border-sw-border rounded-xl p-3">
                <p className="text-xs font-bold text-sw-navy mb-1.5">Option B: Ride Mako now</p>
                <p className="text-xs text-sw-muted leading-relaxed">
                  75-min queue now. Penguin Trek moves to 2:30 PM after Orcas. Lunch shifts to 1:30 PM. Tight, but works.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => accept('A')} className="flex-1 btn-teal">Accept Option A</button>
                <button onClick={() => accept('B')} className="flex-1 btn-outline">Go with B</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── MINI TIMELINE ───────────────────────────────────────────────────────────

function MiniTimeline({ plan }) {
  return (
    <div className="bg-white border-b border-sw-border px-4 py-3">
      <p className="text-[10px] font-bold text-sw-muted uppercase tracking-widest mb-2">Today's plan</p>
      <div className="flex gap-2 overflow-x-auto scrollable pb-1">
        {plan.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base
              ${item.done ? 'bg-sw-bg border border-sw-border opacity-40' :
                item.current ? 'bg-sw-teal text-white' :
                item.locked ? 'bg-sw-light border-2 border-sw-teal' : 'bg-sw-bg border border-sw-border'}`}>
              {item.locked ? <Lock size={12} className="text-sw-teal" strokeWidth={2.5} />
               : item.done  ? <CheckCircle size={13} className="text-sw-muted" />
               : item.emoji}
            </div>
            <p className={`text-[9px] text-center leading-tight max-w-[52px] font-medium
              ${item.done ? 'text-sw-border' : item.current ? 'text-sw-teal' : item.locked ? 'text-sw-teal' : 'text-sw-muted'}`}>
              {item.name.split(' ')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

const LIVE_PLAN = PLAN.map((item, i) => ({
  ...item,
  done:    i < 2,
  current: i === 2,
}))

export default function Screen2({ archetype, onPlanUpdate }) {
  const [fired, setFired] = useState(false)

  useEffect(() => { const t = setTimeout(() => setFired(true), 2000); return () => clearTimeout(t) }, [])

  return (
    <div className="flex flex-col h-full bg-sw-bg">
      <MiniTimeline plan={LIVE_PLAN} />

      <div className="flex-1 scrollable">
        {!fired && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
            <p className="text-sw-muted text-sm">Monitoring your plan in real time</p>
            <button onClick={() => setFired(true)} className="btn-outline py-2 px-5 text-xs">
              Simulate disruption
            </button>
          </div>
        )}

        {fired && (
          <>
            <AlertBanner />
            <div className="pb-6">
              {archetype === 'truster'      && <TrusterResponse onConfirm={onPlanUpdate} />}
              {archetype === 'configurator' && <ConfiguratorResponse key="cfg" onPlanUpdate={onPlanUpdate} />}
              {archetype === 'skeptic'      && <SkepticResponse     key="skp" onPlanUpdate={onPlanUpdate} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
