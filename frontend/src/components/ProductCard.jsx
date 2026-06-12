import './ProductCard.css'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice'
import asset from '../assets/imgXdefault.jpg'

function ProductCard({ product }) {
  const dispatch = useDispatch()

  const favourites = useSelector((state) => state.favorite.items || [])

  const id = product.id ?? product._id ?? product.codigo
  const name = product.nombre ?? product.name ?? 'Sin nombre'
  const desc = product.descripcion ?? product.description ?? ''
  const price = product.precio ?? product.price ?? 0
  const img = product.imagen ?? product.image ?? asset

  const isFavourite = favourites.some((p) => String(p.id) === String(id))

  const handleToggleFavourite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavourite) {
      dispatch(removeFavorite(id))
    } else {
      dispatch(addFavorite(product))
    }
  }

  return (
    <Link to={`/productos/${id}`} className="product-card">
      <div className="product-card__image-wrapper">
        {img && <img src={img} alt={name} className="product-card__img" />}
        <button className="product-card__favourite" onClick={handleToggleFavourite}>
          {isFavourite ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}
        </button>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">${Number(price).toLocaleString('es-AR')}</p>
        {desc && <p className="product-card__desc">{desc}</p>}
        <span className="product-card__link">Ver detalle →</span>
      </div>
    </Link>
  )
}

export default ProductCard
