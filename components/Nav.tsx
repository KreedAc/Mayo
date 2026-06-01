interface NavProps {
  cartCount: number
  onOpenCart: () => void
}

export default function Nav({ cartCount, onOpenCart }: NavProps) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mayo-burger.png" alt="" className="nav-burger-icon" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mayo-text.png" alt="MAYO" className="nav-mayo-text" />
          <em className="nav-tag">A Burger Experience</em>
        </a>
        <div className="nav-spacer" />
        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#info">Dove siamo &amp; Orari</a>
        </div>
        <button className="nav-cart" onClick={onOpenCart}>
          <span className="nav-cart-bag" aria-hidden>☰</span>
          <span>ORDINE</span>
          <span className="nav-cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  )
}
