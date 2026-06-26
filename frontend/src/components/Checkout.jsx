import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, selectCartItems, selectCartTotal, vaciarCarritoDB } from '../store/slices/cartSlice'
import { API_BASE_URL } from '../services/apiBase'
import { fetchWithCsrf } from '../services/csrfClient'

const formatPrice = (value) => Number(value ?? 0).toLocaleString('es-AR')

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const user = useSelector((state) => state.user.user)

  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirmPurchase = async () => {
    if (!direccion.trim()) {
      setError('Ingresá una dirección de envío.')
      return
    }

    const pedidoRequest = {
      usuarioId: user.id,
      direccionEnvio: direccion.trim(),
      items: cartItems.map((item) => ({
        productoId: item.id,
        cantidad: item.quantity ?? 1,
      })),
    }

    try {
      setLoading(true)
      setError(null)
      const res = await fetchWithCsrf(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(pedidoRequest),
      })

      if (!res.ok) throw new Error('Error al crear el pedido.')

      dispatch(vaciarCarritoDB())
      navigate('/mis-pedidos')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Confirmar Compra</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Resumen</h2>
        {cartItems.length === 0 ? (
          <p>No hay productos para confirmar.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const price = Number(item.precio ?? item.price ?? 0)
              const offerPrice = Number(item.precioOferta ?? item.priceOferta ?? 0)
              const effectivePrice = Boolean(item.oferta) && offerPrice > 0 ? offerPrice : price
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderBottom: '1px solid #334155',
                    padding: '0.75rem 0',
                  }}
                >
                  <span>{item.nombre} x {item.quantity ?? 1}</span>
                  <strong>${formatPrice(effectivePrice * (item.quantity ?? 1))}</strong>
                </div>
              )
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.1rem' }}>
              <strong>Total</strong>
              <strong>${formatPrice(cartTotal)}</strong>
            </div>
          </>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Dirección de envío
        </label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej: Av. Corrientes 1234, CABA"
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: '#1a2744',
            color: '#f1f5f9',
            fontSize: '0.95rem',
          }}
        />
      </div>

      {error && <p style={{ color: '#e11d48', marginBottom: '1rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          to="/carrito"
          style={{
            backgroundColor: '#1a2744',
            color: 'white',
            padding: '0.65rem 1.25rem',
            border: '1px solid #334155',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Volver al carrito
        </Link>
        <button
          disabled={cartItems.length === 0 || loading}
          onClick={handleConfirmPurchase}
          style={{
            backgroundColor: cartItems.length === 0 || loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderRadius: '8px',
            cursor: cartItems.length === 0 || loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </div>
    </div>
  )
}

export default Checkout