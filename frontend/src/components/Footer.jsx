import './Footer.css'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <h2>TIENDA</h2>
          <p>Tu ecommerce favorito.</p>
        </div>

        <div className="footer__links">
          <h3>Links</h3>

          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer__contact">
          <h3>Contacto</h3>

          <p>Email: contacto@tienda.com</p>
          <p>Tel: +54 11 1234-5678</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 TIENDA - Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer