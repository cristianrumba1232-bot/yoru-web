// ── SECTION ICONS — line art, minimal ──
const IconRoll = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="8"/>
    <line x1="12" y1="16" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="8" y2="12"/>
    <line x1="16" y1="12" x2="22" y2="12"/>
  </svg>
)

const IconFlame = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
  </svg>
)

const IconBowl = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20c5.523 0 10-2.686 10-6H2c0 3.314 4.477 6 10 6z"/>
    <path d="M2 14c0-4 4.477-8 10-8s10 4 10 8"/>
    <line x1="12" y1="6" x2="12" y2="3"/>
  </svg>
)

const IconCone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21L5 8h14z"/>
    <path d="M5 8Q12 4 19 8"/>
  </svg>
)

const IconNigiri = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="13" width="14" height="6" rx="3"/>
    <path d="M5 14c0-3 3-6 7-6s7 3 7 6"/>
  </svg>
)

const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

const IconCrown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 20h20M5 20L3 7l5 5 4-8 4 8 5-5-2 13z"/>
  </svg>
)

const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

// ── DATA ──
const makis = [
  {
    nombre: 'Acevichado',
    tag: 'Clásico',
    tagType: 'gold',
    desc: 'Langostino furai, palta',
    cobertura: 'Cobertura de atún + salsa acevichada',
  },
  {
    nombre: 'Ebi Furai',
    tag: 'Popular',
    tagType: 'neutral',
    desc: 'Langostino empanizado, palta',
    cobertura: 'Cobertura crocante',
  },
  {
    nombre: 'Teriyaki Chicken',
    tag: 'Accesible',
    tagType: 'neutral',
    desc: 'Pollo empanizado, queso crema, palta',
    cobertura: 'Salsa teriyaki',
  },
  {
    nombre: 'Antiku Roll',
    tag: 'Exclusivo',
    tagType: 'borgona',
    desc: 'Langostino furai, palta, queso crema',
    cobertura: 'Cobertura de salmón + salsa anticuchera ligera',
  },
  {
    nombre: 'Imperial Roll',
    tag: 'Premium',
    tagType: 'gold',
    desc: 'Langostino furai, queso crema, palta',
    cobertura: 'Cobertura de salmón — salsa imperial + anguila, flameado',
  },
]

const wings = [
  {
    nombre: 'Anticucheras',
    desc: 'Glaseadas con salsa anticuchera peruana',
  },
  {
    nombre: 'Sriracha Honey',
    desc: 'Picante dulce equilibrado',
  },
  {
    nombre: 'BBQ Ahumadas',
    desc: 'Salsa BBQ con perfil ahumado',
  },
]

const bowls = [
  {
    nombre: 'Bowl Acevichado de Salmón',
    desc: 'Arroz, salmón fresco, palta, chalaquita',
    salsa: 'Salsa acevichada',
  },
  {
    nombre: 'Bowl Teriyaki de Langostino',
    desc: 'Arroz, langostino crocante, palta',
    salsa: 'Salsa teriyaki',
  },
]

const nigiris = [
  {
    nombre: 'Nigiri Flambé de Salmón',
    desc: 'Salmón flameado — toque de salsa tare + ajonjolí',
  },
  {
    nombre: 'Nigiri Clásico',
    desc: 'Selección del chef sobre arroz sazonado',
  },
]

const temakis = [
  {
    nombre: 'Temaki Acevichado',
    desc: 'Langostino furai, palta, arroz — salsa acevichada',
  },
]

const combos = [
  {
    nombre: 'Combo Clásico',
    icon: <IconFlame />,
    desc: '2 makis + 2 bebidas',
  },
  {
    nombre: 'Combo Mix',
    icon: <IconRoll />,
    desc: '1 maki + 6 wings nikkei',
  },
  {
    nombre: 'Combo Premium',
    icon: <IconCrown />,
    desc: 'Imperial + Antiku + 2 bebidas',
  },
  {
    nombre: 'Box Nikkei',
    icon: <IconBox />,
    desc: '3 makis a elegir + 6 wings nikkei',
  },
]

// ── COMPONENTS ──
function Seccion({ titulo, subtitulo, icon, children }) {
  return (
    <div className="menu-seccion">
      <div className="menu-seccion-header">
        <h2>
          {icon && <span className="seccion-icon">{icon}</span>}
          {titulo}
        </h2>
        {subtitulo && <p className="menu-seccion-sub">{subtitulo}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Menu() {
  return (
    <div className="page menu-page">
      <div className="menu-page-hero">
        <h1>Carta Oficial</h1>
        <p>Nikkei Fusión — Fase 1</p>
      </div>

      <Seccion titulo="Makis" subtitulo="6 u 8 piezas por roll" icon={<IconRoll />}>
        <div className="menu-grid">
          {makis.map(m => (
            <div className="menu-card" key={m.nombre}>
              <span className={`menu-tag menu-tag--${m.tagType}`}>{m.tag}</span>
              <h3>{m.nombre}</h3>
              <p>{m.desc}</p>
              <p className="cobertura">{m.cobertura}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Wings Nikkei" subtitulo="Presentaciones: 6 o 12 unidades" icon={<IconFlame />}>
        <div className="menu-grid menu-grid--3">
          {wings.map(w => (
            <div className="menu-card" key={w.nombre}>
              <h3>{w.nombre}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Bowls Nikkei" icon={<IconBowl />}>
        <div className="menu-grid menu-grid--2">
          {bowls.map(b => (
            <div className="menu-card" key={b.nombre}>
              <h3>{b.nombre}</h3>
              <p>{b.desc}</p>
              <p className="cobertura">{b.salsa}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <div className="menu-row-2">
        <Seccion titulo="Temaki" icon={<IconCone />}>
          <div className="menu-grid menu-grid--1">
            {temakis.map(t => (
              <div className="menu-card" key={t.nombre}>
                <h3>{t.nombre}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Nigiri" icon={<IconNigiri />}>
          <div className="menu-grid menu-grid--1">
            {nigiris.map(n => (
              <div className="menu-card" key={n.nombre}>
                <h3>{n.nombre}</h3>
                <p>{n.desc}</p>
              </div>
            ))}
          </div>
        </Seccion>
      </div>

      <Seccion titulo="Combos" subtitulo="La clave de ventas" icon={<IconBox />}>
        <div className="menu-grid">
          {combos.map(c => (
            <div className="menu-card menu-card--combo" key={c.nombre}>
              <span className="combo-icon">{c.icon}</span>
              <h3>{c.nombre}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </Seccion>
    </div>
  )
}
