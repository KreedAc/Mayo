export default function MayoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M8 22 C8 12, 56 12, 56 22 L56 26 L8 26 Z" stroke="currentColor" strokeWidth="3" />
      <path d="M8 32 L56 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 32 C16 36, 22 32, 26 36 C30 32, 38 36, 42 32 C46 36, 52 32, 54 36" stroke="currentColor" strokeWidth="3" fill="none" />
      <rect x="8" y="40" width="48" height="6" rx="3" stroke="currentColor" strokeWidth="3" />
      <path d="M8 50 C8 56, 56 56, 56 50" stroke="currentColor" strokeWidth="3" />
      <circle cx="30" cy="44" r="2" fill="#ffe600" />
    </svg>
  )
}
