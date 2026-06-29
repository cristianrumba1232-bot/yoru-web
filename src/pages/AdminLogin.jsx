import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const CODIGO_ACCESO = 'YORU2026#ADMIN'

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function PasswordInput({ id, value, onChange, placeholder, autoComplete, disabled }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="pass-wrap">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        className="pass-toggle"
        onMouseDown={() => setVisible(true)}
        onMouseUp={() => setVisible(false)}
        onMouseLeave={() => setVisible(false)}
        onTouchStart={() => setVisible(true)}
        onTouchEnd={() => setVisible(false)}
        tabIndex={-1}
        aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  )
}

export default function AdminLogin() {
  const [mode, setMode] = useState('login')

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass,  setLoginPass]  = useState('')

  // Registro
  const [regEmail,   setRegEmail]   = useState('')
  const [regPass,    setRegPass]    = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regCodigo,  setRegCodigo]  = useState('')

  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass })
    setLoading(false)
    if (error) setError('Correo o contraseña incorrectos.')
    else navigate('/admin/reservas')
  }

  // ── REGISTRO ───────────────────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (regCodigo !== CODIGO_ACCESO) {
      setError('Código de acceso incorrecto.')
      return
    }
    if (regPass !== regConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (regPass.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email: regEmail, password: regPass })
    setLoading(false)

    if (error) setError('Error al crear la cuenta: ' + error.message)
    else {
      setSuccess('Cuenta creada. Ya puedes iniciar sesión.')
      switchMode('login')
    }
  }

  function switchMode(m) {
    setMode(m)
    setError('')
    setSuccess('')
    setLoginEmail(''); setLoginPass('')
    setRegEmail(''); setRegPass(''); setRegConfirm(''); setRegCodigo('')
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <img src="/logos/isotipo-color.png" alt="YORU" className="admin-login-logo" />
        <p className="admin-login-label">夜 · Panel administrativo</p>
        <h1 className="admin-login-title">
          {mode === 'login' ? 'Acceso restringido' : 'Crear cuenta'}
        </h1>

        <div className="admin-mode-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')} type="button">
            Iniciar sesión
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')} type="button">
            Crear cuenta
          </button>
        </div>

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="admin-login-form" noValidate>
            <div className="form-field">
              <label htmlFor="al-email">Correo</label>
              <input id="al-email" type="email" required autoComplete="email"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="correo@ejemplo.com" />
            </div>
            <div className="form-field">
              <label htmlFor="al-pass">Contraseña</label>
              <PasswordInput id="al-pass" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" />
            </div>
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="btn btn--borgona btn--full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}

        {/* ── REGISTRO ── */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="admin-login-form" noValidate>
            <div className="form-field">
              <label htmlFor="ar-email">Correo</label>
              <input id="ar-email" type="email" required autoComplete="off"
                value={regEmail} onChange={e => setRegEmail(e.target.value)}
                placeholder="correo@ejemplo.com" />
            </div>
            <div className="form-field">
              <label htmlFor="ar-pass">Contraseña</label>
              <PasswordInput id="ar-pass" value={regPass} onChange={e => setRegPass(e.target.value)}
                placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
            </div>
            <div className="form-field">
              <label htmlFor="ar-confirm">Confirmar contraseña</label>
              <PasswordInput id="ar-confirm" value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                placeholder="Repite la contraseña" autoComplete="new-password" />
            </div>
            <div className="form-field">
              <label htmlFor="ar-codigo">Código de acceso</label>
              <input id="ar-codigo" type="password" required
                value={regCodigo} onChange={e => setRegCodigo(e.target.value)}
                placeholder="Código proporcionado por el administrador" />
            </div>
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="btn btn--borgona btn--full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
