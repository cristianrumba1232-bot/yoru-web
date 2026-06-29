import { Link } from 'react-router-dom'
import ScrollExpandHero from '../components/ScrollExpandHero'
import Testimonios from '../components/Testimonios'

const HERO_IMG = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=80'

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconIG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const destacados = [
  {
    tag: 'Premium',
    tagType: 'gold',
    nombre: 'Imperial Roll',
    desc: 'Langostino furai, queso crema, palta',
    detalle: 'Cobertura de salmón — salsa imperial + anguila, flameado',
  },
  {
    tag: 'Exclusivo',
    tagType: 'borgona',
    nombre: 'Antiku Roll',
    desc: 'Langostino furai, palta, queso crema',
    detalle: 'Cobertura de salmón + salsa anticuchera ligera',
  },
  {
    tag: 'Favorito',
    tagType: 'neutral',
    nombre: 'Bowl Acevichado',
    desc: 'Arroz, salmón fresco, palta, chalaquita',
    detalle: 'Salsa acevichada',
  },
]

export default function Inicio({ onOpenReservas }) {
  return (
    <>
      {/* ── HERO con expansión de scroll ── */}
      <ScrollExpandHero
        mediaSrc={HERO_IMG}
        bgImageSrc={HERO_IMG}
        onOpenReservas={onOpenReservas}
      />

      {/* ── EXPERIENCIA ── */}
      <section className="experiencia">
        <div className="experiencia-inner">
          <p className="experiencia-kanji">夜</p>
          <h2>Una fusión nacida bajo la noche</h2>
          <p>
            El umami japonés y el carácter peruano, reunidos en un espacio
            diseñado para quedarse. Cada plato es una conversación entre
            dos culturas — servida cuando cae el sol.
          </p>
          <Link to="/historia" className="btn btn--ghost">Nuestra historia</Link>
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      <section className="destacados">
        <div className="destacados-inner">
          <p className="section-label">De la carta</p>
          <h2>Platos que no te puedes perder</h2>
          <div className="destacados-grid">
            {destacados.map(p => (
              <div className="destacado-card" key={p.nombre}>
                <span className={`menu-tag menu-tag--${p.tagType}`}>{p.tag}</span>
                <h3>{p.nombre}</h3>
                <p>{p.desc}</p>
                <p className="cobertura">{p.detalle}</p>
              </div>
            ))}
          </div>
          <Link to="/menu" className="btn">Ver carta completa</Link>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <Testimonios />

      {/* ── INFO RÁPIDA ── */}
      <section className="home-info">
        <div className="home-info-grid">
          <div className="home-info-item">
            <span className="home-info-icon"><IconPin /></span>
            <p className="home-info-label">Dónde estamos</p>
            <p>Paracas 481</p>
            <p>Salamanca, Ate — Lima</p>
          </div>
          <div className="home-info-item">
            <span className="home-info-icon"><IconClock /></span>
            <p className="home-info-label">Horario</p>
            <p>Todos los días excepto martes</p>
            <p>6:00 pm – 11:00 pm</p>
          </div>
          <div className="home-info-item">
            <span className="home-info-icon"><IconIG /></span>
            <p className="home-info-label">Síguenos</p>
            <a
              href="https://www.instagram.com/yorunikkei"
              target="_blank"
              rel="noreferrer"
              className="home-info-link"
            >
              @yorunikkei
            </a>
          </div>
        </div>
        <button type="button" className="btn btn--borgona home-reserva-cta" onClick={onOpenReservas}>
          Reservar una mesa
        </button>
      </section>
    </>
  )
}
