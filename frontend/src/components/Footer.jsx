import './Footer.css'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__brand">
          <Link to="/" className="footer__logo">TIEN<span>DA</span></Link>
          <p className="footer__tagline">Tu ecommerce favorito.</p>
          <div className="footer__socials">
            {/* Instagram */}
            <a href="#" className="footer__social-btn" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className="footer__social-btn" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M4 20 20 4"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="footer__social-btn" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Navegación</h3>
          <Link to="/" className="footer__link">Inicio</Link>
          <Link to="/productos" className="footer__link">Productos</Link>
          <Link to="/ofertas" className="footer__link">Ofertas</Link>
          <Link to="/favoritos" className="footer__link">Favoritos</Link>
          <Link to="/carrito" className="footer__link">Carrito</Link>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Cuenta</h3>
          <Link to="/login" className="footer__link">Ingresar</Link>
          <Link to="/registro" className="footer__link">Registrarse</Link>
          <Link to="/perfil" className="footer__link">Mi perfil</Link>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Contacto</h3>
          <span className="footer__link">contacto@tienda.com</span>
          <span className="footer__link">+54 11 1234-5678</span>
          <span className="footer__link">Lun–Vie, 9–18 hs</span>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© 2026 TIENDA · Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer