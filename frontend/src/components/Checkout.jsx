import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCart,
  selectCartItems,
  selectCartTotal
} from '../store/slices/cartSlice';

const formatPrice = (value) => Number(value ?? 0).toLocaleString('es-AR');

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleConfirmPurchase = () => {
    dispatch(clearCart());
    alert('Compra finalizada');
  };

  return (
    <div style={{ padding: '2rem', width: '100%' }}>
      <h1>Confirmar Compra</h1>
      <div style={{ marginBottom: '1rem' }}>
        <h2>Resumen de la compra</h2>
        {cartItems.length === 0 ? (
          <p>No hay productos para confirmar.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderBottom: '1px solid #eee',
                  padding: '0.75rem 0'
                }}
              >
                <span>
                  {item.nombre} x {item.quantity ?? 1}
                </span>
                <strong>${formatPrice(item.precio * (item.quantity ?? 1))}</strong>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '1.1rem'
              }}
            >
              <strong>Total</strong>
              <strong>${formatPrice(cartTotal)}</strong>
            </div>
          </>
        )}
      </div>
      <Link 
        to="/carrito"
        style={{
          backgroundColor: '#2D3277',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '1rem',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Volver al carrito
      </Link>
      <button
        disabled={cartItems.length === 0}
        onClick={handleConfirmPurchase}
        style={{
          backgroundColor: cartItems.length === 0 ? '#9ca3af' : '#4CAF50',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        Confirmar compra
      </button>
    </div>
  );
};

export default Checkout;
