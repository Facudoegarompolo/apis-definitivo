import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, eliminarItemCarrito, vaciarCarritoDB } from '../store/slices/cartSlice';
import { styles } from './CartRedux.styles';
import defaultImage from '../assets/imgXdefault.jpg';

const CartRedux = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const usuarioId = useSelector((state) => state.user.user?.id);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productoId) => {
    if (usuarioId) {
      dispatch(eliminarItemCarrito({ usuarioId, productoId }));
    }
  };

  const handleClearCart = () => {
    if (usuarioId) {
      dispatch(vaciarCarritoDB(usuarioId));
    } else {
      dispatch(clearCart());
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div style={styles.container}>
      <h1>Carrito de Compras (Redux)</h1>
      {cartItems.length > 0 && <p>Tienes {cartItems.length} productos en el carrito</p>}
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div style={styles.itemsContainer}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.itemCard}>
                <img
                  src={item.imagen || defaultImage}
                  alt={item.nombre}
                  style={styles.itemImage}
                />
                <div>
                  <h3 style={styles.itemTitle}>{item.nombre}</h3>
                  <p style={styles.itemPrice}>
                    ${item.precio.toLocaleString('es-AR')}
                  </p>
                  <p style={styles.itemQuantity}>Cantidad: {item.cantidad}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  style={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div style={styles.totalContainer}>
            <h3>Total: ${total.toLocaleString('es-AR')}</h3>
            <button onClick={handleClearCart} style={styles.clearButton}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
      <div style={styles.linksContainer}>
        <Link to="/products" style={styles.shoppingLink}>
          Seguir comprando
        </Link>
        {cartItems.length > 0 && (
          <Link to="/checkout" style={styles.checkoutLink}>
            Pagar
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartRedux;