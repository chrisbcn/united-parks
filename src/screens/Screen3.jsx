import mapImg from '../assets/map1.png'
import { Search, Layers } from 'lucide-react'

const FILTERS = ['Animals', 'Shows & Presentations', 'Rides', 'Dining']

export default function Screen3() {
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
        <div className="absolute bottom-6 right-4">
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
      </div>
    </div>
  )
}
