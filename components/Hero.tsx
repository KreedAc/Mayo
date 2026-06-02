import type { HeroBanner } from '@/lib/types'

interface HeroProps {
  banner: HeroBanner
}

export default function Hero({ banner }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <h1 className="hero-title">
            <span className="smash">{banner.line1}</span>
            <span className="it">{banner.line2}</span>
          </h1>
          {banner.tagline.trim() && <p className="hero-sub">{banner.tagline}</p>}
          <div className="hero-meta">
            <span className="chip yellow">★ Since 2023</span>
          </div>
          <div className="hero-cta">
            <a href="#sec-burgers" className="btn primary">VEDI I BURGER →</a>
            <a href="#info" className="btn">DOVE TROVARCI</a>
          </div>
        </div>
      </div>
    </section>
  )
}
