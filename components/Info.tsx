import React from 'react'
import type { HoursEntry, SiteInfo } from '@/lib/types'

interface InfoProps {
  hours: HoursEntry[]
  info: SiteInfo
}

function formatSlots(entry: HoursEntry): string {
  if (entry.closed || !entry.slots?.length) return 'Chiuso'
  return entry.slots.map((s) => `${s.open} — ${s.close}`).join(' · ')
}

export default function Info({ hours, info }: InfoProps) {
  return (
    <section className="info" id="info">
      <div className="info-inner">
        <div>
          <h2>
            <span className="out">DOVE</span><br />
            CI TROVI
          </h2>
          <p>
            Smasheria di Lamezia Terme. Vieni a mangiare in loco, ordina d&apos;asporto via WhatsApp
            o ricevi a casa con Deliveroo. Ordine minimo &euro;{info.minOrder.toFixed(2)}.
          </p>
          <p style={{ marginTop: 16 }}>
            <a className="info-ig" href={info.igUrl} target="_blank" rel="noreferrer">
              @{info.instagram} ↗
            </a>
          </p>
        </div>
        <div className="info-card">
          <div className="info-card-row">
            <span className="label">Indirizzo</span>
            <span className="value">{info.address}<br />{info.city}</span>
          </div>
          <div className="info-card-row">
            <span className="label">Chiama</span>
            <span className="value">
              <a href={`tel:${info.phoneRaw}`}>{info.phone}</a>
            </span>
          </div>
          <div className="info-card-row">
            <span className="label">Orari</span>
            <div className="hours-grid">
              {hours.map((h) => (
                <React.Fragment key={h.day}>
                  <span className={`day ${h.closed ? 'closed' : ''}`}>{h.day}</span>
                  <span className="time">{formatSlots(h)}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
