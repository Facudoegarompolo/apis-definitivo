import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { styles } from './CartRedux.styles';
import defaultImage from '../assets/imgXdefault.jpg';

const CartRedux = () => {
  // useSelector es un hook de React Redux que permite acceder al estado global del store index.js.
  // state.cart.items accede a la propiedad items del slice cart del store global.
  // cartItems contendrá el array de productos que están actualmente en el carrito.
  
  // con esta línea el componente se suscribe a cambios en state.cart.items, 
  // cada vez que se modifica items de cartSlice, useSelector detecta el cambio 
  // el componente CartRedux se re renderizar
  const cartItems = useSelector((state) => state.cart.items);

  // Si CUALQUIER cosa del contexto cambia, el componente SE RE-RENDERIZA
  // const { cartItems, addToCart } = useContext(CartContext);
  // con redux solo re-renderiza si STATE.CART.ITEMS cambió

  // useDispatch Hook para despachar acciones a Redux (agregar, eliminar, vaciar carrito, etc.)
  // dispatch con causa re renders
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId) => {
    // Usar dispatch de Redux para eliminar un producto del carrito en lugar de la función removeFromCart de useContext
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    // Usar dispatch de Redux para vaciar el carrito en lugar de la función clearCart de useContext
    dispatch(clearCart());
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.precio, 0);
  };

  // cuando se ejecuta handleRemoveFromCart o handleClearCart, el estado del carrito se actualiza en el store global de Redux.
  // Esto hace que el componente CartRedux se vuelva a renderizar automáticamente con el nuevo estado del carrito, mostrando los cambios en la interfaz de usuario.
  const total = calculateTotal();

  return (
    <div style={styles.container}>
      <h1>Carrito de Compras (Redux)</h1>
      {cartItems.length > 0 && (<p>Tienes {cartItems.length} productos en el carrito</p>)}

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div style={styles.itemsContainer}>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                style={styles.itemCard}
              >
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
            <button
              onClick={handleClearCart}
              style={styles.clearButton}
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
      <div style={styles.linksContainer}>
        <Link 
          to="/products"
          style={styles.shoppingLink}
        >
          Seguir comprando
        </Link>
        {cartItems.length > 0 && (
          <Link 
            to="/checkout"
            style={styles.checkoutLink}
          >
            Pagar
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartRedux;
