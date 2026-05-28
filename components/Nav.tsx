import MayoMark from './MayoMark'

interface NavProps {
  cartCount: number
  onOpenCart: () => void
}

export default function Nav({ cartCount, onOpenCart }: NavProps) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-logo">
          <MayoMark />
          <span>MAYO</span>
          <em className="nav-tag">A Burger Experience</em>
        </a>
        <div className="nav-spacer" />
        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#info">Dove siamo</a>
          <a href="#info">Orari</a>
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
