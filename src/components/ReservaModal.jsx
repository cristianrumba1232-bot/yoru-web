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

function horaToMinutes(hora) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

// Slot válido si faltan más de 60 minutos
function isTimeAvailable(fecha, hora) {
  const now = new Date()
  const slot = new Date(`${fecha}T${hora.substring(0, 5)}:00`)
  return (slot - now) / 60000 > 60
}

function getPersonasError(zona, numPersonas) {
  if (zona === 'Cuarto Privado Nikkei') {
    if (numPersonas < 4) return 'El Cuarto Privado Nikkei requiere un mínimo de 4 personas.'
    if (numPersonas > 8) return 'El Cuarto Privado Nikkei acepta un máximo de 8 personas.'
  }
  if (zona === 'Zona Zen' && numPersonas > 4) return 'Zona Zen acepta un máximo de 4 personas.'
  if (zona === 'Zona Sofás' && numPersonas > 4) return 'Zona Sofás acepta un máximo de 4 personas.'
  if (zona === 'Salón' && numPersonas > 8) return 'El Salón acepta grupos de máximo 8 personas.'
  return null
}

// Asignación de mesa en Salón
// P1-P4: pequeñas fijas (máx 2p) · P5-P6: pequeñas flexibles (juntas = máx 4p)
// G1-G2: grandes juntables (juntas = máx 8p) · G3-G4: grandes fijas (máx 4p)
function assignMesaSalon(numPersonas, ocupadas) {
  function libre(mesa) {
    if (mesa === 'Mesa P5') return !ocupadas.has('Mesa P5') && !ocupadas.has('Mesa P5+P6')
    if (mesa === 'Mesa P6') return !ocupadas.has('Mesa P6') && !ocupadas.has('Mesa P5+P6')
    if (mesa === 'Mesa P5+P6') return !ocupadas.has('Mesa P5') && !ocupadas.has('Mesa P6') && !ocupadas.has('Mesa P5+P6')
    if (mesa === 'Mesa G1') return !ocupadas.has('Mesa G1') && !ocupadas.has('Mesa G1+G2')
    if (mesa === 'Mesa G2') return !ocupadas.has('Mesa G2') && !ocupadas.has('Mesa G1+G2')
    if (mesa === 'Mesa G1+G2') return !ocupadas.has('Mesa G1') && !ocupadas.has('Mesa G2') && !ocupadas.has('Mesa G1+G2')
    return !ocupadas.has(mesa)
  }

  if (numPersonas >= 5) {
    return libre('Mesa G1+G2') ? 'Mesa G1+G2' : null
  }
  if (numPersonas >= 3) {
    if (libre('Mesa P5+P6')) return 'Mesa P5+P6'
    for (const m of ['Mesa G3', 'Mesa G4', 'Mesa G1', 'Mesa G2']) {
      if (libre(m)) return m
    }
    return null
  }
  // 1-2 personas: pequeñas fijas primero, luego flexibles, luego grandes
  for (const m of ['Mesa P1', 'Mesa P2', 'Mesa P3', 'Mesa P4', 'Mesa P5', 'Mesa P6', 'Mesa G3', 'Mesa G4', 'Mesa G1', 'Mesa G2']) {
    if (libre(m)) return m
  }
  return null
}

// Asignación óptima de mesas en Zona Zen
// Pequeños (≤2p) → Mesa A/B primero; grandes (3-4p) → Mesa C/D
// Overflow de pequeños → Mesa C/D si quedan libres
function assignMesasZenOptimal(grupos) {
  const smallTables = ['Mesa A', 'Mesa B']
  const largeTables = ['Mesa C', 'Mesa D']

  const largeGroups = grupos.filter(g => g.personas >= 3)
  const smallGroups = [...grupos.filter(g => g.personas <= 2)].sort((a, b) => a.personas - b.personas)

  if (largeGroups.length > largeTables.length) return null
  if (grupos.length > 4) return null

  const assignment = {}
  largeGroups.forEach((g, i) => { assignment[g.id] = largeTables[i] })

  const availableForSmall = [...smallTables, ...largeTables.slice(largeGroups.length)]
  if (smallGroups.length > availableForSmall.length) return null
  smallGroups.forEach((g, i) => { assignment[g.id] = availableForSmall[i] })

  return assignment
}

function isSlotAvailable(zona, hora, numPersonas, existentes, fecha) {
  if (!isTimeAvailable(fecha, hora)) return false

  const nuevaMin = horaToMinutes(hora)
  const enVentana = existentes.filter(r => Math.abs(horaToMinutes(r.hora) - nuevaMin) < 120)

  if (zona === 'Zona Zen') {
    if (numPersonas > 4) return false
    const allGroups = [
      ...enVentana.map((r, i) => ({ id: `ex_${i}`, personas: Number(r.personas) })),
      { id: 'NEW', personas: numPersonas }
    ]
    return assignMesasZenOptimal(allGroups) !== null
  }
  if (zona === 'Cuarto Privado Nikkei') {
    if (numPersonas < 4 || numPersonas > 8) return false
    return enVentana.length === 0
  }
  if (zona === 'Zona Sofás') {
    if (numPersonas > 4) return false
    return enVentana.length < 3
  }
  if (zona === 'Salón') {
    if (numPersonas > 8) return false
    const ocupadas = new Set(enVentana.map(r => r.mesa).filter(Boolean))
    return assignMesaSalon(numPersonas, ocupadas) !== null
  }
  return true
}

async function validateAndAssign(zona, fecha, hora, personas) {
  // Corte de 1 hora
  if (!isTimeAvailable(fecha, hora)) {
    return { error: 'Solo se pueden hacer reservas con más de 1 hora de anticipación.', mesa: null, updates: [] }
  }

  const { data: existentes } = await supabase
    .from('reservas')
    .select('id, hora, personas, mesa')
    .eq('fecha', fecha)
    .eq('zona', zona)

  if (!existentes) return { error: null, mesa: null, updates: [] }

  const nuevaMin = horaToMinutes(hora)
  const enVentana = existentes.filter(r => Math.abs(horaToMinutes(r.hora) - nuevaMin) < 120)
  const numPersonas = Number(personas)

  if (zona === 'Zona Zen') {
    if (numPersonas > 4) return { error: 'Zona Zen acepta un máximo de 4 personas por mesa.', mesa: null, updates: [] }

    const NEW_ID = '__new__'
    const allGroups = [
      ...enVentana.map(r => ({ id: r.id, personas: Number(r.personas), oldMesa: r.mesa })),
      { id: NEW_ID, personas: numPersonas }
    ]

    const assignment = assignMesasZenOptimal(allGroups)
    if (!assignment) return { error: 'Zona Zen está completa en ese horario.', mesa: null, updates: [] }

    const updates = enVentana
      .filter(r => assignment[r.id] !== r.mesa)
      .map(r => ({ id: r.id, mesa: assignment[r.id] }))

    return { error: null, mesa: assignment[NEW_ID], updates }
  }

  if (zona === 'Cuarto Privado Nikkei') {
    if (numPersonas < 4) return { error: 'El Cuarto Privado requiere un mínimo de 4 personas.', mesa: null, updates: [] }
    if (numPersonas > 8) return { error: 'El Cuarto Privado acepta un máximo de 8 personas.', mesa: null, updates: [] }
    if (enVentana.length >= 1) return { error: 'El Cuarto Privado ya está reservado en ese horario.', mesa: null, updates: [] }
    return { error: null, mesa: 'Cuarto Privado', updates: [] }
  }

  if (zona === 'Zona Sofás') {
    if (numPersonas > 4) return { error: 'Zona Sofás acepta un máximo de 4 personas por reserva.', mesa: null, updates: [] }
    const mesasOcupadas = enVentana.map(r => r.mesa).filter(Boolean)
    const mesa = ['Sofá 1', 'Sofá 2', 'Sofá 3'].find(m => !mesasOcupadas.includes(m)) ||
      `Sofá ${enVentana.length + 1}`
    if (enVentana.length >= 3) return { error: 'Los sofás están completos en ese horario.', mesa: null, updates: [] }
    return { error: null, mesa, updates: [] }
  }

  if (zona === 'Salón') {
    if (numPersonas > 8) return { error: 'El Salón acepta grupos de máximo 8 personas.', mesa: null, updates: [] }
    const ocupadas = new Set(enVentana.map(r => r.mesa).filter(Boolean))
    const mesa = assignMesaSalon(numPersonas, ocupadas)
    if (!mesa) return { error: 'No hay mesas disponibles en el Salón en ese horario.', mesa: null, updates: [] }
    return { error: null, mesa, updates: [] }
  }

  return { error: null, mesa: null, updates: [] }
}

const INIT = { nombre: '', telefono: '', email: '', personas: '2', zona: '', fecha: '', hora: '', platos: '' }

