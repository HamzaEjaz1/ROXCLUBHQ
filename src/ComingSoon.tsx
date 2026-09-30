import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import './ComingSoon.css'

const TILES = [
  { src: '/bg/hyrox-rings.jpg', alt: 'Ring training', className: 'tile t1' },
  { src: '/bg/hyrox-jump.jpg', alt: 'Jump rope athlete', className: 'tile t2' },
  { src: '/bg/hyrox-box.jpg', alt: 'Boxing training', className: 'tile t3' },
  { src: '/bg/hyrox-bags.jpg', alt: 'Heavy bags', className: 'tile t4' },
  { src: '/bg/hyrox-sled.jpg', alt: 'Sled push', className: 'tile t5' },
  { src: '/bg/hyrox-ski.jpg', alt: 'Ski erg', className: 'tile t6' },
  { src: '/bg/hyrox-ropes.jpg', alt: 'Battle ropes', className: 'tile t7' },
  { src: '/bg/hyrox-wallball.jpg', alt: 'Wall balls', className: 'tile t8' },
  { src: '/bg/hyrox-run.jpg', alt: 'Arena running', className: 'tile t9' },
  { src: '/bg/hyrox-carry.jpg', alt: 'Farmers carry', className: 'tile t10' },
]

const STATIONS =
  'SLED PUSH  ·  SKI ERG  ·  SANDBAG LUNGES  ·  ROWING  ·  FARMERS CARRY  ·  WALL BALLS  ·  RUNNING  ·  BURPEE BROAD JUMPS  ·  '

const LAUNCH = new Date('2026-11-15T00:00:00')

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const diff = Math.max(0, target.getTime() - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

export default function ComingSoon() {
  const stageRef = useRef<HTMLDivElement>(null)
  const mosaicRef = useRef<HTMLDivElement>(null)
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [ready, setReady] = useState(false)

  const units = useMemo(
    () => [
      { label: 'Days', value: pad(days) },
      { label: 'Hours', value: pad(hours) },
      { label: 'Mins', value: pad(minutes) },
      { label: 'Secs', value: pad(seconds) },
    ],
    [days, hours, minutes, seconds],
  )

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const mosaic = mosaicRef.current
    if (!mosaic) return

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 24
      const y = (event.clientY / window.innerHeight - 0.5) * 18
      mosaic.style.setProperty('--px', `${x}px`)
      mosaic.style.setProperty('--py', `${y}px`)
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  function onNotify(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setJoined(true)
  }

  return (
    <main className={`stage${ready ? ' is-ready' : ''}`} ref={stageRef}>
      <div className="cinema" aria-hidden="true">
        <span className="slide s1" />
        <span className="slide s2" />
        <span className="slide s3" />
      </div>
      <div className="mosaic" ref={mosaicRef} aria-hidden="true">
        {TILES.map((tile) => (
          <figure key={tile.src} className={tile.className}>
            <img src={tile.src} alt="" />
          </figure>
        ))}
      </div>

      <div className="veil" />
      <div className="grain" />
      <div className="scan" />
      <div className="orbs">
        <span className="orb o1" />
        <span className="orb o2" />
        <span className="orb o3" />
      </div>

      <header className="topbar">
        <div className="brand-mini">
          <img src="/logo-r.png" alt="" />
          <span>ROXCLUB</span>
        </div>
        <div className="live">
          <i />
          Launching
        </div>
      </header>

      <section className="hero">
        <div className="logo-wrap">
          <span className="ring r-slow" />
          <span className="ring r-fast" />
          <span className="pulse" />
          <img className="logo" src="/logo-r.png" alt="ROXCLUB" />
        </div>

        <p className="eyebrow">Train hard · Stay Rox</p>
        <h1>
          <span className="kicker">Welcome to</span>
          <span className="wordmark">ROXCLUB</span>
        </h1>
        <p className="coming">Coming Soon</p>
        <p className="lede">
          Train in real life. Build your digital athlete. Every session builds
          your engine, your Athlete DNA and your race day.
        </p>

        <div className="clock" role="timer" aria-label="Launch countdown">
          {units.map((unit) => (
            <div className="unit" key={unit.label}>
              <strong>{unit.value}</strong>
              <span>{unit.label}</span>
            </div>
          ))}
        </div>

        <form className="notify" onSubmit={onNotify}>
          {joined ? (
            <p className="thanks">You’re on the list. We’ll call you to the start line.</p>
          ) : (
            <>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button type="submit">Notify Me</button>
            </>
          )}
        </form>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          <span>{STATIONS.repeat(2)}</span>
          <span>{STATIONS.repeat(2)}</span>
        </div>
      </div>
    </main>
  )
}
