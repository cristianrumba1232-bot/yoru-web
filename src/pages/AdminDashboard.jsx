import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const ZONAS = ['Todas', 'Salón', 'Zona Zen', 'Zona Sofás', 'Cuarto Privado Nikkei']

function formatFecha(fechaStr) {
  const [y, m, d] = fechaStr.split('-')
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const fecha = new Date(Number(y), Number(m) - 1, Number(d))
  return `${dias[fecha.getDay()]} ${d} ${meses[Number(m) - 1]} ${y}`
}

function hoyISO() {
  return new Date().toISOString().split('T')[0]
}

export default function AdminDashboard() {
  const navigate   = useNavigate()
  const [reservas, setReservas]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filtroFecha, setFiltroFecha] = useState(hoyISO())
  const [filtroZona, setFiltroZona]   = useState('Todas')
  const [admin, setAdmin] = useState(null)

  // Verificar sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin')
      } else {
        setAdmin(data.session.user.email)
      }
    })
  }, [navigate])

  // Cargar reservas
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

  // Agrupar por fecha para vista de días
  const agrupadas = reservas.reduce((acc, r) => {
    const key = r.fecha
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <div className="admin-wrap">

      {/* ── Header ── */}
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

      {/* ── Filtros ── */}
      <div className="admin-filtros">
        <div className="admin-filtro-group">
          <label htmlFor="f-fecha">Fecha</label>
          <input
            id="f-fecha"
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
          />
          <button
            className="admin-btn-ghost"
            onClick={() => setFiltroFecha('')}
          >
            Ver todas
          </button>
        </div>
        <div className="admin-filtro-group">
          <label htmlFor="f-zona">Zona</label>
          <select
            id="f-zona"
            value={filtroZona}
            onChange={e => setFiltroZona(e.target.value)}
          >
            {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-num">{reservas.length}</span>
          <span className="admin-stat-label">reserva{reservas.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── Lista ── */}
      <main className="admin-main">
        {loading ? (
          <p className="admin-empty">Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p className="admin-empty">No hay reservas para los filtros seleccionados.</p>
        ) : (
          Object.entries(agrupadas).map(([fecha, items]) => (
            <div key={fecha} className="admin-dia">
              <h2 className="admin-dia-titulo">{formatFecha(fecha)}</h2>
              <div className="admin-cards">
                {items.map(r => (
                  <div key={r.id} className="admin-card">
                    <div className="admin-card-hora">{r.hora}</div>
                    <div className="admin-card-body">
                      <p className="admin-card-nombre">{r.nombre}</p>
                      <div className="admin-card-meta">
                        <span>📞 {r.telefono}</span>
                        <span>👥 {r.personas} {r.personas === 1 ? 'persona' : 'personas'}</span>
                        <span className="admin-card-zona">{r.zona}</span>
                      </div>
                      {r.platos && (
                        <p className="admin-card-platos">🍱 {r.platos}</p>
                      )}
                    </div>
                    <div className="admin-card-fecha-registrada">
                      Registrada {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
