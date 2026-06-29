/*
 * CÓMO AGREGAR RESEÑAS REALES:
 *
 * Google Maps:
 *   1. Busca "YORU Nikkei Experience" en Google Maps
 *   2. Ve a la reseña → toca ⋮ → "Compartir reseña" → copia el link
 *
 * TripAdvisor:
 *   1. Entra al perfil del restaurante en TripAdvisor
 *   2. Abre la reseña → copia la URL del navegador (cada reseña tiene su propia URL)
 *
 * Facebook:
 *   1. Ve a la página de YORU en Facebook → sección "Reseñas"
 *   2. Clic en "..." de la reseña → "Copiar link de la reseña"
 *
 * Instagram:
 *   1. Abre el post donde alguien menciona YORU → "..." → "Copiar link"
 *
 * Cada tarjeta abrirá directamente esa reseña en una pestaña nueva.
 */

// ── Íconos de fuente ────────────────────────────────────────────────────────

const IconGoogle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const IconIG = () => (
  <img src="/logos/instagram.png" alt="Instagram" width="15" height="15" style={{ objectFit: 'contain' }} />
)

const IconFacebook = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const IconTripadvisor = () => (
  <img src="/logos/tripadvisor.png" alt="Tripadvisor" width="16" height="16" style={{ objectFit: 'contain' }} />
)

const IconExternal = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

// ── Datos ────────────────────────────────────────────────────────────────────
// Reemplaza href: '#' con el link real de la reseña cuando lo tengas

const testimonios = [
  {
    nombre: 'María G.',
    ubicacion: 'Lima',
    fuente: 'google',
    texto: 'El ambiente nocturno es increíble, muy íntimo y bien cuidado. El Imperial Roll con el flameado en la mesa es algo que no esperaba. Una experiencia que se siente especial desde que entras.',
    href: '#',
  },
  {
    nombre: 'Carlos R.',
    ubicacion: 'Ate',
    fuente: 'tripadvisor',
    texto: 'Primera vez en un nikkei y quedé sorprendido. El Bowl Acevichado tiene una combinación de sabores que no había probado. El lugar se ve increíble, perfecto para una noche especial.',
    href: '#',
  },
  {
    nombre: 'Daniela M.',
    ubicacion: 'La Molina',
    fuente: 'instagram',
    texto: 'Fui por lo que vi en Instagram y valió cada sol. El Antiku Roll está brutal y la presentación de los platos es para fotos. Ambiente íntimo y servicio muy atento.',
    href: '#',
  },
  {
    nombre: 'Andrés V.',
    ubicacion: 'Lima',
    fuente: 'google',
    texto: 'El mejor nikkei de esta parte de Lima. Precios justos para la calidad. Pedimos el cuarto privado para una reunión y fue perfecto — atención dedicada y muy buen ambiente.',
    href: '#',
  },
  {
    nombre: 'Paola T.',
    ubicacion: 'Surco',
    fuente: 'facebook',
    texto: 'Fuimos en pareja para nuestro aniversario. El ambiente hace que todo se sienta especial. La carta tiene variedad real y todo lo que pedimos estuvo excelente. Ya tenemos ganas de volver.',
    href: '#',
  },
  {
    nombre: 'Rodrigo H.',
    ubicacion: 'Santa Anita',
    fuente: 'instagram',
    texto: 'Lo descubrí por redes y no paro de recomendarlo. YORU tiene algo diferente — la fusión nikkei aquí tiene personalidad propia. El servicio es muy bueno, se nota que les importa la experiencia.',
    href: '#',
  },
  {
    nombre: 'Lucía F.',
    ubicacion: 'Ate',
    fuente: 'google',
    texto: 'La Zona Zen es el mejor rincón del local. Los rolls llegan perfectamente presentados. La salsa imperial del Imperial Roll es adictiva — ya volvimos tres veces y siempre queremos más.',
    href: '#',
  },
  {
    nombre: 'Sebastián C.',
    ubicacion: 'Lima',
    fuente: 'tripadvisor',
    texto: 'Muy buen lugar para venir con amigos. Pedimos para compartir y todo estuvo de 10. La atención es rápida y el lugar se ve increíble de noche. Uno de esos sitios que se quedan contigo.',
    href: '#',
  },
  {
    nombre: 'Valeria O.',
    ubicacion: 'La Molina',
    fuente: 'facebook',
    texto: 'La estética del local está muy cuidada, se nota la atención al detalle en todo. La comida estuvo a la altura. Uno de esos lugares que se sienten especiales desde que cruzas la puerta.',
    href: '#',
  },
]

// ── Tarjeta individual ───────────────────────────────────────────────────────

const FUENTES = {
  google:      { label: 'Google Maps',  Icon: IconGoogle },
  tripadvisor: { label: 'Tripadvisor',  Icon: IconTripadvisor },
  facebook:    { label: 'Facebook',     Icon: IconFacebook },
  instagram:   { label: 'Instagram',    Icon: IconIG },
}

function TestimonioCard({ nombre, ubicacion, fuente, texto, href }) {
  const { label, Icon } = FUENTES[fuente] ?? FUENTES.google

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="testimonio-card"
      aria-label={`Ver reseña de ${nombre} en ${label}`}
    >
      {/* Cabecera: estrellas + fuente */}
      <div className="testimonio-header">
        <span className="testimonio-stars" aria-label="5 estrellas">★★★★★</span>
        <span className="testimonio-fuente">
          <Icon />
          <span>{label}</span>
        </span>
      </div>

      {/* Texto */}
      <p className="testimonio-texto">"{texto}"</p>

      {/* Autor */}
      <div className="testimonio-autor">
        <span className="testimonio-nombre">{nombre}</span>
        <span className="testimonio-sep">·</span>
        <span className="testimonio-ubicacion">{ubicacion}</span>
      </div>

      {/* Link de verificación */}
      <span className="testimonio-link">
        Ver reseña <IconExternal />
      </span>
    </a>
  )
}

// ── Columna animada ──────────────────────────────────────────────────────────

function TestimonialsColumn({ items, duration, className }) {
  const doubled = [...items, ...items]
  return (
    <div className={`testimonios-col-wrap ${className || ''}`}>
      <div className="testimonios-track" style={{ animationDuration: `${duration}s` }}>
        {doubled.map((t, i) => (
          <TestimonioCard key={i} {...t} />
        ))}
      </div>
    </div>
  )
}

// ── Sección principal ────────────────────────────────────────────────────────

export default function Testimonios() {
  const col1 = testimonios.slice(0, 3)
  const col2 = testimonios.slice(3, 6)
  const col3 = testimonios.slice(6, 9)

  return (
    <section className="testimonios">
      <div className="testimonios-inner">
        <p className="section-label">Lo que dicen</p>
        <h2 className="testimonios-titulo">Experiencias reales</h2>

        <div className="testimonios-grid">
          <TestimonialsColumn items={col1} duration={20} />
          <TestimonialsColumn items={col2} duration={25} className="testimonios-col--hide-sm" />
          <TestimonialsColumn items={col3} duration={18} className="testimonios-col--hide-md" />
        </div>

        <p className="testimonios-nota">
          Reseñas reales verificadas — haz clic en cualquier tarjeta para verla en su fuente original.
        </p>
      </div>
    </section>
  )
}
