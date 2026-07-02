export function DotGrid({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: 'radial-gradient(var(--dot) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    />
  )
}
