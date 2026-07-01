import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import CalendarioAdmin from '../components/CalendarioAdmin'

const ZONAS = ['Todas', 'Salón', 'Zona Zen', 'Zona Sofás', 'Cuarto Privado Nikkei']

const ZONA_CLASS = {
  'Salón':                 'zona--salon',
  'Zona Zen':              'zona--zen',
  'Zona Sofás':            'zona--sofas',
  'Cuarto Privado Nikkei': 'zona--privado',
}

function formatFecha(fechaStr) {
  const [y, m, d] = fechaStr.split('-')
  const dias  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const fecha = new Date(Number(y), Number(m) - 1, Number(d))
  return `${dias[fecha.getDay()]} ${d} ${meses[Number(m) - 1]} ${y}`
}

function hoyISO() {
  return new Date().toISOString().split('T')[0]
}

function puedeVerBotonLlego(fecha, hora, now) {
  const reserva = new Date(`${fecha}T${hora.substring(0, 5)}:00`)
  return (reserva - now) / 60000 <= 30
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [reservas, setReservas]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroZona, setFiltroZona]   = useState('Todas')
  const [admin, setAdmin]             = useState(null)
  const [now, setNow]                 = useState(new Date())
  const [tab, setTab]                 = useState('reservas') // 'reservas' | 'historial'
  const [archivando, setArchivando]   = useState({})
  const [calKey, setCalKey]           = useState(0)
  const intervalosRef                 = useRef({})

  // Reloj cada minuto para actualizar alertas y botón llegó
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => { Object.values(intervalosRef.current).forEach(clearInterval) }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin')
      else setAdmin(data.session.user.email)
    })
  }, [navigate])

  useEffect(() => {
    async function fetchReservas() {
      setLoading(true)
      let query = supabase
        .from('reservas')
        .select('*')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true })

      if (filtroFecha) query = query.eq('fecha', filtroFecha)
      if (filtroZona !== 'Todas') query = query.eq('zona', filtroZona)

      const { data, error } = await query
      if (!error) setReservas(data || [])
      setLoading(false)
    }
    fetchReservas()
  }, [filtroFecha, filtroZona])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  async function handleCancelar(id) {
    const { error } = await supabase.from('reservas').update({ estado: 'cancelada' }).eq('id', id)
    if (!error) { setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r)); setCalKey(k => k + 1) }
  }

  async function handleLlego(id) {
    const { error } = await supabase.from('reservas').update({ estado: 'llegó' }).eq('id', id)
    if (!error) {
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'llegó' } : r))
      setCalKey(k => k + 1)
      setArchivando(prev => ({ ...prev, [id]: 15 }))

      intervalosRef.current[id] = setInterval(() => {
        setArchivando(prev => {
          const seg = prev[id]
          if (seg === undefined) return prev
          if (seg <= 1) {
            clearInterval(intervalosRef.current[id])
            delete intervalosRef.current[id]
            const { [id]: _, ...rest } = prev
            return rest
          }
          return { ...prev, [id]: seg - 1 }
        })
      }, 1000)
    }
  }

  async function handleDeshacer(id) {
    if (intervalosRef.current[id]) {
      clearInterval(intervalosRef.current[id])
      delete intervalosRef.current[id]
    }
    setArchivando(prev => { const { [id]: _, ...rest } = prev; return rest })

    const { error } = await supabase.from('reservas').update({ estado: 'pendiente' }).eq('id', id)
    if (!error) { setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'pendiente' } : r)); setCalKey(k => k + 1) }
  }

  function estaArchivada(r) {
    if (r.estado === 'llegó') return archivando[r.id] === undefined
    if (r.estado === 'cancelada') {
      const limite = new Date(`${r.fecha}T${r.hora.substring(0, 5)}:00`)
      limite.setMinutes(limite.getMinutes() + 15)
      return now >= limite
    }
    return false
  }

  const reservasActivas   = reservas.filter(r => !estaArchivada(r))
  const reservasHistorial = reservas.filter(r => estaArchivada(r))

  const listaPrincipal = tab === 'reservas' ? reservasActivas : reservasHistorial

  const agrupadas = listaPrincipal.reduce((acc, r) => {
    if (!acc[r.fecha]) acc[r.fecha] = []
    acc[r.fecha].push(r)
    return acc
  }, {})

  const contadorAlerta = reservasActivas.filter(r => {
    const horaPassada = new Date(`${r.fecha}T${r.hora.substring(0, 5)}:00`) < now
    return r.estado === 'pendiente' && horaPassada && !archivando[r.id]
  }).length

  return (
    <div className="admin-wrap">

      <header className="admin-header">
        <div className="admin-header-left">
          <img src="/logos/isotipo-color.png" alt="YORU" className="admin-logo-mark" />
          <div>
            <p className="admin-header-title">Panel de Reservas</p>
            <p className="admin-header-sub">YORU Nikkei Experience</p>
          </div>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">{admin}</span>
          <button className="admin-logout" onClick={() => navigate('/')}>Ir al sitio</button>
          <button className="admin-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      {/* ── Calendario ── */}
      <CalendarioAdmin
        diaSeleccionado={filtroFecha}
        onDiaClick={fecha => { setFiltroFecha(fecha); setTab('reservas') }}
        refreshKey={calKey}
      />

      {/* ── Filtros ── */}
      <div className="admin-filtros">
        <div className="admin-filtro-acciones">
          <button
            className={`admin-filtro-btn${filtroFecha === hoyISO() ? ' admin-filtro-btn--active' : ''}`}
            onClick={() => { setFiltroFecha(hoyISO()); setTab('reservas') }}
          >
            Hoy
          </button>
          <button
            className={`admin-filtro-btn${!filtroFecha ? ' admin-filtro-btn--active' : ''}`}
            onClick={() => setFiltroFecha('')}
          >
            Todas las fechas
          </button>
        </div>

        <div className="admin-filtro-group">
          <label htmlFor="f-zona">Zona</label>
          <select id="f-zona" value={filtroZona} onChange={e => setFiltroZona(e.target.value)}>
            {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>

        <div className="admin-stat">
          <span className="admin-stat-num">{reservas.length}</span>
          <span className="admin-stat-label">reserva{reservas.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── Tabs + leyenda de zonas ── */}
      <div className="admin-tabs">
        <button
          className={`admin-tab${tab === 'reservas' ? ' admin-tab--active' : ''}`}
          onClick={() => setTab('reservas')}
        >
          Reservas
          {contadorAlerta > 0 && <span className="admin-tab-badge">{contadorAlerta}</span>}
        </button>
        <button
          className={`admin-tab${tab === 'historial' ? ' admin-tab--active' : ''}`}
          onClick={() => setTab('historial')}
        >
          Historial
          {reservasHistorial.length > 0 && (
            <span className="admin-tab-badge admin-tab-badge--llego">{reservasHistorial.length}</span>
          )}
        </button>

        <div className="admin-zona-leyenda">
          <span className="admin-zona-dot zona--salon"  />Salón
          <span className="admin-zona-dot zona--zen"    />Zona Zen
          <span className="admin-zona-dot zona--sofas"  />Zona Sofás
          <span className="admin-zona-dot zona--privado"/>Cuarto Privado
        </div>
      </div>

      {/* ── Lista ── */}
      <main className="admin-main">
        {loading ? (
          <p className="admin-empty">Cargando reservas...</p>
        ) : listaPrincipal.length === 0 ? (
          <p className="admin-empty">
            {tab === 'historial' ? 'El historial está vacío.' : 'No hay reservas para los filtros seleccionados.'}
          </p>
        ) : (
          Object.entries(agrupadas).map(([fecha, items]) => {
            // Agrupar por hora
            const porHora = items.reduce((acc, r) => {
              const h = r.hora.substring(0, 5)
              if (!acc[h]) acc[h] = []
              acc[h].push(r)
              return acc
            }, {})

            return (
            <div key={fecha} className="admin-dia">
              <h2 className="admin-dia-titulo">{formatFecha(fecha)}</h2>

              {Object.entries(porHora).map(([hora, reservasHora]) => (
                <div key={hora} className="admin-hora-grupo">
                  <div className="admin-hora-label">
                    <span className="admin-hora-linea" />
                    <span className="admin-hora-texto">{hora}</span>
                    <span className="admin-hora-linea" />
                  </div>
                  <div className="admin-cards">
                {reservasHora.map(r => {
                  const cancelada     = r.estado === 'cancelada'
                  const llego         = r.estado === 'llegó'
                  const pendiente     = !cancelada && !llego
                  const enCountdown   = archivando[r.id] !== undefined
                  const horaPassada   = new Date(`${r.fecha}T${r.hora.substring(0, 5)}:00`) < now
                  const sinActualizar = pendiente && horaPassada && !enCountdown
                  const mostrarLlego  = pendiente && puedeVerBotonLlego(r.fecha, r.hora, now)

                  return (
                    <div
                      key={r.id}
                      className={[
                        'admin-card',
                        ZONA_CLASS[r.zona] || '',
                        cancelada             ? 'admin-card--cancelada'  : '',
                        llego && !enCountdown ? 'admin-card--llego'      : '',
                        sinActualizar         ? 'admin-card--alerta'     : '',
                        enCountdown           ? 'admin-card--archivando' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      <div className="admin-card-hora">
                        {r.hora}
                        {sinActualizar && (
                          <span className="admin-card-alerta-icon" title="Hora pasada — actualiza el estado">!</span>
                        )}
                      </div>

                      <div className="admin-card-body">
                        <div className="admin-card-nombre-row">
                          <p className="admin-card-nombre">{r.nombre}</p>
                          {cancelada    && <span className="admin-badge admin-badge--cancelada">Cancelada</span>}
                          {llego && !enCountdown && <span className="admin-badge admin-badge--llego">✓ Llegó</span>}
                          {sinActualizar && <span className="admin-badge admin-badge--alerta">! Pendiente de actualizar</span>}
                        </div>
                        <div className="admin-card-meta">
                          <span>📞 {r.telefono}</span>
                          <span>👥 {r.personas} {r.personas === 1 ? 'persona' : 'personas'}</span>
                          <span className="admin-card-zona">{r.zona}</span>
                          {r.mesa && <span className="admin-card-mesa">🪑 {r.mesa}</span>}
                        </div>
                        {r.platos && <p className="admin-card-platos">🍱 {r.platos}</p>}

                        {enCountdown && (
                          <p className="admin-card-countdown">
                            Se archivará en {archivando[r.id]}s...
                          </p>
                        )}
                      </div>

                      <div className="admin-card-footer">
                        <span className="admin-card-fecha-registrada">
                          Registrada {new Date(r.created_at).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                        <div className="admin-card-acciones">
                          {(cancelada || llego) && (
                            <button className="admin-btn-deshacer" onClick={() => handleDeshacer(r.id)}>
                              Deshacer
                            </button>
                          )}
                          {mostrarLlego && (
                            <button className="admin-btn-llego" onClick={() => handleLlego(r.id)}>
                              ✓ Llegó
                            </button>
                          )}
                          {pendiente && !enCountdown && (
                            <button className="admin-btn-cancelar" onClick={() => handleCancelar(r.id)}>
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                  </div>
                </div>
              ))}
            </div>
          )
          })
        )}
      </main>
    </div>
  )
}
