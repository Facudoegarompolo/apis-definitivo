import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import defaultImage from '../assets/imgXdefault.jpg'
import {
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  actualizarItemCarrito,
  eliminarItemCarrito,
  vaciarCarritoDB,
} from '../store/slices/cartSlice'
import './Cart.css'

const formatPrice = (value) => Number(value ?? 0).toLocaleString('es-AR')

const Cart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const cartCount = useSelector(selectCartCount)
  const cartTotal = useSelector(selectCartTotal)

  const handleDecrease = (item) => {
    const currentQuantity = Number(item.quantity ?? item.cantidad ?? 1)
    if (currentQuantity <= 1) {
      dispatch(eliminarItemCarrito({ productoId: item.id }))
      return
    }
    dispatch(actualizarItemCarrito({ productoId: item.id, cantidad: currentQuantity - 1 }))
  }

  const handleIncrease = (item) => {
    const currentQuantity = Number(item.quantity ?? item.cantidad ?? 1)
    dispatch(actualizarItemCarrito({ productoId: item.id, cantidad: currentQuantity + 1 }))
  }

  const handleRemove = (itemId) => {
    dispatch(eliminarItemCarrito({ productoId: itemId }))
  }

  const handleClearCart = () => {
    dispatch(vaciarCarritoDB())
  }

  return (
    <section className="cart-page">
      <div className="cart-page__top">
        <div>
          <h1 className="cart-page__title">Carrito de Compras</h1>
          <p className="cart-page__subtitle">
            Tienes {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en el carrito
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-page__empty">
          <p>Tu carrito está vacío.</p>
          <Link className="cart-button cart-button--primary" to="/productos">
            Explorar productos
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img
                  src={item.imagen || defaultImage}
                  alt={item.nombre}
                  className="cart-item__image"
                />
                <div className="cart-item__details">
                  <h2 className="cart-item__name">{item.nombre}</h2>
                  <p className="cart-item__meta">
                    Precio unitario: ${formatPrice(item.precio ?? item.price ?? 0)}
                  </p>
                  <div className="cart-item__quantity">
                    <span>Cantidad</span>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-controls__button"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <span className="quantity-controls__value">{item.quantity ?? item.cantidad ?? 1}</span>
                      <button
                        type="button"
                        className="quantity-controls__button"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="cart-item__total">
                    Total: <strong>${formatPrice(item.subtotal ?? (item.precio ?? item.price ?? 0) * (item.quantity ?? item.cantidad ?? 1))}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => handleRemove(item.id)}
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <p className="cart-summary__label">Total del carrito</p>
              <p className="cart-summary__amount">${formatPrice(cartTotal)}</p>
            </div>
            <div className="cart-summary__actions">
              <button
                type="button"
                className="cart-button cart-button--secondary"
                onClick={handleClearCart}
              >
                Vaciar carrito
              </button>
              <Link className="cart-button cart-button--primary" to="/checkout">
                Pagar
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default Cart;
