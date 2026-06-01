export default function MayoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 108" fill="none">
      {/* Top bun dome */}
      <path
        d="M17,52 A31,27 0 0,1 83,52"
        stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"
      />
      {/* Bottom edge of top bun */}
      <path
        d="M12,60 L88,60"
        stroke="currentColor" strokeWidth="5" strokeLinecap="round"
      />
      {/* Cheese/patty layer — bent fold shape in the middle */}
      <path
        d="M12,70 L40,70 L55,60 L70,70 L88,70"
        stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Lower edge of filling */}
      <path
        d="M12,78 L88,78"
        stroke="currentColor" strokeWidth="5" strokeLinecap="round"
      />
      {/* Bottom bun — rounded rect */}
      <path
        d="M12,84 L88,84 L88,93 Q88,99 80,99 L20,99 Q12,99 12,93 Z"
        stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Mayo drip */}
      <circle cx="77" cy="96" r="6.5" fill="#ffe600" />
      <path d="M72,99 Q70,107 77,109 Q84,107 82,99 Z" fill="#ffe600" />
    </svg>
  )
}
