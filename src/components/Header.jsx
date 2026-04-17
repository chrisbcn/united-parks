import { Lock } from 'lucide-react'

const TIMES = { 1: '9:00 AM', 2: '11:02 AM', 3: '1:48 PM' }

export default function Header({ screen, countdown, onAlert, planReady }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-sw-border flex-shrink-0">
      <div>
        <p className="text-[11px] text-sw-muted uppercase tracking-widest font-medium">SeaWorld Orlando</p>
        <p className="text-sm font-semibold text-sw-navy mt-0.5">{TIMES[screen]}</p>
      </div>
      {planReady && (
        <button
          onClick={screen === 2 ? onAlert : undefined}
          className="flex items-center gap-1.5 bg-sw-teal/10 border border-sw-teal/30 rounded-full px-3 py-1.5"
        >
          <Lock size={11} className="text-sw-teal" strokeWidth={2.5} />
          <span className="text-xs font-semibold text-sw-tealDark">Orca Encounter</span>
          {screen === 3 && countdown
            ? <span className="text-xs text-sw-teal ml-0.5">· {countdown}</span>
            : <span className="text-xs text-sw-teal ml-0.5">· 2:00 PM</span>
          }
        </button>
      )}
    </div>
  )
}
