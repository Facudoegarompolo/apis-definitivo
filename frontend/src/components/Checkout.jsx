import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { vaciarCarritoDB } from '../store/slices/cartSlice';

const formatPrice = (value) => Number(value ?? 0).toLocaleString('es-AR');
const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const usuarioId = useSelector((state) => state.user.user?.id);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.precio * (item.cantidad ?? item.quantity ?? 1),
    0
  );

  const handleConfirmPurchaseWithStock = async () => {
    if (cartItems.length === 0) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    await Promise.all(
      cartItems.map((item) => {
        const cantidad = item.cantidad ?? item.quantity ?? 1;

        return fetch(`http://localhost:8080/api/productos/${item.id}/stock`, {
          method: 'PATCH',
          headers,
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({ cantidad })
        }).then(async (res) => {
          if (!res.ok) {
            const body = await res.text().catch(() => 'no body');
            throw new Error(`Error actualizando stock de producto ${item.id}: ${body}`);
          }
        });
      })
    );
    await dispatch(vaciarCarritoDB(usuarioId));
    alert('Compra finalizada y stock actualizado');
  } catch (err) {
    console.error(err);
    alert('Error al actualizar stock: ' + (err.message || err));
  }
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
                  {item.nombre} x {item.cantidad ?? item.quantity ?? 1}
                </span>
                <strong>
                  ${formatPrice(item.precio * (item.cantidad ?? item.quantity ?? 1))}
                </strong>
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
        onClick={handleConfirmPurchaseWithStock}
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
