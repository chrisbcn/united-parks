import { useState, useRef, useEffect } from 'react'
import { Sparkles, CheckCircle, Loader2 } from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PRE_QUESTIONS = [
  {
    id: 'group',
    text: "Who's joining you?",
    options: ['Just us two', 'Family with young kids', 'Family with teens', 'Group of friends'],
    multi: false,
  },
  {
    id: 'mustdos',
    text: "Any must-do rides or shows? Pick up to 2.",
    options: ['Mako', 'Manta', 'Orca Encounter', 'Ice Breaker', 'Penguin Trek'],
    multi: true,
    max: 2,
  },
  {
    id: 'departure',
    text: "What time are you heading out?",
    options: ['By 3 PM', 'Around 5 PM', 'Park close'],
    multi: false,
  },
]

const BUILDING_STEPS = [
  { emoji: '🎢', label: 'Checking live wait times' },
  { emoji: '📋', label: 'Building your day sequence' },
]

const MINI_ITINERARY = [
  { time: '9:00 AM',  emoji: '🎢', name: 'Mako',                   note: 'Best queues of the day' },
  { time: '11:15 AM', emoji: '🐧', name: 'Penguin Trek',            note: 'Rare slot secured' },
  { time: '12:30 PM', emoji: '🦈', name: 'Sharks Underwater Grill', note: 'Lunch — beats any food court' },
  { time: '2:00 PM',  emoji: '🐋', name: 'Orca Encounter',          note: 'Your anchor · locked in' },
]

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 20, padding: '0 4px' }}>
      {[0,1,2].map(i => (
        <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

function ConciergeMsg({ text }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }} className="animate-slide-up">
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(0,156,166,0.12)', border: '1px solid rgba(0,156,166,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Sparkles size={14} style={{ color: '#009CA6' }} />
      </div>
      <div style={{
        background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem', borderTopLeftRadius: 4,
        padding: '10px 14px', maxWidth: '82%', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <p style={{ fontSize: 14, color: '#1B3D6F', lineHeight: 1.5, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

function UserMsg({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="animate-slide-up">
      <div style={{
        background: '#009CA6', borderRadius: '1rem', borderBottomRightRadius: 4,
        padding: '10px 14px', maxWidth: '72%',
      }}>
        <p style={{ fontSize: 14, color: '#fff', margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

function BuildingCard({ onDone }) {
  const [doneIdx, setDoneIdx] = useState(-1)

  useEffect(() => {
    let total = 0
    BUILDING_STEPS.forEach((s, i) => {
      total += i === 0 ? 700 : 600
      setTimeout(() => setDoneIdx(i), total)
    })
    setTimeout(onDone, total + 400)
  }, [])

  return (
    <div className="animate-slide-up" style={{
      background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem',
      padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Building your plan
      </p>
      {BUILDING_STEPS.map((s, i) => {
        const done = doneIdx >= i
        return (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < BUILDING_STEPS.length - 1 ? 8 : 0 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: done ? '#EBF7F8' : '#F4F6F8',
              border: `1px solid ${done ? 'rgba(0,156,166,0.3)' : '#E2E6EA'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
            }}>
              {done ? <CheckCircle size={14} style={{ color: '#009CA6' }} /> : s.emoji}
            </div>
            <p style={{ fontSize: 13, color: done ? '#009CA6' : '#6B7280', fontWeight: done ? 600 : 400, margin: 0 }}>
              {s.label}
            </p>
            {!done && <Loader2 size={13} className="animate-spin" style={{ color: '#9CA3AF', marginLeft: 'auto' }} />}
          </div>
        )
      })}
    </div>
  )
}

function MiniItinerary() {
  return (
    <div className="animate-slide-up" style={{
      background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem',
      overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #E2E6EA' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          Your day · Sat Apr 18
        </p>
      </div>
      {MINI_ITINERARY.map((item, i) => (
        <div key={item.name} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
          borderBottom: i < MINI_ITINERARY.length - 1 ? '1px solid #E2E6EA' : 'none',
        }}>
          <div style={{ textAlign: 'right', width: 52, flexShrink: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#1B3D6F', margin: 0 }}>{item.time.split(' ')[0]}</p>
            <p style={{ fontSize: 10, color: '#6B7280', margin: 0 }}>{item.time.split(' ')[1]}</p>
          </div>
          <div style={{ width: 32, height: 32, background: '#F4F6F8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
            {item.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1B3D6F', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── CHECKOUT PANEL ────────────────────────────────────────────────────────────

function CheckoutPanel() {
  const [addedDining, setAddedDining] = useState(false)

  return (
    <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Page header */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid #E2E6EA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>← Back to tickets</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Parks', 'Tickets', 'Dining', 'My Account'].map(n => (
            <span key={n} style={{ fontSize: 13, color: '#6B7280', cursor: 'pointer' }}>{n}</span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 40px', width: '100%' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1B3D6F', marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
          Order Summary
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>SeaWorld Orlando · Sat Apr 18 + Sun Apr 19</p>

        {/* Guests */}
        <div style={{ background: '#F4F6F8', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: '#1B3D6F', fontWeight: 600 }}>👨‍👩‍👧‍👦  2 Adults · 2 Children (ages 3–9)</span>
          <span style={{ fontSize: 12, color: '#009CA6', fontWeight: 600, cursor: 'pointer' }}>Edit</span>
        </div>

        {/* Line items */}
        <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E6EA' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Admission</p>
          </div>
          {[
            { label: 'Single-day General Admission', qty: '× 2', price: '$179.98' },
            { label: 'Single-day Child Admission',   qty: '× 2', price: '$129.98' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #E2E6EA' }}>
              <div>
                <p style={{ fontSize: 14, color: '#1B3D6F', fontWeight: 500, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{item.qty}</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: 0 }}>{item.price}</p>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px' }}>
            <div>
              <p style={{ fontSize: 14, color: '#1B3D6F', fontWeight: 500, margin: 0 }}>Quick Queue Plus</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>× 2 · Skip the queue on top rides</p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: 0 }}>$79.98</p>
          </div>
        </div>

        {/* Add-on */}
        <div style={{ background: addedDining ? '#EBF7F8' : '#fff', border: `1px solid ${addedDining ? 'rgba(0,156,166,0.35)' : '#E2E6EA'}`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: 0 }}>All Day Dining Pass</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Unlimited meals at 6 restaurants · $29.99 per person</p>
          </div>
          <button
            onClick={() => setAddedDining(d => !d)}
            style={{
              fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
              background: addedDining ? '#009CA6' : '#fff',
              color: addedDining ? '#fff' : '#009CA6',
              border: `1.5px solid #009CA6`, transition: 'all 0.2s', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {addedDining ? <><CheckCircle size={12} /> Added</> : 'Add'}
          </button>
        </div>

        {/* Totals */}
        <div style={{ borderTop: '2px solid #E2E6EA', paddingTop: 20, marginBottom: 24 }}>
          {[
            { label: 'Subtotal', val: addedDining ? '$509.90' : '$389.94' },
            { label: 'Taxes & fees', val: addedDining ? '$45.89' : '$35.10' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#6B7280' }}>{r.label}</span>
              <span style={{ fontSize: 14, color: '#1B3D6F' }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #E2E6EA' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1B3D6F' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1B3D6F' }}>{addedDining ? '$555.79' : '$425.04'}</span>
          </div>
        </div>

        {/* CTA */}
        <button style={{
          width: '100%', padding: '14px', borderRadius: 12, background: '#1B3D6F', color: '#fff',
          fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', marginBottom: 20,
        }}>
          Proceed to checkout →
        </button>

        {/* Trust strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          {['🔒 Secure checkout', '✓ Free cancellation', '⭐ Best price guarantee'].map(t => (
            <span key={t} style={{ fontSize: 12, color: '#6B7280' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CONCIERGE PANEL ──────────────────────────────────────────────────────────

function ConciergePanel({ onBack }) {
  const [phase, setPhase]       = useState('chat')   // 'chat' | 'building' | 'itinerary'
  const [qIdx, setQIdx]         = useState(0)
  const [messages, setMessages] = useState([])
  const [typing, setTyping]     = useState(false)
  const [showOpts, setShowOpts] = useState(false)
  const [multiSel, setMultiSel] = useState([])
  const [addedPlan, setAddedPlan] = useState(false)
  const scrollRef = useRef(null)

  const scrollToBottom = () => {
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, 80)
  }

  // Kick off first question on mount
  useEffect(() => {
    setTimeout(() => {
      setMessages([{ type: 'ai', text: PRE_QUESTIONS[0].text }])
      setShowOpts(true)
    }, 700)
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, typing, phase])

  const handleSingleSelect = (opt) => {
    setShowOpts(false)
    setMessages(m => [...m, { type: 'user', text: opt }])
    advanceQuestion()
  }

  const handleMultiConfirm = () => {
    if (multiSel.length === 0) return
    setShowOpts(false)
    setMessages(m => [...m, { type: 'user', text: multiSel.join(', ') }])
    setMultiSel([])
    advanceQuestion()
  }

  const advanceQuestion = () => {
    const next = qIdx + 1
    setQIdx(next)
    if (next < PRE_QUESTIONS.length) {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { type: 'ai', text: PRE_QUESTIONS[next].text }])
        setShowOpts(true)
      }, 750)
    } else {
      // All questions done — build
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { type: 'ai', text: "Perfect — let me pull everything together for you." }])
        setTimeout(() => setPhase('building'), 500)
      }, 750)
    }
  }

  const currentQ = PRE_QUESTIONS[qIdx]

  return (
    <aside className="animate-concierge-in" style={{
      flex: '0 0 40%', display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid #E2E6EA', background: '#F4F6F8',
    }}>
      {/* Panel header */}
      <div style={{ padding: '20px 24px 16px', background: '#fff', borderBottom: '1px solid #E2E6EA', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: '#009CA6' }} />
          <span style={{ fontWeight: 700, color: '#1B3D6F', fontSize: 15 }}>AI Concierge</span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
          Planning a trip? Let me build your day.
        </p>
      </div>

      {/* Message scroll area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) =>
          msg.type === 'ai'
            ? <ConciergeMsg key={i} text={msg.text} />
            : <UserMsg key={i} text={msg.text} />
        )}
        {typing && <div style={{ display: 'flex', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,156,166,0.12)', border: '1px solid rgba(0,156,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles size={14} style={{ color: '#009CA6' }} /></div><div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem', borderTopLeftRadius: 4, padding: '10px 14px' }}><TypingDots /></div></div>}
        {phase === 'building' && <BuildingCard onDone={() => setPhase('itinerary')} />}
        {phase === 'itinerary' && (
          <>
            <ConciergeMsg text="Here's your day — built around what you told me. Looks like a great one." />
            <MiniItinerary />
          </>
        )}
      </div>

      {/* Options tray */}
      {showOpts && phase === 'chat' && currentQ && (
        <div style={{ padding: '12px 20px 16px', background: '#fff', borderTop: '1px solid #E2E6EA', flexShrink: 0 }}>
          {currentQ.multi ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {currentQ.options.map(opt => {
                  const sel = multiSel.includes(opt)
                  return (
                    <button key={opt} onClick={() => {
                      setMultiSel(prev => sel ? prev.filter(x => x !== opt) : prev.length < currentQ.max ? [...prev, opt] : prev)
                    }} style={{
                      padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      background: sel ? '#EBF7F8' : '#fff',
                      border: `1.5px solid ${sel ? '#009CA6' : '#E2E6EA'}`,
                      color: sel ? '#009CA6' : '#6B7280',
                    }}>{opt}</button>
                  )
                })}
              </div>
              <button onClick={handleMultiConfirm} disabled={multiSel.length === 0} style={{
                width: '100%', padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                background: multiSel.length > 0 ? '#009CA6' : '#E2E6EA',
                color: multiSel.length > 0 ? '#fff' : '#9CA3AF',
                border: 'none', cursor: multiSel.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              }}>
                {multiSel.length > 0 ? `Confirm (${multiSel.length} selected)` : 'Select up to 2'}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentQ.options.map(opt => (
                <button key={opt} onClick={() => handleSingleSelect(opt)} style={{
                  padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                  background: '#fff', border: '1px solid #E2E6EA', color: '#1B3D6F',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add to order CTA */}
      {phase === 'itinerary' && (
        <div style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #E2E6EA', flexShrink: 0 }}>
          <button
            onClick={() => setAddedPlan(true)}
            style={{
              width: '100%', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: addedPlan ? '#EBF7F8' : '#009CA6',
              color: addedPlan ? '#009CA6' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {addedPlan ? <><CheckCircle size={15} /> Day plan added to your order</> : 'Add Day Plan to your order →'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#6B7280', marginTop: 8, marginBottom: 0 }}>
            Saves the sequence · Reminders sent before each experience
          </p>
        </div>
      )}

      {/* Back link */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E6EA', background: '#fff', flexShrink: 0 }}>
        <button onClick={onBack} style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          ← Back to app
        </button>
      </div>
    </aside>
  )
}

// ─── SITE HEADER ──────────────────────────────────────────────────────────────

function SiteHeader() {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #E2E6EA', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>🌊</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#1B3D6F', letterSpacing: '-0.02em' }}>SeaWorld</span>
        <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 4, fontWeight: 500 }}>Orlando</span>
      </div>
      <nav style={{ display: 'flex', gap: 28 }}>
        {['Parks', 'Tickets', 'Dining', 'Animals', 'My Account'].map(n => (
          <span key={n} style={{ fontSize: 13, color: '#6B7280', cursor: 'pointer', fontWeight: 500 }}>{n}</span>
        ))}
      </nav>
    </header>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function PrePurchase({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <SiteHeader />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <CheckoutPanel />
        <ConciergePanel onBack={onBack} />
      </div>
    </div>
  )
}
