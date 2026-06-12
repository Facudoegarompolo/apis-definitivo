import './Home.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <h1>Bienvenido a TIENDA</h1>

          <p>
            Descubrí los mejores productos al mejor precio.
          </p>

          <Link to="/productos" className="hero__btn">
            Ver Productos
          </Link>
        </div>
      </section>

      <section className="home__features">
        <div className="feature-card">
          <h3>🚚 Envíos rápidos</h3>
          <p>Recibí tus productos en tiempo récord.</p>
        </div>

        <div className="feature-card">
          <h3>💳 Pagos seguros</h3>
          <p>Comprá con total seguridad.</p>
        </div>

        <div className="feature-card">
          <h3>⭐ Productos premium</h3>
          <p>Calidad garantizada en cada compra.</p>
        </div>
      </section>
    </div>
  )
}

export default Home