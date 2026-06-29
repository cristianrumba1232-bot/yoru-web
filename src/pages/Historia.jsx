import PageTransition, { FadeInSection } from '../components/PageTransition'

const IsotipoLarge = () => (
  <img
    src="/logos/isotipo-color.png"
    alt="YORU isotipo — las dos lunas"
    className="historia-isotipo"
  />
)

const keywords = [
  'Nocturno', 'Relajante', 'Experiencial', 'Moderno',
  'Acogedor', 'Visual', 'Aspiracional', 'Compartible',
]

export default function Historia() {
  return (
    <PageTransition>
      <div className="page historia-page">

        {/* ── HERO ── */}
        <div className="historia-hero">
          <p className="historia-hero-label">夜 · La Marca</p>
          <h1>La noche, servida.</h1>
        </div>

        {/* ── CONCEPTO ── */}
        <FadeInSection className="historia-seccion historia-seccion--concepto">
          <div className="historia-inner">
            <div className="historia-texto">
              <h2>El origen</h2>
              <p>
                YORU (夜) significa "noche" en japonés. La marca nace de la experiencia
                nocturna: la calma, la buena mesa y los momentos que se comparten
                cuando cae la luz.
              </p>
              <p>
                Una experiencia nikkei moderna, aspiracional y accesible. No un
                restaurante tradicional ni un lujo intimidante — un lugar bonito,
                memorable y diferente.
              </p>
            </div>
            <IsotipoLarge />
          </div>
        </FadeInSection>

        {/* ── LA FUSIÓN ── */}
        <FadeInSection className="historia-seccion historia-seccion--fusion">
          <div className="historia-inner historia-inner--center">
            <div className="historia-divider">
              <span />
              <p className="historia-label-small">Perú · Japón</p>
              <span />
            </div>
            <h2>La fusión</h2>
            <p>
              Cuando Perú y Japón se encuentran en la mesa, nace algo que no se puede
              describir del todo — pero que siempre se quiere repetir.
            </p>
            <p>
              La base peruana sostiene. Lo nikkei la matiza. El resultado es YORU:
              donde el sabor tiene profundidad, el ambiente tiene alma y cada noche
              tiene algo nuevo que contar.
            </p>
          </div>
        </FadeInSection>

        {/* ── PERSONALIDAD ── */}
        <FadeInSection className="historia-seccion historia-seccion--keywords">
          <div className="historia-inner historia-inner--center">
            <p className="historia-label-small">Nuestra esencia</p>
            <div className="historia-keywords">
              {keywords.map(k => (
                <span key={k} className="historia-keyword">{k}</span>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* ── QUOTE ── */}
        <FadeInSection className="historia-seccion historia-seccion--quote">
          <div className="historia-inner historia-inner--center">
            <blockquote className="historia-quote">
              "Qué bonito se siente este lugar.<br />
              Es diferente a todo. Quiero volver."
            </blockquote>
            <p className="historia-quote-sub">El sentimiento que buscamos.</p>
          </div>
        </FadeInSection>

      </div>
    </PageTransition>
  )
}
