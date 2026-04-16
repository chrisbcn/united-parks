import { useState, useRef, useEffect } from 'react'
import { Lock, Star, CheckCircle, Sparkles, Loader2, ChevronRight, Clock, Footprints } from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  { id: 'mode',      text: "What kind of day are you here for?",  options: ['Family-Friendly','Thrill Rides','Relaxed — Animals & Shows','Social & Experiences'], multi: false },
  { id: 'mustdos',   text: "What are your must-dos? Pick up to 3.", options: ['Mako','Manta','Orca Encounter','Ice Breaker','Penguin Trek','Wild Arctic','Sesame Street Land'], multi: true, max: 3 },
  { id: 'discovery', text: "Any hidden gems you'd love to discover?", options: ['Yes, surprise me','No, just the plan','Maybe, show me options'], multi: false },
  { id: 'lunch',     text: "When are you thinking lunch?",       options: ['Before noon','Around 12:30','1pm or later','Graze as I go'], multi: false },
  { id: 'departure', text: "What time are you heading out?",     options: ['3pm','4pm','5pm','Park close'], multi: false },
]

const AGENT_STEPS = [
  { emoji: '🎢', label: 'Ride agent',       action: 'Checking live wait patterns',        duration: 650 },
  { emoji: '🐋', label: 'Ticketing agent',  action: 'Locking Orca Encounter · 2:00 PM',  duration: 600 },
  { emoji: '🍽️', label: 'Restaurant agent', action: 'Securing Sharks Grill · 12:30 PM',  duration: 550 },
  { emoji: '📋', label: 'Sequence agent',   action: 'Optimising your day',                duration: 700 },
]

export const FRI_PLAN = [
  { time: '10:00 AM', name: 'Dolphin Theater',        emoji: '🐬', walk: '—',    locked: false, surprise: false, rationale: 'Dolphin Days show — book ahead, only 30 min.' },
  { time: '11:30 AM', name: 'Penguin Trek',            emoji: '🐧', walk: '6 min', locked: false, surprise: true,  rationale: 'Hidden gem — quieter on Fridays before noon.' },
  { time: '1:00 PM',  name: 'Sharks Underwater Grill', emoji: '🦈', walk: '3 min', locked: false, surprise: false, rationale: 'Easier to get a table on Fridays — no wait.' },
  { time: '3:00 PM',  name: 'Wild Arctic',             emoji: '🦭', walk: '7 min', locked: false, surprise: false, rationale: 'Beluga whales and polar bears — worth an hour.' },
]

export const SUN_PLAN = [
  { time: '9:30 AM',  name: 'Mako',               emoji: '🎢', walk: '—',    locked: false, surprise: false, rationale: 'Shortest queues Sunday morning — go first.' },
  { time: '10:45 AM', name: 'Ice Breaker',         emoji: '🧊', walk: '4 min', locked: false, surprise: false, rationale: 'Low-wait window before families arrive mid-morning.' },
  { time: '12:00 PM', name: 'Flamecraft Bar',      emoji: '🍺', walk: '5 min', locked: false, surprise: true,  rationale: 'Perfect Sunday brunch spot — easy going vibe.' },
  { time: '1:15 PM',  name: 'Sesame Street Land',  emoji: '🎡', walk: '4 min', locked: false, surprise: false, rationale: 'Great for a relaxed final hour before heading out.' },
  { time: '2:30 PM',  name: 'Manta',               emoji: '🎢', walk: '6 min', locked: false, surprise: false, rationale: 'Queue drops Sunday afternoon. Perfect send-off ride.' },
]

