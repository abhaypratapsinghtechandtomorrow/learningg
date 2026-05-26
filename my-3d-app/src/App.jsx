import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import './App.css'


const sections = [
  {
    title: 'Kawasaki Ninja ZX-10R',
    subtitle: 'The Ultimate Superbike',
    points: [
      '998cc Inline-Four Engine',
      '203 BHP Raw Power',
      '0-100 km/h in 2.9 Seconds',
      'Top Speed: 299 km/h',
    ],
    bikeSide: -2.5,
    textSide: 'right',
  },
  {
    title: 'Circuit-Bred Chassis',
    subtitle: 'Engineered for the Track',
    points: [
      'Wind Tunnel Tested Aerodynamics',
      'Öhlins TTX36 Rear Suspension',
      'Brembo M50 Monobloc Calipers',
      'Lightweight Trellis Frame',
    ],
    bikeSide: 2.5,
    textSide: 'left',
  },
  {
    title: 'Rider Technology',
    subtitle: 'Smart. Fast. Precise.',
    points: [
      'Kawasaki Cornering Management',
      'Launch Control System',
      'Full TFT Color Display',
      'Bluetooth Connectivity',
    ],
    bikeSide: -2.5,
    textSide: 'right',
  },
]

let globalT = 0

function Bike() {
  const ref = useRef()
  const { scene } = useGLTF('/kawa.glb')
  const currentX = useRef(0)
  const currentRotY = useRef(0)

  useFrame(() => {
    const t = globalT
    const i = Math.min(Math.floor(t * sections.length), sections.length - 1)
    const targetX = sections[i].bikeSide

    currentX.current += (targetX - currentX.current) * 0.04
    currentRotY.current += (t * Math.PI * 2 - currentRotY.current) * 0.04

    ref.current.position.x = currentX.current
    ref.current.rotation.y = currentRotY.current
  })

  return <primitive ref={ref} object={scene} scale={1.5} position={[0, -1, 0]} />
}

export default function App() {
  const [scrollT, setScrollT] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const smoothT = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const t = scrollY / maxScroll
      globalT = t
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let raf
    const loop = () => {
      smoothT.current += (globalT - smoothT.current) * 0.06
      const t = smoothT.current
      setScrollT(t)

      const i = Math.min(Math.floor(t * sections.length), sections.length - 1)
      setActiveIndex(prev => {
        if (prev !== i) {
          setPrevIndex(prev)
          setAnimating(true)
          setTimeout(() => setAnimating(false), 500)
          return i
        }
        return prev
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const s = sections[activeIndex]

  return (
    <div className="app">

      {/* Scrollable height */}
      <div className="scroll-track" />

      {/* Fixed canvas */}
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <directionalLight position={[-5, 5, -5]} intensity={1} />
          <pointLight position={[0, 3, 3]} intensity={1} color="#39ff14" />
          <Bike />
        </Canvas>
      </div>

      {/* Brand */}
      <div className="brand">KAWASAKI</div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>

      {/* Section number */}
      <div className="section-number">
        0{activeIndex + 1} <span>/ 0{sections.length}</span>
      </div>

      {/* Text card */}
      <div className={`overlay ${s.textSide} ${animating ? 'fade-in' : ''}`}>
        <div className="card">
          <p className="card-subtitle">{s.subtitle}</p>
          <h2 className="card-title">{s.title}</h2>
          <div className="divider" />
          <ul className="card-list">
            {s.points.map((p, j) => (
              <li key={j}>
                <span className="dot" />
                {p}
              </li>
            ))}
          </ul>
          <div className="slide-indicator">
            {sections.map((_, idx) => (
              <span key={idx} className={`dot-indicator ${idx === activeIndex ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ height: `${scrollT * 100}%` }} />
      </div>

    </div>
  )
}