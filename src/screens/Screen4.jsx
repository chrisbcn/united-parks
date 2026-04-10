import { useState } from 'react'
import { Shield, Eye, Zap, CheckCircle, ChevronRight, User, Bell, Lock } from 'lucide-react'

const ARCHETYPES = [
  { id: 'truster',      label: 'Handle it for me',         desc: "Just act — I trust you",           icon: Shield },
  { id: 'configurator', label: 'Show me options first',    desc: "Give me the choice, I'll decide",  icon: Eye },
  { id: 'skeptic',      label: 'Walk me through everything',desc: "I want to understand before I agree", icon: Zap },
]

const PREFS = [
  { label: 'Group type', value: 'Family with teens' },
  { label: 'Must-dos', value: 'Mako, Orca Encounter, Penguin Trek' },
  { label: 'Discoveries', value: 'Yes, surprise me' },
  { label: 'Lunch window', value: 'Around 12:30' },
  { label: 'Departure', value: '5pm' },
]

export default function Screen4({ archetype, setArchetype }) {
  const [editingPrefs, setEditingPrefs] = useState(false)

  return (
    <div className="flex flex-col h-full bg-sw-bg">
      <div className="flex-shrink-0 bg-white border-b border-sw-border px-5 py-4">
        <p className="font-display text-xl font-bold text-sw-navy">Settings</p>
        <p className="text-xs text-sw-muted mt-0.5">Your concierge preferences</p>
      </div>

      <div className="flex-1 scrollable px-4 py-4 space-y-4">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-sw-border shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-full bg-sw-teal/20 border-2 border-sw-teal/30 flex items-center justify-center">
              <User size={22} className="text-sw-teal" />
            </div>
            <div>
              <p className="text-sm font-bold text-sw-navy">Guest · SeaWorld Orlando</p>
              <p className="text-xs text-sw-muted mt-0.5">Annual Pass · Adult</p>
            </div>
          </div>
        </div>

        {/* Visit preferences */}
        <div className="bg-white rounded-2xl border border-sw-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-sw-muted uppercase tracking-widest">Visit preferences</p>
            <button onClick={() => setEditingPrefs(e => !e)} className="text-xs font-semibold text-sw-teal">
              {editingPrefs ? 'Done' : 'Edit'}
            </button>
          </div>
          <div className="divide-y divide-sw-border">
            {PREFS.map(p => (
              <div key={p.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-sw-muted font-medium">{p.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-sw-navy text-right max-w-[180px]">{p.value}</span>
                  {editingPrefs && <ChevronRight size={14} className="text-sw-muted flex-shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concierge mode */}
        <div className="bg-white rounded-2xl border border-sw-border shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-sw-muted uppercase tracking-widest">If plans shift mid-day</p>
            <p className="text-[11px] text-sw-muted mt-1">How should the concierge handle it?</p>
          </div>
          <div className="divide-y divide-sw-border">
            {ARCHETYPES.map(a => {
              const Icon = a.icon
              const selected = archetype === a.id
              return (
                <button key={a.id} onClick={() => setArchetype(a.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-sw-bg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${selected ? 'bg-sw-teal text-white' : 'bg-sw-bg text-sw-muted'}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${selected ? 'text-sw-tealDark' : 'text-sw-navy'}`}>{a.label}</p>
                    <p className="text-[11px] text-sw-muted mt-0.5">{a.desc}</p>
                  </div>
                  {selected && <CheckCircle size={16} className="text-sw-teal flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-sw-border shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-sw-muted uppercase tracking-widest">Notifications</p>
          </div>
          <div className="divide-y divide-sw-border">
            {[
              { icon: Bell, label: 'Disruption alerts', sub: 'Queue spikes, slot openings', on: true },
              { icon: Lock, label: 'Booking reminders', sub: '30 min before each booking', on: true },
            ].map(n => {
              const Icon = n.icon
              return (
                <div key={n.label} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-sw-muted" />
                    <div>
                      <p className="text-sm font-semibold text-sw-navy">{n.label}</p>
                      <p className="text-[11px] text-sw-muted">{n.sub}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${n.on ? 'bg-sw-teal' : 'bg-sw-border'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${n.on ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
