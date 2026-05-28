import type { SiteInfo } from '@/lib/types'

interface FooterProps {
  info: SiteInfo
}

export default function Footer({ info }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-name">MAYO</div>
          <div className="footer-tag">a burger experience.</div>
        </div>
        <div>
          <h4>MENU</h4>
          <ul>
            <li><a href="#sec-burgers">Burger</a></li>
            <li><a href="#sec-sticks">Sticks</a></li>
            <li><a href="#sec-friggitoria">Friggitoria</a></li>
            <li><a href="#sec-spina">Birre</a></li>
          </ul>
        </div>
        <div>
          <h4>CONTATTI</h4>
          <ul>
            <li><a href={`tel:${info.phoneRaw}`}>{info.phone}</a></li>
            <li>{info.address}</li>
            <li>{info.city}</li>
          </ul>
        </div>
        <div>
          <h4>SEGUICI</h4>
          <ul>
            <li><a href={info.igUrl} target="_blank" rel="noreferrer">Instagram ↗</a></li>
            <li><a href={`https://wa.me/39${info.phoneRaw}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></li>
            <li><a href="#">Deliveroo ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MAYO · LAMEZIA TERME · P.IVA 03823970797</span>
        <span>
          <a href="/admin" style={{ color: 'var(--ink-dim)' }}>Area Admin</a>
          {' · '}Smash responsibly.
        </span>
      </div>
    </footer>
  )
}