export default function ReservaModal({ onClose }) {
  const [form, setForm] = useState(INIT)
  const [fechaError, setFechaError] = useState('')
  const [personasError, setPersonasError] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [disponibilidad, setDisponibilidad] = useState([])
  const [checkingDisp, setCheckingDisp] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!form.zona || !form.fecha) {
      setDisponibilidad([])
      return
    }

    let cancelled = false

    async function loadDisponibilidad() {
      setCheckingDisp(true)
      setForm(prev => ({ ...prev, hora: '' }))

      const { data: existentes } = await supabase
        .from('reservas')
        .select('hora, personas, mesa')
        .eq('fecha', form.fecha)
        .eq('zona', form.zona)

      if (cancelled) return

      const reservas = existentes || []
      const numPersonas = Number(form.personas)

      const personasErr = getPersonasError(form.zona, numPersonas)
      if (personasErr) {
        setPersonasError(personasErr)
        setFechaError('')
        setDisponibilidad([])
        setCheckingDisp(false)
        return
      }
      setPersonasError('')

      const slots = HORAS.map(hora => ({
        hora,
        disponible: isSlotAvailable(form.zona, hora, numPersonas, reservas, form.fecha)
      }))

      const hayDisponible = slots.some(s => s.disponible)

      if (!hayDisponible) {
        const fechaFormateada = new Date(form.fecha + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })
        setFechaError(`No hay disponibilidad para ${form.zona} el ${fechaFormateada}. Elige otra fecha.`)
        setForm(prev => ({ ...prev, fecha: '', hora: '' }))
        setDisponibilidad([])
      } else {
        setFechaError('')
        setDisponibilidad(slots)
      }

      setCheckingDisp(false)
    }

    loadDisponibilidad()
    return () => { cancelled = true }
  }, [form.zona, form.fecha, form.personas])

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

    if (name === 'zona' || name === 'personas') {
      setDisponibilidad([])
      setForm(prev => ({ ...prev, [name]: value, hora: '' }))
      setErrorMsg('')
      return
    }

    setErrorMsg('')
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fecha || !form.hora) return
    setStatus('loading')
    setErrorMsg('')

    const { error: capacidadError, mesa, updates } = await validateAndAssign(
      form.zona, form.fecha, form.hora, form.personas
    )

    if (capacidadError) {
      setErrorMsg(capacidadError)
      setStatus('idle')
      return
    }

    const { error } = await supabase.from('reservas').insert([{
      nombre:   form.nombre,
      telefono: form.telefono,
      email:    form.email || null,
      personas: Number(form.personas),
      zona:     form.zona,
      mesa:     mesa || null,
      fecha:    form.fecha,
      hora:     form.hora,
      platos:   form.platos || null,
    }])

    if (error) {
      setErrorMsg('Hubo un error al enviar. Intenta de nuevo o escríbenos al Instagram.')
      setStatus('idle')
      return
    }

    // Reasignar mesas existentes de Zona Zen si es necesario
    if (updates && updates.length > 0) {
      await Promise.all(updates.map(u =>
        supabase.from('reservas').update({ mesa: u.mesa }).eq('id', u.id)
      ))
    }

    supabase.functions.invoke('notificar-reserva', {
      body: {
        nombre:   form.nombre,
        telefono: form.telefono,
        email:    form.email || null,
        fecha:    form.fecha,
        hora:     form.hora,
        personas: form.personas,
        zona:     form.zona,
        mesa:     mesa || null,
        platos:   form.platos || null,
      }
    }).catch(() => {})

    setStatus('success')
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
            <p>Nos pondremos en contacto contigo para confirmarla. Hasta pronto.</p>
            {form.email && (
              <p className="modal-success-spam">
                Te enviamos una confirmación a <strong>{form.email}</strong>. Si no la ves, revisa tu carpeta de spam.
              </p>
            )}
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
              <div className="form-field">
                <label htmlFor="r-email">
                  Correo electrónico <span className="form-optional">(opcional — para recibir confirmación)</span>
                </label>
                <input id="r-email" name="email" type="email" placeholder="tucorreo@ejemplo.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="r-personas">Personas</label>
                  <select id="r-personas" name="personas" value={form.personas} onChange={handleChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                  {personasError && <span className="form-error-inline">{personasError}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="r-zona">Zona</label>
                  <select id="r-zona" name="zona" required value={form.zona} onChange={handleChange}>
                    <option value="">Elige una zona</option>
                    {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="r-fecha">Fecha</label>
                <input id="r-fecha" type="date" name="fecha" required min={getMinDate()} value={form.fecha} onChange={handleChange} />
                {fechaError && <span className="form-error-inline">{fechaError}</span>}
              </div>

              {form.zona && form.fecha && (
                <div className="form-field">
                  <label>
                    Hora
                    {checkingDisp && <span className="form-checking"> · Verificando disponibilidad...</span>}
                  </label>
                  {!checkingDisp && disponibilidad.length > 0 && (
                    <div className="hora-grid">
                      {disponibilidad.map(({ hora, disponible }) => (
                        <button
                          key={hora}
                          type="button"
                          className={`hora-btn${!disponible ? ' hora-btn--ocupada' : ''}${form.hora === hora ? ' hora-btn--selected' : ''}`}
                          disabled={!disponible}
                          onClick={() => setForm(prev => ({ ...prev, hora }))}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="r-platos">
                  Platos de interés <span className="form-optional">(opcional)</span>
                </label>
                <textarea id="r-platos" name="platos" rows="2" placeholder="Ej: Imperial Roll, Bowl Acevichado..." value={form.platos} onChange={handleChange} />
              </div>
              {errorMsg && <p className="form-error">{errorMsg}</p>}
              <button type="submit" className="btn btn--full" disabled={status === 'loading' || !form.hora}>
                {status === 'loading' ? 'Verificando disponibilidad...' : 'Confirmar reserva'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
