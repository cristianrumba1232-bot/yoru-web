const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.07 2.36 2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.89 6.89l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
)

const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const contactoItems = [
  {
    icon: <IconPin />,
    label: 'Ubicación',
    value: 'Paracas 481, Salamanca, Ate',
  },
  {
    icon: <IconClock />,
    label: 'Horario',
    value: <>Todos los días excepto martes<br />6:00 pm – 11:00 pm</>,
  },
  {
    icon: <IconPhone />,
    label: 'Teléfono',
    value: '+51 987 654 321',
  },
  {
    icon: <IconMail />,
    label: 'Reservas',
    value: 'reservas@yorurestaurante.com',
  },
]

export default function Contacto() {
  return (
    <div className="page contacto-page">
      <section className="contacto">
        <div className="contacto-header">
          <p className="contacto-label">夜 · Encuéntranos</p>
          <h2>Contacto</h2>
        </div>
        <div className="contacto-grid">
          {contactoItems.map(item => (
            <div className="contacto-item" key={item.label}>
              <span className="contacto-icon">{item.icon}</span>
              <p className="contacto-item-label">{item.label}</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
