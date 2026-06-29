import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { checkSupabaseConnection } from './supabase'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import ReservaModal from './components/ReservaModal'
import ProtectedRoute from './components/ProtectedRoute'

const Inicio        = lazy(() => import('./pages/Inicio'))
const Menu          = lazy(() => import('./pages/Menu'))
const Historia      = lazy(() => import('./pages/Historia'))
const Contacto      = lazy(() => import('./pages/Contacto'))
const AdminLogin    = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

const IconIG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

function PublicLayout({ children, onOpenReservas, reservaOpen, setReservaOpen }) {
  return (
    <>
      <Navbar onOpenReservas={onOpenReservas} />
      {children}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-logo">YORU</p>
            <p className="footer-tagline">La noche, servida.</p>
            <a href="https://www.instagram.com/yorunikkei" target="_blank" rel="noreferrer" className="footer-ig" aria-label="Instagram @yorunikkei">
              <IconIG />
              <span>@yorunikkei</span>
            </a>
          </div>
          <div className="footer-nav">
            <p className="footer-col-title">Navegación</p>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/historia">Historia</Link></li>
              <li><Link to="/menu">Carta</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-info">
            <p className="footer-col-title">Visítanos</p>
            <p>Paracas 481, Salamanca, Ate</p>
            <p>Todos los días excepto martes</p>
            <p>6:00 pm – 11:00 pm</p>
          </div>
        </div>
        <div className="footer-copy">
          <p>© 2026 YORU Nikkei Experience — Todos los derechos reservados</p>
        </div>
      </footer>
      {reservaOpen && <ReservaModal onClose={() => setReservaOpen(false)} />}
    </>
  )
}

function App() {
  const [reservaOpen, setReservaOpen] = useState(false)

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  const openReservas = () => setReservaOpen(true)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>

          {/* ── Admin ── */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/reservas" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />

          {/* ── Páginas públicas ── */}
          <Route path="/" element={
            <PublicLayout onOpenReservas={openReservas} reservaOpen={reservaOpen} setReservaOpen={setReservaOpen}>
              <Inicio onOpenReservas={openReservas} />
            </PublicLayout>
          } />
          <Route path="/menu" element={
            <PublicLayout onOpenReservas={openReservas} reservaOpen={reservaOpen} setReservaOpen={setReservaOpen}>
              <Menu />
            </PublicLayout>
          } />
          <Route path="/historia" element={
            <PublicLayout onOpenReservas={openReservas} reservaOpen={reservaOpen} setReservaOpen={setReservaOpen}>
              <Historia />
            </PublicLayout>
          } />
          <Route path="/contacto" element={
            <PublicLayout onOpenReservas={openReservas} reservaOpen={reservaOpen} setReservaOpen={setReservaOpen}>
              <Contacto />
            </PublicLayout>
          } />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
