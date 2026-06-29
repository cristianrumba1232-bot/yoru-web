import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const OWNER_EMAIL = 'christian_laura123@hotmail.com'

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
  const [regEmail,     setRegEmail]     = useState('')
  const [regPass,      setRegPass]      = useState('')
  const [regConfirm,   setRegConfirm]   = useState('')
  const [newEmailCode, setNewEmailCode] = useState('')
  const [ownerCode,    setOwnerCode]    = useState('')
  const [codesSent,    setCodesSent]    = useState(false)

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

  // ── REGISTRO paso 1: enviar códigos a ambos correos ───────────────────────
  async function sendCodes() {
    setError('')
    if (!regEmail || !regPass || !regConfirm) {
      setError('Completa todos los campos antes de solicitar los códigos.')
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

    const { error: e1 } = await supabase.auth.signInWithOtp({
      email: regEmail,
      options: { shouldCreateUser: true }
    })
    if (e1) {
      setLoading(false)
      setError('No se pudo enviar el código al correo nuevo: ' + e1.message)
      return
    }

    const { error: e2 } = await supabase.auth.signInWithOtp({
      email: OWNER_EMAIL,
      options: { shouldCreateUser: true }
    })
    setLoading(false)
    if (e2) {
      setError('No se pudo enviar el código de aprobación: ' + e2.message)
      return
    }

    setCodesSent(true)
  }

  // ── REGISTRO paso 2: verificar ambos códigos y crear la cuenta ─────────────
  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (!newEmailCode.trim() || !ownerCode.trim()) {
      setError('Debes ingresar ambos códigos de verificación.')
      return
    }

    setLoading(true)

    const { error: ownerErr } = await supabase.auth.verifyOtp({
      email: OWNER_EMAIL,
      token: ownerCode.trim(),
      type: 'email'
    })
    if (ownerErr) {
      setLoading(false)
      setError('Código de aprobación incorrecto o expirado.')
      return
    }
    await supabase.auth.signOut()

    const { error: newErr } = await supabase.auth.verifyOtp({
      email: regEmail,
      token: newEmailCode.trim(),
      type: 'email'
    })
    if (newErr) {
      setLoading(false)
      setError('Código del correo nuevo incorrecto o expirado.')
      return
    }

    const { error: passErr } = await supabase.auth.updateUser({ password: regPass })
    await supabase.auth.signOut()

    setLoading(false)
    if (passErr) {
      setError('Error al establecer contraseña: ' + passErr.message)
      return
    }

    setSuccess('Cuenta creada. Ya puedes iniciar sesión.')
    switchMode('login')
  }

  function resetRegister() {
    setRegEmail('')
    setRegPass('')
    setRegConfirm('')
    setNewEmailCode('')
    setOwnerCode('')
    setCodesSent(false)
  }

  function switchMode(m) {
    setMode(m)
    setError('')
    setSuccess('')
    resetRegister()
    setLoginEmail('')
    setLoginPass('')
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
              <PasswordInput
                id="al-pass"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
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
              <label htmlFor="ar-email">Correo de la nueva cuenta</label>
              <input id="ar-email" type="email" required autoComplete="off"
                value={regEmail} onChange={e => setRegEmail(e.target.value)}
                placeholder="correo@ejemplo.com" disabled={codesSent} />
            </div>
            <div className="form-field">
              <label htmlFor="ar-pass">Contraseña</label>
              <PasswordInput
                id="ar-pass"
                value={regPass}
                onChange={e => setRegPass(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                disabled={codesSent}
              />
            </div>
            <div className="form-field">
              <label htmlFor="ar-confirm">Confirmar contraseña</label>
              <PasswordInput
                id="ar-confirm"
                value={regConfirm}
                onChange={e => setRegConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                disabled={codesSent}
              />
            </div>

            {!codesSent ? (
              <button type="button" className="btn btn--borgona btn--full" onClick={sendCodes} disabled={loading}>
                {loading ? 'Enviando códigos...' : 'Enviar códigos de verificación'}
              </button>
            ) : (
              <>
                <div className="admin-codes-grid">
                  <div className="admin-code-block">
                    <p className="admin-code-label">Código enviado a</p>
                    <p className="admin-code-email">{regEmail}</p>
                    <input
                      type="text" inputMode="numeric" autoComplete="one-time-code"
                      value={newEmailCode} onChange={e => setNewEmailCode(e.target.value)}
                      placeholder="Código del correo nuevo"
                    />
                  </div>
                  <div className="admin-code-block admin-code-block--owner">
                    <p className="admin-code-label">Código de aprobación</p>
                    <p className="admin-code-email">Revisa el correo del administrador</p>
                    <input
                      type="text" inputMode="numeric" autoComplete="one-time-code"
                      value={ownerCode} onChange={e => setOwnerCode(e.target.value)}
                      placeholder="Código de aprobación"
                    />
                  </div>
                </div>

                <div className="admin-reg-actions">
                  <button type="button" className="btn btn--outline"
                    onClick={() => { setCodesSent(false); setNewEmailCode(''); setOwnerCode(''); setError('') }}
                    disabled={loading}>
                    Reenviar
                  </button>
                  <button type="submit" className="btn btn--borgona" disabled={loading}>
                    {loading ? 'Verificando...' : 'Crear cuenta'}
                  </button>
                </div>
              </>
            )}

            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
