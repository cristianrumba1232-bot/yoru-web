import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Easing cinematográfico (entrada rápida, salida suave)
const EASE = [0.22, 1, 0.36, 1]

export default function ScrollExpandHero({ mediaSrc, bgImageSrc, onOpenReservas }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // BG: se mueve más lento que el scroll (efecto parallax) + zoom leve
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.07])

  // Contenido: sube suavemente y se desvanece al bajar
  const contentY       = useTransform(scrollYProgress, [0, 0.65], ['0%', '-14%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5],  [1, 0])

  // Indicador de scroll: desaparece antes que el resto
  const hintOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  return (
    <section ref={ref} className="smooth-hero">

      {/* ── Fondo con parallax ── */}
      <motion.div className="smooth-hero-bg" style={{ y: bgY, scale: bgScale }}>
        <img src={bgImageSrc || mediaSrc} alt="" />
        <div className="smooth-hero-overlay" />
      </motion.div>

      {/* ── Contenido central ── */}
      <motion.div
        className="smooth-hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Logo — entra desde abajo */}
        <motion.img
          src="/logos/lockup-crema.png"
          alt="YORU Nikkei Experience"
          className="smooth-hero-lockup"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        />

        {/* Separador decorativo */}
        <motion.div
          className="smooth-hero-divider"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
        />

        {/* Tagline */}
        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
        >
          La noche, servida.
        </motion.p>

        {/* Botones */}
        <motion.div
          className="hero-btns"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease: EASE }}
        >
          <a href="/menu" className="btn">Ver Carta</a>
          <button type="button" className="btn btn--borgona" onClick={onOpenReservas}>
            Reservas
          </button>
          <span className="btn btn--ghost-disabled">Delivery</span>
        </motion.div>

        <motion.p
          className="hero-delivery-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Delivery disponible próximamente
        </motion.p>
      </motion.div>

      {/* ── Indicador de scroll ── */}
      <motion.div className="smooth-hero-hint" style={{ opacity: hintOpacity }}>
        <span className="smooth-hero-hint-kanji">夜</span>
        <motion.div
          className="smooth-hero-hint-line"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="smooth-hero-hint-text">scroll</span>
      </motion.div>

    </section>
  )
}
