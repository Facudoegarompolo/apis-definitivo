import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/userSlice'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const userName = user?.nombre || user?.email || 'Usuario'
  const isAdmin = user?.rol === 'ROLE_ADMIN'

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820 && open) {
        setOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [open])

  useEffect(() => {
    if (location.pathname !== '/productos') return

    const params = new URLSearchParams(location.search)
    setSearchValue(params.get('search') || '')
  }, [location.pathname, location.search])

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const trimmedSearch = searchValue.trim()
    const targetPath = trimmedSearch
      ? `/productos?search=${encodeURIComponent(trimmedSearch)}`
      : '/productos'

    navigate(targetPath)
    setOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/ofertas', label: 'Ofertas' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ]
  
  return (
    <header className="nav-root">
      <div className="nav-inner">
        <Link className="nav-brand" to="/">
          TIEN<span>DA</span>
        </Link>

        <nav className="nav-links" aria-label="Navegación principal">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link-item${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <form className="nav-search-wrap" onSubmit={handleSearchSubmit}>
          <svg className="nav-search-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="nav-search-input"
            type="search"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </form>

        <div className="nav-actions desktop-actions">
          {isAuthenticated ? (
            <>
              <Link className="nav-user" to="/perfil">Hola, {userName}</Link>
              <button className="btn-ghost" type="button" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link className="btn-ghost" to="/login">Ingresar</Link>
              <Link className="btn-primary-nav" to="/registro">Registrarse</Link>
            </>
          )}
          <div className="nav-divider" />
          <Link className="icon-btn" to="/favoritos" aria-label="Favoritos">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </Link>
          <Link className="icon-btn" to="/carrito" aria-label="Carrito de compras">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span className="cart-badge" aria-hidden="true" />
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobilePanel"
        >
          {open ? (
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="mobile-panel" id="mobilePanel" role="navigation" aria-label="Menú móvil">
          <form className="mobile-search" onSubmit={handleSearchSubmit}>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </form>

          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link className="mobile-nav-link" to="/favoritos" onClick={() => setOpen(false)}>
            Favoritos
          </Link>

          <div className="mobile-divider" />

          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <Link className="btn-ghost outlined" to="/perfil" onClick={() => setOpen(false)}>
                  {userName}
                </Link>
                <button className="btn-primary-nav" type="button" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link className="btn-ghost outlined" to="/login" onClick={() => setOpen(false)}>
                  Ingresar
                </Link>
                <Link className="btn-primary-nav" to="/registro" onClick={() => setOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
