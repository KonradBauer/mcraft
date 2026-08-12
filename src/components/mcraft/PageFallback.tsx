export function PageFallback({ className = 'bg-ink' }: { className?: string }) {
  return <div className={`min-h-screen ${className}`} />
}
