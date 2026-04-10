import { CalendarDays, Zap, Map, Settings } from 'lucide-react'

const TABS = [
  { id: 1, label: 'Plan',     icon: CalendarDays },
  { id: 2, label: 'Live',     icon: Zap },
  { id: 3, label: 'Map',      icon: Map },
  { id: 4, label: 'Settings', icon: Settings },
]

export default function BottomNav({ screen, setScreen, unlockedScreens, hasAlert }) {
  return (
    <div className="flex-shrink-0 border-t border-sw-border bg-white">
      <div className="flex">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = screen === id
          const locked = !unlockedScreens.includes(id)
          return (
            <button
              key={id}
              onClick={() => !locked && setScreen(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors duration-150
                ${active  ? 'text-sw-teal'  :
                  locked  ? 'text-sw-border cursor-not-allowed' :
                            'text-sw-muted hover:text-sw-navy'}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
              {/* Alert dot on Live tab */}
              {id === 2 && hasAlert && !active && (
                <span className="absolute top-2 right-[calc(50%-14px)] w-2 h-2 rounded-full bg-red-500" />
              )}
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-sw-teal rounded-full" />
              )}
            </button>
          )
        })}
      </div>
      <div style={{ height: 'env(safe-area-inset-bottom, 6px)' }} />
    </div>
  )
}
