import { useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Screen1, { PLAN } from './screens/Screen1.jsx'
import Screen2 from './screens/Screen2.jsx'
import Screen3 from './screens/Screen3.jsx'
import Screen4 from './screens/Screen4.jsx'
import PrePurchase from './screens/PrePurchase.jsx'
import { Shield, Eye, Zap } from 'lucide-react'

const ARCHETYPES = [
  { id: 'truster',      label: 'Delegator', icon: Shield },
  { id: 'configurator', label: 'Planner',   icon: Eye },
  { id: 'skeptic',      label: 'Optimizer', icon: Zap },
]

// Option A: skip Mako this morning, move to 3:30 PM — re-ordered chronologically
const UPDATED_PLAN = [
  ...PLAN.filter(i => i.name !== 'Mako' && i.name !== 'Wild Arctic' && i.name !== 'Manta'),
  { ...PLAN.find(i => i.name === 'Mako'),       time: '3:30 PM', rationale: 'Moved to afternoon — queues drop below 20 min after 3 PM.', updated: true },
  { ...PLAN.find(i => i.name === 'Wild Arctic'), time: '4:00 PM', rationale: 'Shifted to keep your afternoon flowing smoothly.', updated: true },
  { ...PLAN.find(i => i.name === 'Manta'),       time: '4:45 PM', rationale: 'Queue drops after 4 PM. Perfect closer.' },
]

export default function App() {
  const [screen, setScreen]             = useState(1)
  const [archetype, setArchetype]       = useState('configurator')
  const [onboardingDone, setOnboarding] = useState(false)
  const [bookingDone, setBookingDone]   = useState(false)
  const [plan, setPlan]                 = useState(PLAN)
  const [hasAlert, setHasAlert]         = useState(false)
  const [unlocked, setUnlocked]         = useState([1, 4])
  const [activeDay, setActiveDay]       = useState('sat')
  const [showPrePurchase, setShowPrePurchase] = useState(true)

  const handleOnboardingComplete = () => {
    setOnboarding(true)
    setUnlocked([1, 2, 3, 4])
    // Fire disruption alert after 3s — Saturday only
    const day = activeDay
    setTimeout(() => { if (day === 'sat') setHasAlert(true) }, 3000)
  }

  const handlePlanUpdate = () => {
    setHasAlert(false)
    setPlan(UPDATED_PLAN)
    setTimeout(() => setScreen(1), 600)
  }

  const handleSetScreen = (s) => {
    if (unlocked.includes(s)) {
      setScreen(s)
      if (s === 2) setHasAlert(false)
    }
  }

  if (showPrePurchase) {
    return <PrePurchase onBack={() => setShowPrePurchase(false)} />
  }

  return (
    <div className="flex flex-col items-center gap-3 min-h-screen py-6 px-4">
      {/* Presenter controls — outside phone */}
      <div className="flex items-center gap-3">
        {/* Archetype switcher */}
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-2xl px-3 py-2 border border-white/30">
          {ARCHETYPES.map(a => {
            const Icon = a.icon
            const active = archetype === a.id
            return (
              <button
                key={a.id}
                onClick={() => setArchetype(a.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${active ? 'bg-white text-sw-navy shadow' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                <Icon size={12} />
                {a.label}
              </button>
            )
          })}
        </div>
        {/* Journey map link */}
        <a
          href="/journey-map.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-2xl px-4 py-2 border border-white/30 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/30 transition-all duration-200 whitespace-nowrap"
        >
          Journey map →
        </a>
        {/* Pre-purchase desktop view */}
        <button
          onClick={() => setShowPrePurchase(true)}
          className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-2xl px-4 py-2 border border-white/30 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/30 transition-all duration-200 whitespace-nowrap"
        >
          Pre-purchase →
        </button>
      </div>

      {/* Phone shell */}
      <div className="phone-shell">
        {/* Status bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-3 pb-1 bg-white">
          <span className="text-[12px] font-bold text-sw-navy">
            {screen === 1 ? '9:00' : screen === 2 ? '11:02' : screen === 3 ? '1:48' : '9:00'}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[3,5,7,9].map((h,i) => <div key={i} className="w-1 rounded-sm bg-sw-navy" style={{ height: `${h}px` }} />)}
            </div>
            <div className="w-5 h-2.5 border-2 border-sw-navy rounded-sm p-0.5">
              <div className="w-3 h-full bg-sw-navy rounded-[1px]" />
            </div>
          </div>
        </div>

        <Header screen={screen} onAlert={() => handleSetScreen(2)} />

        {/* Alert banner on Plan tab when disruption fires */}
        {screen === 1 && onboardingDone && hasAlert && (
          <button
            onClick={() => handleSetScreen(2)}
            className="flex-shrink-0 flex items-center gap-3 bg-orange-50 border-y border-orange-200 px-4 py-2.5 w-full text-left animate-slide-up"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
            <p className="text-xs font-semibold text-orange-700 flex-1">Things have shifted — tap to see changes</p>
            <span className="text-xs text-sw-teal font-bold">Live →</span>
          </button>
        )}

        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative bg-sw-bg">
          <div className={`absolute inset-0 bg-sw-bg transition-opacity duration-250 ${screen === 1 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <Screen1
              onboardingDone={onboardingDone}
              onOnboardingComplete={handleOnboardingComplete}
              plan={plan}
              bookingDone={bookingDone}
              setBookingDone={setBookingDone}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
            />
          </div>
          <div className={`absolute inset-0 bg-sw-bg transition-opacity duration-250 ${screen === 2 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            {unlocked.includes(2) && <Screen2 archetype={archetype} onPlanUpdate={handlePlanUpdate} />}
          </div>
          <div className={`absolute inset-0 bg-white transition-opacity duration-250 ${screen === 3 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            {unlocked.includes(3) && <Screen3 isActive={screen === 3} />}
          </div>
          <div className={`absolute inset-0 bg-sw-bg transition-opacity duration-250 ${screen === 4 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <Screen4 archetype={archetype} setArchetype={setArchetype} />
          </div>
        </div>

        <BottomNav screen={screen} setScreen={handleSetScreen} unlockedScreens={unlocked} hasAlert={hasAlert} />
      </div>
    </div>
  )
}
