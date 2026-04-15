import { useState, useRef, useEffect } from 'react'
import mapImg from '../assets/map1.png'
import { Search, Layers, CheckCircle } from 'lucide-react'

const FILTERS = ['Animals', 'Shows & Presentations', 'Rides', 'Dining']

export default function Screen3({ isActive }) {
  const [nudgeState, setNudgeState] = useState('hidden') // 'hidden' | 'visible' | 'accepted' | 'dismissed'
  const timerRef = useRef(null)

  useEffect(() => {
    if (isActive && nudgeState === 'hidden') {
      timerRef.current = setTimeout(() => setNudgeState('visible'), 2000)
    }
    return () => clearTimeout(timerRef.current)
  }, [isActive])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 bg-white border-b border-sw-border">
        <div className="flex items-center gap-3 bg-sw-bg border border-sw-border rounded-full px-4 py-2.5">
          <Search size={16} className="text-sw-muted flex-shrink-0" />
          <span className="text-sm text-sw-muted">Search name of attraction</span>
        </div>
        <div className="flex gap-2 mt-2.5 overflow-x-auto scrollable pb-1">
          {FILTERS.map(f => (
            <button key={f} className="flex items-center gap-1.5 bg-sw-navy text-white text-xs font-semibold rounded-full px-3 py-1.5 flex-shrink-0 whitespace-nowrap">
              {f === 'Animals' ? '🐬' : f === 'Shows & Presentations' ? '🎭' : f === 'Rides' ? '🎢' : '🍽️'} {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <img src={mapImg} alt="SeaWorld Orlando map" className="w-full h-full object-cover object-center" />

        {/* Your location indicator */}
        <div className="absolute bottom-6 right-4" style={{ zIndex: 10 }}>
          <button className="w-10 h-10 bg-white rounded-full shadow-lg border border-sw-border flex items-center justify-center">
            <Layers size={18} className="text-sw-navy" />
          </button>
        </div>

        {/* Manta highlight (GEO scenario) */}
        <div className="absolute top-[38%] left-[52%] animate-pulse">
          <div className="w-10 h-10 rounded-full bg-sw-teal/30 border-2 border-sw-teal flex items-center justify-center shadow-lg">
            <span className="text-lg">🎢</span>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-sw-navy text-white text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
            Manta · 8 min
          </div>
        </div>

        {/* Geo nudge — visible */}
        {nudgeState === 'visible' && (
          <div className="absolute bottom-0 left-0 right-0 animate-slide-up" style={{ zIndex: 20 }}>
            <div style={{ margin: '0 12px 16px', background: '#fff', border: '1px solid #E2E6EA', borderRadius: '1rem', padding: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1B3D6F', marginBottom: '0.25rem' }}>
                📍 You're near Manta — queue just dropped to 8 min
              </p>
              <p style={{ fontSize: '0.6875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                Based on your location · Updated just now
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setNudgeState('accepted')}
                  className="btn-teal-sm"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                >
                  Yes, head there now
                </button>
                <button
                  onClick={() => setNudgeState('dismissed')}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid #E2E6EA', borderRadius: '0.5rem', background: '#fff', color: '#6B7280', fontWeight: 600, cursor: 'pointer' }}
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Geo nudge — accepted */}
        {nudgeState === 'accepted' && (
          <div className="absolute bottom-0 left-0 right-0 animate-slide-up" style={{ zIndex: 20 }}>
            <div style={{ margin: '0 12px 16px', background: '#EBF7F8', border: '1px solid rgba(0,156,166,0.3)', borderRadius: '1rem', padding: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <CheckCircle size={15} style={{ color: '#009CA6', flexShrink: 0 }} />
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#007A82' }}>
                  Got it — Manta moved to 11:15 AM
                </p>
              </div>
              <p style={{ fontSize: '0.6875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                Your plan has been updated. Head to the Manta queue now.
              </p>
              <button
                onClick={() => setNudgeState('dismissed')}
                style={{ fontSize: '0.75rem', color: '#009CA6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
