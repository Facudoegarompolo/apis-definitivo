import './Home.css'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import ProductCard from '../components/ProductCard'
import { API_BASE_URL } from '../services/apiBase'

const CARD_WIDTH = 260 + 16

function Home() {
  const [offers, setOffers] = useState([])
  const [brands, setBrands] = useState([])
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos/ofertas`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOffers(data))
      .catch(() => {})

    fetch(`${API_BASE_URL}/marcas`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBrands(data))
      .catch(() => {})
  }, [])

  const visibleCount = 4
  const maxIndex = Math.max(0, offers.length - visibleCount)

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * CARD_WIDTH}px)`
    }
  }, [index])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <h1>Bienvenido a TIENDA</h1>
          <p>Descubrí los mejores productos al mejor precio.</p>
          <Link to="/productos" className="hero__btn">Ver Productos</Link>
        </div>
      </section>

      <div className="home__inner">
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

        <section className="home__brands">
          <p className="home__brands-title">Marcas que trabajamos</p>
          <div className="home__brands-track">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <Link key={brand.id} to={`/productos?brand=${brand.id}`} className="brand-logo brand-logo--link">
                  {brand.nombre}
                </Link>
              ))
            ) : (
              <span className="brand-logo">Cargando marcas...</span>
            )}
          </div>
        </section>

        {offers.length > 0 && (
          <section className="home__offers">
            <div className="home__offers-header">
              <h2 className="home__offers-title">Ofertas <span>del día</span></h2>
              <div className="home__offers-controls">
                <button className="carousel-btn" onClick={prev} disabled={index === 0} aria-label="Anterior">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <button className="carousel-btn" onClick={next} disabled={index >= maxIndex} aria-label="Siguiente">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="home__carousel">
              <div className="home__carousel-track" ref={trackRef}>
                {offers.map((product, i) => {
                  const id = product.id ?? product._id ?? product.codigo ?? i
                  return <ProductCard key={id} product={product} />
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Home