export const PLAN = [
  { time: '9:00 AM',  name: 'Mako',                    rationale: 'Shortest queues before 10:30 AM.',           emoji: '🎢', walk: '—',    locked: false, surprise: false },
  { time: '10:30 AM', name: 'Ice Breaker',              rationale: 'Launch coaster, manageable mid-morning.',    emoji: '🧊', walk: '4 min', locked: false, surprise: false },
  { time: '11:15 AM', name: 'Penguin Trek',             rationale: 'Rare slot secured — books out weeks ahead.', emoji: '🐧', walk: '6 min', locked: false, surprise: false },
  { time: '12:30 PM', name: 'Sharks Underwater Grill',  rationale: 'Lunch with the sharks — beats any food court.', emoji: '🦈', walk: '3 min', locked: false, surprise: true  },
  { time: '2:00 PM',  name: 'Orca Encounter',           rationale: 'Your anchor. Everything built around this.',  emoji: '🐋', walk: '5 min', locked: true,  surprise: false },
  { time: '3:30 PM',  name: 'Wild Arctic',              rationale: 'Beluga whales and polar bears.',              emoji: '🦭', walk: '7 min', locked: false, surprise: false },
  { time: '4:30 PM',  name: 'Manta',                   rationale: 'Queue drops after 4 PM. Perfect closer.',     emoji: '🎢', walk: '4 min', locked: false, surprise: false },
]

// ─── ONBOARDING ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-5 px-1">
      <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
    </div>
  )
}

function ConciergeMsg({ text }) {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-sw-teal/20 border border-sw-teal/40 flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-sw-teal" />
      </div>
      <div className="bg-white border border-sw-border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[82%] shadow-sm">
        <p className="text-sm text-sw-navy leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

function OrcaAck() {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-sw-teal/20 border border-sw-teal/40 flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-sw-teal" />
      </div>
      <div className="bg-sw-teal/10 border border-sw-teal/30 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
        <p className="text-sm text-sw-tealDark leading-relaxed">
          Got it. <span className="inline-flex items-center gap-1 font-semibold"><Lock size={11} className="text-sw-teal" strokeWidth={2.5} />Orca Encounter at 2 PM is locked.</span> I'll build everything else around it.
        </p>
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end animate-slide-up">
      <div className="bg-sw-navy rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%]">
        <p className="text-sm text-white font-medium">{text}</p>
      </div>
    </div>
  )
}

function AgentCard({ onComplete }) {
  const [completed, setCompleted] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let elapsed = 0
    AGENT_STEPS.forEach((s, i) => {
      setTimeout(() => setActive(i), elapsed)
      elapsed += s.duration
      setTimeout(() => setCompleted(prev => [...prev, i]), elapsed)
    })
    setTimeout(onComplete, elapsed + 300)
  }, [])

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-sw-teal/20 border border-sw-teal/40 flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-sw-teal" />
      </div>
      <div className="bg-white border border-sw-border rounded-2xl rounded-tl-sm px-4 py-3 flex-1 shadow-sm">
        <p className="text-[10px] font-bold text-sw-muted uppercase tracking-widest mb-3">Agents working</p>
        <div className="space-y-2.5">
          {AGENT_STEPS.map((s, i) => {
            const done = completed.includes(i)
            const isActive = active === i && !done
            return (
              <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${i > active && !done ? 'opacity-25' : ''}`}>
                <span className="text-base flex-shrink-0">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${done ? 'text-emerald-600' : isActive ? 'text-sw-teal' : 'text-sw-muted'}`}>{s.label}</p>
                  <p className="text-[11px] text-sw-muted truncate">{s.action}</p>
                </div>
                {done   ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
               : isActive ? <Loader2 size={14} className="text-sw-teal animate-spin flex-shrink-0" />
               : <div className="w-3.5 h-3.5 rounded-full border border-sw-border flex-shrink-0" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const [multiSelect, setMultiSelect] = useState([])
  const [typing, setTyping] = useState(false)
  const [showAgents, setShowAgents] = useState(false)
  const scrollRef = useRef(null)

  const scroll = () => { setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, 80) }
  useEffect(() => { scroll() }, [messages, typing, showAgents])

  useEffect(() => {
    setTyping(true)
    setTimeout(() => { setTyping(false); setMessages([{ type: 'c', text: QUESTIONS[0].text }]); setShowOptions(true) }, 900)
  }, [])

  const advance = (answer, display) => {
    const q = QUESTIONS[step]
    setShowOptions(false)
    setMessages(prev => [...prev, { type: 'u', text: display || answer }])
    const hasOrca = q.id === 'mustdos' && (Array.isArray(answer) ? answer.includes('Orca Encounter') : false)
    const next = step + 1
    if (next < QUESTIONS.length) {
      setTyping(true)
      if (hasOrca) setTimeout(() => setMessages(prev => [...prev, { type: 'orca' }]), 400)
      setTimeout(() => {
        setTyping(false); setStep(next)
        setMessages(prev => [...prev, { type: 'c', text: QUESTIONS[next].text }])
        setShowOptions(true)
      }, hasOrca ? 1900 : 650)
    } else {
      setTimeout(() => { setMessages(prev => [...prev, { type: 'agents' }]); setShowAgents(true) }, 500)
    }
  }

  const currentQ = QUESTIONS[step]

  return (
    <div className="flex flex-col h-full bg-sw-bg">
      <div className="flex-shrink-0 px-5 pt-4 pb-3 bg-white border-b border-sw-border">
        <p className="font-display text-xl font-bold text-sw-navy">Plan your day</p>
        <p className="text-xs text-sw-muted mt-0.5">Tell me about your visit and I'll handle the rest</p>
      </div>

      <div className="flex-1 scrollable px-4 py-4 space-y-3" ref={scrollRef}>
        {messages.map((m, i) =>
          m.type === 'c'      ? <ConciergeMsg key={i} text={m.text} /> :
          m.type === 'u'      ? <UserBubble   key={i} text={m.text} /> :
          m.type === 'orca'   ? <OrcaAck      key={i} /> :
          m.type === 'agents' ? <AgentCard    key={i} onComplete={onComplete} /> : null
        )}
        {typing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-sw-teal/20 border border-sw-teal/40 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-sw-teal" />
            </div>
            <div className="bg-white border border-sw-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div className="h-2" />
      </div>

      {showOptions && !showAgents && (
        <div className="flex-shrink-0 border-t border-sw-border bg-white px-4 py-3">
          {currentQ.multi ? (
            <>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {currentQ.options.map(o => (
                  <button key={o} onClick={() => setMultiSelect(prev => prev.includes(o) ? prev.filter(x => x !== o) : prev.length >= currentQ.max ? prev : [...prev, o])}
                    className={`chip ${multiSelect.includes(o) ? 'chip-selected' : ''}`}>{o}</button>
                ))}
              </div>
              <button onClick={() => { if (!multiSelect.length) return; advance(multiSelect, multiSelect.join(', ')); setMultiSelect([]) }}
                disabled={!multiSelect.length}
                className={`w-full btn-teal ${!multiSelect.length ? 'opacity-30' : ''}`}>
                {multiSelect.length ? `Continue — ${multiSelect.length} selected` : 'Select at least one'}
              </button>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentQ.options.map(o => <button key={o} onClick={() => advance(o, o)} className="chip">{o}</button>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── ITINERARY ────────────────────────────────────────────────────────────────

function ItineraryRow({ item, index, updated, total }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), index * 60); return () => clearTimeout(t) }, [index])

  return visible ? (
    <div className={`flex gap-0 animate-slide-up ${updated ? 'ring-2 ring-sw-teal/30 rounded-2xl' : ''}`}>
      {/* Time column */}
      <div className="w-16 flex-shrink-0 pt-4 pr-2 text-right">
        <p className="text-xs font-bold text-sw-navy leading-tight">{item.time.split(' ')[0]}</p>
        <p className="text-[10px] text-sw-muted">{item.time.split(' ')[1]}</p>
      </div>

      {/* Timeline dot + line */}
      <div className="flex flex-col items-center px-2">
        <div className={`w-4 h-4 rounded-full mt-4 flex-shrink-0 flex items-center justify-center
          ${item.locked ? 'bg-sw-teal ring-2 ring-sw-teal/30' : 'bg-white border-2 border-sw-teal'}`}>
          {item.locked && <Lock size={8} className="text-white" strokeWidth={3} />}
        </div>
        {index < (total ?? PLAN.length) - 1 && (
          <div className="w-0.5 flex-1 bg-sw-border min-h-[32px] mt-1" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 pb-3 pt-2">
        <div className="bg-white rounded-2xl border border-sw-border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 p-3">
            <div className="w-12 h-12 rounded-xl bg-sw-bg flex items-center justify-center flex-shrink-0 text-2xl">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 flex-wrap mb-0.5">
                    {item.locked && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sw-teal bg-sw-light px-1.5 py-0.5 rounded-full">
                        <Lock size={8} strokeWidth={3} />LOCKED
                      </span>
                    )}
                    {item.surprise && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sw-purple bg-purple-50 px-1.5 py-0.5 rounded-full">
                        <Star size={8} strokeWidth={3} />HIDDEN GEM
                      </span>
                    )}
                    {updated && (
                      <span className="text-[9px] font-bold text-sw-teal bg-sw-light px-1.5 py-0.5 rounded-full">UPDATED</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-sw-navy truncate">{item.name}</p>
                </div>
                {!item.locked && (
                  <button className="btn-teal-sm flex-shrink-0">
                    {item.name.includes('Grill') ? 'Order' : 'Details'}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-sw-muted mt-1 leading-snug line-clamp-2">{item.rationale}</p>
            </div>
          </div>
          {/* Walking time */}
          {index < total - 1 && item.walk !== '—' && (
            <div className="border-t border-sw-border px-3 py-1.5 flex items-center gap-1.5 bg-sw-bg/60">
              <Footprints size={11} className="text-sw-muted" />
              <p className="text-[10px] text-sw-muted">{item.walk} walk to next</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}

// ─── DAY TABS ─────────────────────────────────────────────────────────────────

const DAYS = [
  { id: 'fri', label: 'Fri', date: 'Apr 17' },
  { id: 'sat', label: 'Sat', date: 'Apr 18' },
  { id: 'sun', label: 'Sun', date: 'Apr 19' },
]

function DayTabs({ activeDay, setActiveDay }) {
  return (
    <div className="flex-shrink-0 flex gap-1.5 px-4 pt-3 pb-2.5 bg-white border-b border-sw-border">
      {DAYS.map(d => (
        <button
          key={d.id}
          onClick={() => setActiveDay(d.id)}
          className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all duration-150
            ${activeDay === d.id ? 'bg-sw-teal text-white shadow-sm' : 'text-sw-muted hover:bg-sw-bg'}`}
        >
          <span className="font-bold text-[12px]">{d.label}</span>
          <span className={`text-[10px] mt-0.5 ${activeDay === d.id ? 'text-white/75' : 'text-sw-border'}`}>{d.date}</span>
        </button>
      ))}
    </div>
  )
}

const DAY_LABELS = { fri: 'Fri Apr 17', sat: 'Sat Apr 18', sun: 'Sun Apr 19' }

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Screen1({ onboardingDone, onOnboardingComplete, plan, bookingDone, setBookingDone, activeDay, setActiveDay }) {
  const [bookingState, setBookingState] = useState('idle')
  const [addedUpgrades, setAddedUpgrades] = useState([])

  const currentPlan = activeDay === 'fri' ? FRI_PLAN : activeDay === 'sun' ? SUN_PLAN : plan

  const handleBook = () => {
    setBookingState('processing')
    setTimeout(() => { setBookingState('done'); setBookingDone(true) }, 1600)
  }

  if (!onboardingDone) return <Onboarding onComplete={onOnboardingComplete} />

  return (
    <div className="flex flex-col h-full bg-sw-bg">
      {/* Day tabs */}
      <DayTabs activeDay={activeDay} setActiveDay={setActiveDay} />

      {/* Summary strip */}
      <div className="flex-shrink-0 bg-white border-b border-sw-border px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-sw-muted font-medium">{DAY_LABELS[activeDay]} · SeaWorld Orlando</p>
          <p className="text-sm font-bold text-sw-navy mt-0.5">{currentPlan.length} experiences · depart {activeDay === 'sun' ? '3 PM' : '5 PM'}</p>
        </div>
        {activeDay === 'sat' && (
          <div className="flex items-center gap-1.5 bg-sw-teal/10 border border-sw-teal/30 rounded-full px-3 py-1.5">
            <CheckCircle size={12} className="text-sw-teal" />
            <span className="text-[11px] font-semibold text-sw-tealDark">3 booked</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 scrollable">
        <div className="px-2 py-3">
          {currentPlan.map((item, i) => <ItineraryRow key={item.name} item={item} index={i} total={currentPlan.length} updated={item.updated} />)}
        </div>

        {/* Booking footer — Saturday only */}
        {activeDay !== 'sat' ? (
          <div className="mx-4 mb-4 bg-white rounded-2xl border border-sw-border p-4 text-center">
            <p className="text-xs text-sw-muted">Switch to <span className="font-semibold text-sw-navy">Sat Apr 18</span> to manage bookings</p>
          </div>
        ) : !bookingDone ? (
          <div className="mx-4 mb-4 bg-white rounded-2xl border border-sw-border shadow-sm p-4">
            <p className="text-xs font-bold text-sw-muted uppercase tracking-widest mb-3">Ready to confirm?</p>
            <div className="space-y-2 mb-3">
              {[
                { label: 'Orca Encounter', time: '2:00 PM', locked: true },
                { label: 'Sharks Underwater Grill', time: '12:30 PM' },
                { label: 'Penguin Trek', time: '11:15 AM' },
              ].map(b => (
                <div key={b.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {b.locked && <Lock size={10} className="text-sw-teal" strokeWidth={2.5} />}
                    <span className="text-sm text-sw-navy">{b.label}</span>
                  </div>
                  <span className="text-xs text-sw-muted">{b.time}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-sw-border pt-3 mb-3 space-y-2.5">
              {[
                { label: 'Quick Queue', reason: "4 high-demand rides — protects your morning." },
                { label: 'All Day Dining', reason: "Here until 5 PM — pays for itself at lunch." },
              ].map(u => {
                const added = addedUpgrades.includes(u.label)
                return (
                  <div key={u.label} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-sw-navy">{u.label}</p>
                      <p className="text-[11px] text-sw-muted mt-0.5">{u.reason}</p>
                    </div>
                    <button onClick={() => setAddedUpgrades(prev => added ? prev : [...prev, u.label])}
                      className={`text-xs font-semibold rounded-lg px-3 py-1.5 transition-all flex-shrink-0 flex items-center gap-1
                        ${added ? 'bg-emerald-50 border border-emerald-300 text-emerald-600' : 'btn-outline py-1.5'}`}>
                      {added ? <><CheckCircle size={11} />Added</> : 'Add'}
                    </button>
                  </div>
                )
              })}
            </div>
            <button onClick={handleBook} disabled={bookingState === 'processing'}
              className="w-full btn-teal flex items-center justify-center gap-2">
              {bookingState === 'processing' ? <><Loader2 size={15} className="animate-spin" />Booking...</> : 'Book my day'}
            </button>
          </div>
        ) : (
          <div className="mx-4 mb-4 bg-emerald-50 rounded-2xl border border-emerald-200 p-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-emerald-500" />
              <p className="text-sm font-bold text-emerald-700">Day booked</p>
            </div>
            <p className="text-xs text-emerald-600">Confirmations sent · Passes ready to scan at entry</p>
          </div>
        )}
      </div>
    </div>
  )
}
