import { useState, useRef, useEffect } from 'react'
import { Sparkles, CheckCircle, Loader2, ShoppingCart, X, ChevronDown, ChevronUp, Smartphone, Lock } from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TICKETS = [
  {
    id: 'single',
    name: 'Single-Day Ticket',
    tag: 'Most popular',
    tagColor: '#009CA6',
    desc: 'Visit on any one day during the 2026 season.',
    price: 89.99,
    original: 164.99,
    saving: 'Save 45%',
    perks: ['Includes all rides & shows', 'Add Quick Queue to skip lines', 'Upgradeable to Fun Card'],
    emoji: '🎟️',
  },
  {
    id: 'anyday',
    name: 'Any Day Ticket',
    tag: 'Best flexibility',
    tagColor: '#6B2D8B',
    desc: 'Choose your date any time in the next 6 months.',
    price: 119.99,
    original: 174.99,
    saving: 'Save 31%',
    perks: ['No date commitment needed', 'Valid 6 months from purchase', 'Transferable once'],
    emoji: '📅',
  },
  {
    id: 'funcard',
    name: '2026 Fun Card',
    tag: 'Best value',
    tagColor: '#D4891A',
    desc: 'Unlimited visits for the entire 2026 season.',
    price: 129.99,
    original: 249.99,
    saving: 'Save 48%',
    perks: ['Unlimited visits all year', 'Free parking included', '10% off dining & retail'],
    emoji: '🃏',
  },
]

const ADDONS = [
  { id: 'quickqueue', name: 'Quick Queue',       desc: 'Skip the line on all major rides',   price: 39.99, emoji: '⚡' },
  { id: 'dining',    name: 'All-Day Dining',     desc: 'Unlimited meals at 6 restaurants',   price: 39.99, emoji: '🍽️' },
  { id: 'parking',   name: 'Preferred Parking',  desc: 'Closest lot to the main entrance',   price: 25.00, emoji: '🅿️' },
]

// 2 questions only — gather preferences, then hand off to app
const CONFIRM_QUESTIONS = [
  {
    id: 'mode',
    text: "What kind of visit are you planning?",
    options: ['Family-Friendly', 'Thrill Rides', 'Relaxed — Animals & Shows', 'Social & Experiences'],
    multi: false,
  },
  {
    id: 'mustdos',
    text: "What can't you miss? Pick up to 3 — I'll lock them into your plan.",
    options: ['Mako', 'Manta', 'Orca Encounter', 'Ice Breaker', 'Penguin Trek', 'Wild Arctic', 'Sesame Street Land'],
    multi: true,
    max: 3,
  },
]

// ─── SHARED SMALL COMPONENTS ──────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 20, padding: '0 4px' }}>
      {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </div>
  )
}

function ConciergeMsg({ text }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }} className="animate-slide-up">
      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,156,166,0.12)', border: '1px solid rgba(0,156,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles size={13} style={{ color: '#009CA6' }} />
      </div>
      <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem', borderTopLeftRadius: 4, padding: '10px 14px', maxWidth: '82%', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 13, color: '#1B3D6F', lineHeight: 1.5, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

function UserMsg({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="animate-slide-up">
      <div style={{ background: '#009CA6', borderRadius: '1rem', borderBottomRightRadius: 4, padding: '10px 14px', maxWidth: '72%' }}>
        <p style={{ fontSize: 13, color: '#fff', margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

// ─── SITE HEADER ──────────────────────────────────────────────────────────────

function SiteHeader({ cartCount, onCart }) {
  return (
    <header style={{ background: '#1B3D6F', padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>🌊</span>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>SeaWorld</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginLeft: 2, fontWeight: 400 }}>Orlando</span>
      </div>
      <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {['Info', 'Explore', 'Events', 'Experiences', 'Passes'].map(n => (
          <span key={n} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontWeight: 500 }}>{n}</span>
        ))}
        <button onClick={onCart} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#FFE617', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 700, fontSize: 13, color: '#1B3D6F', cursor: 'pointer' }}>
          <ShoppingCart size={15} />
          Buy Tickets {cartCount > 0 && <span style={{ background: '#009CA6', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{cartCount}</span>}
        </button>
      </nav>
    </header>
  )
}

// ─── STEP 1: TICKET SELECTION ─────────────────────────────────────────────────

function TicketsPage({ onContinue }) {
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState({ adults: 2, children: 2 })
  const [addons, setAddons] = useState([])
  const [date, setDate] = useState('Sat, Apr 18')

  const toggleAddon = id => setAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const subtotal = selected
    ? (TICKETS.find(t => t.id === selected)?.price || 0) * (qty.adults + qty.children)
      + addons.reduce((sum, id) => sum + (ADDONS.find(a => a.id === id)?.price || 0) * (qty.adults + qty.children), 0)
    : 0

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F4F6F8' }}>
      {/* Hero strip */}
      <div style={{ background: '#1B3D6F', padding: '32px 48px 28px' }}>
        <div style={{ maxWidth: 1184, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: '#FFE617', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: '#1B3D6F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            🌸 Spring Spectacular Sale — up to 48% off
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>SeaWorld Orlando Tickets</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Choose your ticket, pick your add-ons, and build your perfect day.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1184, margin: '0 auto', padding: '36px 48px 60px' }}>
        {/* Guest + date row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { label: 'Adults (13+)', key: 'adults' },
            { label: 'Children (3–12)', key: 'children' },
          ].map(({ label, key }) => (
            <div key={key} style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1B3D6F', minWidth: 110 }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setQty(q => ({ ...q, [key]: Math.max(0, q[key] - 1) }))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #E2E6EA', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16, color: '#1B3D6F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1B3D6F', minWidth: 20, textAlign: 'center' }}>{qty[key]}</span>
                <button onClick={() => setQty(q => ({ ...q, [key]: q[key] + 1 }))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #E2E6EA', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16, color: '#1B3D6F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>
          ))}
          <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1B3D6F' }}>📅 Date</span>
            <select value={date} onChange={e => setDate(e.target.value)} style={{ fontSize: 13, fontWeight: 600, color: '#1B3D6F', border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none' }}>
              {['Sat, Apr 18', 'Sun, Apr 19', 'Mon, Apr 20', 'Sat, Apr 25', 'Sun, Apr 26'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Ticket cards */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1B3D6F', marginBottom: 16 }}>Choose your ticket</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          {TICKETS.map(t => {
            const isSelected = selected === t.id
            return (
              <div key={t.id} onClick={() => setSelected(t.id)} style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s',
                border: `2px solid ${isSelected ? '#009CA6' : '#E2E6EA'}`,
                boxShadow: isSelected ? '0 0 0 4px rgba(0,156,166,0.1)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ background: isSelected ? '#EBF7F8' : '#F4F6F8', padding: '20px 22px 16px', borderBottom: '1px solid #E2E6EA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{t.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, background: t.tagColor, color: '#fff', borderRadius: 20, padding: '3px 9px' }}>{t.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B3D6F', margin: '0 0 4px' }}>{t.name}</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>{t.desc}</p>
                </div>
                <div style={{ padding: '16px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#1B3D6F' }}>${t.price}</span>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>per person</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: '#6B7280', textDecoration: 'line-through' }}>${t.original}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#009CA6' }}>{t.saving}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {t.perks.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <CheckCircle size={12} style={{ color: '#009CA6', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#374151' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{
                    marginTop: 16, width: '100%', padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    background: isSelected ? '#009CA6' : '#1B3D6F', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    {isSelected ? <><CheckCircle size={13} /> Selected</> : 'Select'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add-ons */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1B3D6F', marginBottom: 16 }}>Enhance your visit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {ADDONS.map(a => {
            const added = addons.includes(a.id)
            return (
              <div key={a.id} onClick={() => toggleAddon(a.id)} style={{
                background: '#fff', border: `2px solid ${added ? '#009CA6' : '#E2E6EA'}`,
                borderRadius: 14, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: added ? '0 0 0 3px rgba(0,156,166,0.1)' : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ fontSize: 22 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1B3D6F', margin: '0 0 2px' }}>{a.name}</p>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 4px' }}>{a.desc}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#009CA6', margin: 0 }}>${a.price}/person</p>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${added ? '#009CA6' : '#D1D5DB'}`, background: added ? '#009CA6' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {added && <CheckCircle size={12} style={{ color: '#fff' }} />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Sticky CTA bar */}
        <div style={{ position: 'sticky', bottom: 24, background: '#fff', border: '1px solid #E2E6EA', borderRadius: 16, padding: '18px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            {selected ? (
              <>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 2px' }}>
                  {qty.adults + qty.children} guests · {TICKETS.find(t => t.id === selected)?.name} {addons.length > 0 ? `+ ${addons.length} add-on${addons.length > 1 ? 's' : ''}` : ''}
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#1B3D6F', margin: 0 }}>${subtotal.toFixed(2)} <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280' }}>total</span></p>
              </>
            ) : (
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Select a ticket to continue</p>
            )}
          </div>
          <button
            onClick={() => selected && onContinue({ ticket: selected, qty, addons, date, subtotal })}
            disabled={!selected}
            style={{
              padding: '14px 36px', borderRadius: 12, fontWeight: 700, fontSize: 15, border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
              background: selected ? '#1B3D6F' : '#E2E6EA', color: selected ? '#fff' : '#9CA3AF', transition: 'all 0.2s',
            }}
          >
            Continue to checkout →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── STEP 2: ORDER SUMMARY (no sidebar) ───────────────────────────────────────

function CheckoutPage({ order, onBack, onConfirm }) {
  const { ticket, qty, addons, date, subtotal } = order
  const ticketInfo = TICKETS.find(t => t.id === ticket)
  const taxes = subtotal * 0.083
  const total = subtotal + taxes

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F4F6F8' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 48px 60px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13, color: '#6B7280' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#009CA6', fontWeight: 600, padding: 0, fontSize: 13 }}>← Tickets</button>
          <span>/</span>
          <span style={{ color: '#1B3D6F', fontWeight: 600 }}>Order Summary</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1B3D6F', marginBottom: 24 }}>Order Summary</h1>

        {/* Ticket block */}
        <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E6EA' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tickets</span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1B3D6F', margin: '0 0 4px' }}>{ticketInfo?.name}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{date} · {qty.adults} Adult{qty.adults !== 1 ? 's' : ''}{qty.children > 0 ? ` · ${qty.children} Child${qty.children !== 1 ? 'ren' : ''}` : ''}</p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1B3D6F', margin: 0 }}>${(ticketInfo?.price * (qty.adults + qty.children)).toFixed(2)}</p>
            </div>
            {addons.length > 0 && addons.map(id => {
              const a = ADDONS.find(x => x.id === id)
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #E2E6EA' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: '0 0 2px' }}>{a?.name}</p>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{qty.adults + qty.children} × ${a?.price}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: 0 }}>${(a?.price * (qty.adults + qty.children)).toFixed(2)}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Totals */}
        <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
          {[
            { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
            { label: 'Taxes & fees (8.3%)', val: `$${taxes.toFixed(2)}` },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: '#6B7280' }}>{r.label}</span>
              <span style={{ fontSize: 14, color: '#1B3D6F' }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '2px solid #E2E6EA', marginTop: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#1B3D6F' }}>Total</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#1B3D6F' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={onConfirm} style={{ width: '100%', padding: '16px', borderRadius: 14, background: '#1B3D6F', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', marginBottom: 14 }}>
          Complete purchase →
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
          {['🔒 Secure checkout', '✓ Free cancellation', '⭐ Best price guarantee'].map(t => (
            <span key={t} style={{ fontSize: 12, color: '#6B7280' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── STEP 3: ORDER CONFIRMATION + AI PLANNER SIDEBAR ──────────────────────────

function AIPlannerPanel({ order, onAppLink }) {
  const [qIdx, setQIdx]         = useState(0)
  const [messages, setMessages] = useState([])
  const [typing, setTyping]     = useState(false)
  const [showOpts, setShowOpts] = useState(false)
  const [multiSel, setMultiSel] = useState([])
  const [done, setDone]         = useState(false)
  const scrollRef = useRef(null)

  const scrollToBottom = () => setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, 80)
  useEffect(() => { scrollToBottom() }, [messages, typing, done])

  // Auto-open with a greeting
  useEffect(() => {
    const adults   = order?.qty?.adults   ?? 2
    const children = order?.qty?.children ?? 2
    const who = children > 0 ? `${adults} adults & ${children} kids` : `${adults} adult${adults !== 1 ? 's' : ''}`
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages([
        { type: 'ai', text: `Booking confirmed for ${who} on ${order?.date ?? 'Sat, Apr 18'}. Let's get a head start on your day.` },
        { type: 'ai', text: CONFIRM_QUESTIONS[0].text },
      ])
      setShowOpts(true)
    }, 700)
  }, [])

  const advance = (answer, display) => {
    setShowOpts(false)
    setMessages(m => [...m, { type: 'user', text: display || answer }])
    const next = qIdx + 1
    if (next < CONFIRM_QUESTIONS.length) {
      setQIdx(next)
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { type: 'ai', text: CONFIRM_QUESTIONS[next].text }])
        setShowOpts(true)
      }, 750)
    } else {
      // All questions answered — confirm and hand off
      setQIdx(next)
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { type: 'ai', text: "Perfect — your preferences are saved. Open the app to see your personalised plan." }])
        setDone(true)
      }, 750)
    }
  }

  const handleSingle = opt => advance(opt, opt)
  const handleMulti  = () => {
    if (!multiSel.length) return
    advance(multiSel, multiSel.join(', '))
    setMultiSel([])
  }

  const currentQ = CONFIRM_QUESTIONS[qIdx]

  return (
    <aside style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', border: '1px solid #E2E6EA', borderRadius: 16, overflow: 'hidden', background: '#F4F6F8', alignSelf: 'flex-start', position: 'sticky', top: 24 }}>
      {/* Header */}
      <div style={{ padding: '14px 20px 12px', background: '#fff', borderBottom: '1px solid #E2E6EA', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={15} style={{ color: '#009CA6' }} />
        <span style={{ fontWeight: 700, color: '#1B3D6F', fontSize: 14 }}>AI Day Planner</span>
        <span style={{ fontSize: 10, fontWeight: 700, background: '#EBF7F8', color: '#009CA6', borderRadius: 20, padding: '2px 7px', border: '1px solid rgba(0,156,166,0.2)' }}>Optional</span>
      </div>

      {/* Chat */}
      <div ref={scrollRef} style={{ overflowY: 'auto', maxHeight: 320 }}>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg, i) =>
            msg.type === 'ai' ? <ConciergeMsg key={i} text={msg.text} /> : <UserMsg key={i} text={msg.text} />
          )}
          {typing && (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,156,166,0.12)', border: '1px solid rgba(0,156,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={13} style={{ color: '#009CA6' }} />
              </div>
              <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem', borderTopLeftRadius: 4, padding: '10px 14px' }}>
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Options tray */}
      {showOpts && !done && currentQ && (
        <div style={{ padding: '10px 16px 14px', background: '#fff', borderTop: '1px solid #E2E6EA' }}>
          {currentQ.multi ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {currentQ.options.map(opt => {
                  const sel = multiSel.includes(opt)
                  return (
                    <button key={opt}
                      onClick={() => setMultiSel(prev => sel ? prev.filter(x => x !== opt) : prev.length < currentQ.max ? [...prev, opt] : prev)}
                      style={{ padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: sel ? '#EBF7F8' : '#fff', border: `1.5px solid ${sel ? '#009CA6' : '#E2E6EA'}`, color: sel ? '#009CA6' : '#6B7280', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {sel && <Lock size={9} strokeWidth={2.5} />}{opt}
                    </button>
                  )
                })}
              </div>
              <button onClick={handleMulti} disabled={!multiSel.length}
                style={{ width: '100%', padding: '9px', borderRadius: 9, fontWeight: 700, fontSize: 13, background: multiSel.length ? '#009CA6' : '#E2E6EA', color: multiSel.length ? '#fff' : '#9CA3AF', border: 'none', cursor: multiSel.length ? 'pointer' : 'not-allowed' }}>
                {multiSel.length ? `Lock these in — ${multiSel.length} selected` : 'Select at least one'}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {currentQ.options.map(opt => (
                <button key={opt} onClick={() => handleSingle(opt)}
                  style={{ padding: '9px 12px', borderRadius: 9, fontSize: 13, fontWeight: 500, background: '#fff', border: '1px solid #E2E6EA', color: '#1B3D6F', cursor: 'pointer', textAlign: 'left' }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Done state — hand off to app */}
      {done && (
        <div style={{ padding: '14px 16px', background: '#fff', borderTop: '1px solid #E2E6EA', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onAppLink} style={{ width: '100%', padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', background: '#009CA6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Smartphone size={14} /> Open in the SeaWorld app →
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', margin: 0 }}>
            Or <a href="/?scenario-mobile" target="_blank" rel="noreferrer" style={{ color: '#009CA6', fontWeight: 600, textDecoration: 'none' }}>continue in mobile web</a>
          </p>
        </div>
      )}
    </aside>
  )
}

function ConfirmationPage({ order, onAppLink }) {
  const { ticket, qty, addons, date, subtotal } = order
  const ticketInfo = TICKETS.find(t => t.id === ticket)
  const taxes = subtotal * 0.083
  const total = subtotal + taxes
  const orderNum = 'SW-2026-' + Math.floor(Math.random() * 90000 + 10000)

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F4F6F8' }}>
      <div style={{ maxWidth: 1184, margin: '0 auto', padding: '36px 48px 60px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>
          Tickets / Order Summary / <span style={{ color: '#1B3D6F', fontWeight: 600 }}>Confirmation</span>
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          {/* Left: confirmation */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Success banner */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={22} style={{ color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#15803D', margin: '0 0 4px' }}>You're going to SeaWorld! 🎉</p>
                <p style={{ fontSize: 13, color: '#16A34A', margin: 0 }}>Confirmation #{orderNum} · Receipt sent to your email</p>
              </div>
            </div>

            {/* Booking summary */}
            <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E6EA' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Booking details</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#1B3D6F', margin: '0 0 4px' }}>{ticketInfo?.name}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{date} · {qty.adults} Adult{qty.adults !== 1 ? 's' : ''}{qty.children > 0 ? ` · ${qty.children} Child${qty.children !== 1 ? 'ren' : ''}` : ''}</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1B3D6F', margin: 0 }}>${(ticketInfo?.price * (qty.adults + qty.children)).toFixed(2)}</p>
                </div>
                {addons.length > 0 && addons.map(id => {
                  const a = ADDONS.find(x => x.id === id)
                  return (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #E2E6EA' }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: '0 0 2px' }}>{a?.name}</p>
                        <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{qty.adults + qty.children} × ${a?.price}</p>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1B3D6F', margin: 0 }}>${(a?.price * (qty.adults + qty.children)).toFixed(2)}</p>
                    </div>
                  )
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '2px solid #E2E6EA', marginTop: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#1B3D6F' }}>Total paid</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#1B3D6F' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* What's next */}
            <div style={{ background: '#fff', border: '1px solid #E2E6EA', borderRadius: 16, padding: '20px 24px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>What's next</p>
              {[
                { icon: '📧', title: 'Check your email', desc: 'Tickets and receipt sent — save the PDF or add to Apple/Google Wallet.' },
                { icon: '📱', title: 'Download the SeaWorld app', desc: 'Your AI Day Planner is waiting — build your itinerary before you arrive.' },
                { icon: '🎢', title: 'See you on ' + date, desc: 'Gates open at 9:00 AM. Head to the main entrance to scan your passes.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 14 : 0 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1B3D6F', margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: active AI planner */}
          <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Let us plan banner */}
            <div
              onClick={onAppLink}
              style={{ background: '#1B3D6F', borderRadius: 16, padding: '24px 22px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(27,61,111,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#16326A'}
              onMouseLeave={e => e.currentTarget.style.background = '#1B3D6F'}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Smartphone size={22} style={{ color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 6px', lineHeight: 1.25 }}>Let us plan an amazing time in our park</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Plan your perfect day in the SeaWorld app — before you arrive or right on the day.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 9, padding: '10px 14px' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>See the app experience →</span>
              </div>
            </div>

            {/* Active AI planner chat */}
            <AIPlannerPanel order={order} onAppLink={onAppLink} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function PrePurchase({ onBack }) {
  const [step, setStep]   = useState('tickets')   // 'tickets' | 'checkout' | 'confirmation'
  const [order, setOrder] = useState(null)

  return (
    <div style={{ minHeight: '100vh', minWidth: 1280, background: '#F4F6F8', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <SiteHeader
        cartCount={order ? 1 : 0}
        onCart={() => order && setStep('checkout')}
      />
      {step === 'tickets'
        ? <TicketsPage onContinue={o => { setOrder(o); setStep('checkout') }} />
        : step === 'checkout'
        ? <CheckoutPage order={order} onBack={() => setStep('tickets')} onConfirm={() => setStep('confirmation')} />
        : <ConfirmationPage order={order} onAppLink={onBack} />
      }
      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 200 }}>
        <button onClick={onBack} style={{ fontSize: 12, color: '#fff', fontWeight: 600, background: 'rgba(27,61,111,0.85)', border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 8, backdropFilter: 'blur(8px)' }}>
          ← Back to prototype
        </button>
      </div>
    </div>
  )
}
