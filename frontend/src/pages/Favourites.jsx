import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFavorite } from '../store/slices/favoriteSlice'
import defaultImage from '../assets/imgXdefault.jpg'
import '../components/Cart.css'

function Favourites() {
  const favItems = useSelector((state) => state.favorite.items || [])
  const dispatch = useDispatch()

  const handleRemoveFavorite = (productId) => {
    dispatch(removeFavorite(productId))
  }

  return (
    <section className="cart-page">
      <div className="cart-page__top">
        <h1 className="cart-page__title">Mis Favoritos</h1>
        <p className="cart-page__subtitle">
          {favItems.length === 0
            ? 'No tienes productos favoritos aún.'
            : `Tienes ${favItems.length} ${favItems.length === 1 ? 'producto favorito' : 'productos favoritos'}`}
        </p>
      </div>

      {favItems.length === 0 ? (
        <div className="cart-page__empty">
          <i className="bi bi-heartbreak display-1 text-muted"></i>
          <p className="text-muted mt-3">No tienes productos favoritos aún.</p>
          <Link to="/productos" className="cart-button cart-button--primary">
            Explorar Productos
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {favItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img
                  src={item.imagen || item.image || defaultImage}
                  alt={item.nombre || item.name || 'Producto'}
                  className="cart-item__image"
                />
                <div className="cart-item__details">
                  <h2 className="cart-item__name">{item.nombre || item.name || 'Producto'}</h2>
                  <p className="cart-item__meta">
                    Precio: ${Number(item.precio ?? item.price ?? 0).toLocaleString('es-AR')}
                  </p>
                  {item.descripcion && <p className="cart-item__meta">{item.descripcion}</p>}
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => handleRemoveFavorite(item.id)}
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Favourites
