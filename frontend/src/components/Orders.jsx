import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../services/apiBase'

const estadoColor = {
  PENDIENTE: '#f59e0b',
  CONFIRMADO: '#2563eb',
  ENVIADO: '#8b5cf6',
  ENTREGADO: '#10b981',
  CANCELADO: '#e11d48',
}

const Orders = () => {
  const user = useSelector((state) => state.user.user)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/pedidos`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar los pedidos.')
        return r.json()
      })
      .then((data) => {
        const misPedidos = data.filter((p) => String(p.usuarioId) === String(user?.id))
        setPedidos(misPedidos)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <p style={{ padding: '2rem' }}>Cargando pedidos...</p>
  if (error) return <p style={{ padding: '2rem', color: '#e11d48' }}>{error}</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Todavía no realizaste ningún pedido.</p>
          <Link
            to="/productos"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              style={{
                background: '#1a2744',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Pedido #{pedido.id}</span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    background: `${estadoColor[pedido.estado] ?? '#6b7280'}22`,
                    color: estadoColor[pedido.estado] ?? '#6b7280',
                  }}
                >
                  {pedido.estado ?? 'PENDIENTE'}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                📦 {pedido.direccionEnvio}
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                {pedido.items?.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.875rem',
                      color: '#e2e8f0',
                      padding: '0.25rem 0',
                    }}
                  >
                    <span>{item.productoNombre ?? `Producto #${item.productoId}`}</span>
                    <span>x {item.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders