interface MarqueeProps {
  items: string[]
}

export default function Marquee({ items }: MarqueeProps) {
  const content = (
    <>
      {items.map((t, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 36 }}>
          <span>{t}</span>
          <span className="dot" />
        </span>
      ))}
    </>
  )
  return (
    <div className="marquee">
      <div className="marquee-track">
        {content}{content}
      </div>
    </div>
  )
}
