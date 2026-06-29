import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const ZONAS = ['Salón', 'Zona Zen', 'Zona Sofás', 'Cuarto Privado Nikkei']
const HORAS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30']

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function getMinDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

const INIT = { nombre: '', telefono: '', personas: '2', zona: '', fecha: '', hora: '', platos: '' }

export default function ReservaModal({ onClose }) {
  const [form, setForm] = useState(INIT)
  const [fechaError, setFechaError] = useState('')
  const [status, setStatus] = useState('idle')

  // Bloquea el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'fecha' && value) {
      const d = new Date(value + 'T12:00:00')
      if (d.getDay() === 2) {
        setFechaError('No abrimos los martes. Por favor elige otro día.')
        setForm(prev => ({ ...prev, fecha: '' }))
        return
      }
      setFechaError('')
    }
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fecha) return
    setStatus('loading')
    const { error } = await supabase.from('reservas').insert([{
      nombre: form.nombre,
      telefono: form.telefono,
      personas: Number(form.personas),
      zona: form.zona,
      fecha: form.fecha,
      hora: form.hora,
      platos: form.platos || null,
    }])
    setStatus(error ? 'error' : 'success')
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <IconClose />
        </button>

        {status === 'success' ? (
          <div className="modal-success">
            <p className="modal-success-kanji">夜</p>
            <h3>Reserva recibida</h3>
            <p>Nos pondremos en contacto para confirmarla. Hasta pronto.</p>
            <button className="btn btn--full" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <p className="modal-label">夜 · Reservas</p>
              <h2>Reserva tu mesa</h2>
            </div>
            <form className="reserva-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="r-nombre">Nombre</label>
                  <input id="r-nombre" name="nombre" required placeholder="Tu nombre completo" value={form.nombre} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="r-tel">Teléfono</label>
                  <input id="r-tel" name="telefono" required placeholder="+51 999 999 999" value={form.telefono} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="r-personas">Personas</label>
                  <select id="r-personas" name="personas" value={form.personas} onChange={handleChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="r-zona">Zona</label>
                  <select id="r-zona" name="zona" required value={form.zona} onChange={handleChange}>
                    <option value="">Elige una zona</option>
                    {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="r-fecha">Fecha</label>
                  <input id="r-fecha" type="date" name="fecha" required min={getMinDate()} value={form.fecha} onChange={handleChange} />
                  {fechaError && <span className="form-error-inline">{fechaError}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="r-hora">Hora</label>
                  <select id="r-hora" name="hora" required value={form.hora} onChange={handleChange}>
                    <option value="">Elige una hora</option>
                    {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="r-platos">
                  Platos de interés <span className="form-optional">(opcional)</span>
                </label>
                <textarea id="r-platos" name="platos" rows="2" placeholder="Ej: Imperial Roll, Bowl Acevichado..." value={form.platos} onChange={handleChange} />
              </div>
              {status === 'error' && (
                <p className="form-error">Hubo un error al enviar. Intenta de nuevo o escríbenos al Instagram.</p>
              )}
              <button type="submit" className="btn btn--full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Enviando...' : 'Confirmar reserva'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
