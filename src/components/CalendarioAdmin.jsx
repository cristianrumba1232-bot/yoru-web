import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function nivelColor(personas) {
  if (personas === 0)  return ''
  if (personas <= 12)  return 'cal-nivel--bajo'
  if (personas <= 28)  return 'cal-nivel--medio'
  if (personas <= 50)  return 'cal-nivel--alto'
  return 'cal-nivel--lleno'
}

function fillPct(personas, max = 70) {
  return Math.min(100, Math.round((personas / max) * 100))
}

function hoyISO() {
  return new Date().toISOString().split('T')[0]
}

export default function CalendarioAdmin({ diaSeleccionado, onDiaClick, refreshKey = 0 }) {
  const [mes, setMes] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [resumen, setResumen]   = useState({})
  const [alertas, setAlertas]   = useState(new Set())
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const anio   = mes.getFullYear()
    const mesNum = mes.getMonth() + 1
    const inicio = `${anio}-${String(mesNum).padStart(2, '0')}-01`
    const ultimo = new Date(anio, mes.getMonth() + 1, 0).getDate()
    const fin    = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimo).padStart(2, '0')}`

    setCargando(true)
    supabase
      .from('reservas')
      .select('fecha, hora, personas, estado')
      .gte('fecha', inicio)
      .lte('fecha', fin)
      .then(({ data }) => {
        const r   = {}
        const al  = new Set()
        const now = new Date()

        data?.forEach(res => {
          if (!r[res.fecha]) r[res.fecha] = { reservas: 0, personas: 0, llegaron: 0, canceladas: 0 }

          if (res.estado === 'cancelada') {
            r[res.fecha].canceladas++
            return
          }

          r[res.fecha].reservas++
          r[res.fecha].personas += Number(res.personas)

          if (res.estado === 'llegó') r[res.fecha].llegaron++

          if (res.estado === 'pendiente') {
            const horaRes = new Date(`${res.fecha}T${res.hora.substring(0, 5)}:00`)
            if (horaRes < now) al.add(res.fecha)
          }
        })

        setResumen(r)
        setAlertas(al)
        setCargando(false)
      })
  }, [mes, refreshKey])

  function buildGrid() {
    const anio   = mes.getFullYear()
    const mesNum = mes.getMonth()
    const primer = new Date(anio, mesNum, 1)
    const ultimo = new Date(anio, mesNum + 1, 0)

    let offset = primer.getDay() - 1
    if (offset < 0) offset = 6

    const celdas = Array(offset).fill(null)
    for (let d = 1; d <= ultimo.getDate(); d++) {
      const fecha = `${anio}-${String(mesNum + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      celdas.push({ dia: d, fecha })
    }
    return celdas
  }

  const grid = buildGrid()
  const hoy  = hoyISO()

  function prevMes() { setMes(m => new Date(m.getFullYear(), m.getMonth() - 1, 1)) }
  function nextMes() { setMes(m => new Date(m.getFullYear(), m.getMonth() + 1, 1)) }
  function irHoy()   {
    setMes(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    onDiaClick(hoy)
  }

  const totalMesPersonas = Object.values(resumen).reduce((s, d) => s + d.personas, 0)
  const totalMesReservas = Object.values(resumen).reduce((s, d) => s + d.reservas, 0)

  return (
    <div className="cal-wrap">
      {/* ── Cabecera ── */}
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMes} aria-label="Mes anterior">‹</button>
        <div className="cal-titulo-wrap">
          <h3 className="cal-titulo">{MESES[mes.getMonth()]} {mes.getFullYear()}</h3>
          {!cargando && totalMesReservas > 0 && (
            <span className="cal-subtitulo">{totalMesReservas} res. · {totalMesPersonas} personas</span>
          )}
        </div>
        <button className="cal-nav" onClick={nextMes} aria-label="Mes siguiente">›</button>
        <button className="cal-btn-hoy" onClick={irHoy}>Hoy</button>
      </div>

      {/* ── Grid ── */}
      <div className="cal-grid">
        {DIAS.map(d => <div key={d} className="cal-dia-label">{d}</div>)}

        {grid.map((celda, i) => {
          if (!celda) return <div key={`v-${i}`} className="cal-celda cal-celda--vacia" />

          const data      = resumen[celda.fecha] || { reservas: 0, personas: 0 }
          const nivel     = nivelColor(data.personas)
          const pct       = fillPct(data.personas)
          const esHoy     = celda.fecha === hoy
          const esSel     = celda.fecha === diaSeleccionado
          const esCerrado = new Date(celda.fecha + 'T12:00:00').getDay() === 2
          const tieneAlerta = alertas.has(celda.fecha)

          return (
            <div
              key={celda.fecha}
              role="button"
              tabIndex={esCerrado ? -1 : 0}
              aria-label={`${celda.dia} - ${data.reservas} reservas`}
              className={[
                'cal-celda',
                nivel,
                esHoy       ? 'cal-celda--hoy'    : '',
                esSel       ? 'cal-celda--sel'     : '',
                esCerrado   ? 'cal-celda--cerrada' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => !esCerrado && onDiaClick(celda.fecha)}
              onKeyDown={e => e.key === 'Enter' && !esCerrado && onDiaClick(celda.fecha)}
            >
              <div className="cal-celda-top">
                <span className="cal-num">{celda.dia}</span>
                {tieneAlerta && (
                  <span className="cal-alerta-dot" title="Hay reservas pendientes de actualizar">!</span>
                )}
              </div>

              {data.personas > 0 && (
                <span className="cal-personas-count">{data.personas}p · {data.reservas} res.</span>
              )}

              {(data.llegaron > 0 || data.canceladas > 0) && (
                <div className="cal-status-row">
                  {data.llegaron   > 0 && <span className="cal-status cal-status--llego">✓{data.llegaron}</span>}
                  {data.canceladas > 0 && <span className="cal-status cal-status--cancel">✗{data.canceladas}</span>}
                </div>
              )}

              {esCerrado && <span className="cal-cerrado-label">Cerrado</span>}

              {pct > 0 && (
                <div className="cal-bar-wrap">
                  <div className="cal-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Leyenda ── */}
      <div className="cal-leyenda">
        <span className="cal-ley"><span className="cal-ley-dot cal-ley-dot--bajo"  />1–12p</span>
        <span className="cal-ley"><span className="cal-ley-dot cal-ley-dot--medio" />13–28p</span>
        <span className="cal-ley"><span className="cal-ley-dot cal-ley-dot--alto"  />29–50p</span>
        <span className="cal-ley"><span className="cal-ley-dot cal-ley-dot--lleno" />51+p</span>
        <span className="cal-ley"><span className="cal-status cal-status--llego">✓</span>Llegaron</span>
        <span className="cal-ley"><span className="cal-status cal-status--cancel">✗</span>Canceladas</span>
      </div>
    </div>
  )
}
