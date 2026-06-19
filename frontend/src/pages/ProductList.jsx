import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState('precio-menor')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          mode: 'cors'
        })
        if (!response.ok) throw new Error('Error al cargar los productos')
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const sortedProducts = useMemo(() => {
    const getPrice = (product) => Number(product.price ?? product.precio ?? product.cost ?? 0)
    const getTitle = (product) => (product.title ?? product.name ?? product.nombre ?? '').toString().toLowerCase()

    return [...products].sort((productA, productB) => {
      if (sortOption === 'precio-menor') {
        return getPrice(productA) - getPrice(productB)
      }
      if (sortOption === 'precio-mayor') {
        return getPrice(productB) - getPrice(productA)
      }
      if (sortOption === 'nombre') {
        return getTitle(productA).localeCompare(getTitle(productB))
      }
      return 0
    })
  }, [products, sortOption])

  if (loading) return <div className="productos__status">Cargando productos...</div>
  if (error) return <div className="productos__status productos__status--error">Error: {error}</div>

  return (
    <div className="container py-4">
      <div className="productos__layout">
        <aside className="productos__sidebar">
          <h1 className="productos__title">Lista de Productos</h1>
          <p className="productos__subtitle">Ordenar por:</p>

          <div className="productos__filters">
            <button
              type="button"
              className={`filter__button ${sortOption === 'precio-menor' ? 'filter__button--active' : ''}`}
              onClick={() => setSortOption('precio-menor')}
            >
              Precio menor
            </button>
            <button
              type="button"
              className={`filter__button ${sortOption === 'precio-mayor' ? 'filter__button--active' : ''}`}
              onClick={() => setSortOption('precio-mayor')}
            >
              Precio mayor
            </button>
            <button
              type="button"
              className={`filter__button ${sortOption === 'nombre' ? 'filter__button--active' : ''}`}
              onClick={() => setSortOption('nombre')}
            >
              Nombre
            </button>
          </div>
        </aside>

        <main className="productos__content">
          {sortedProducts.length === 0 ? (
            <p className="productos__status">No hay productos disponibles.</p>
          ) : (
            <div className="productos__grid">
              {sortedProducts.map((product, index) => {
                const id = product.id ?? product._id ?? product.codigo ?? index
                return <ProductCard key={id} product={product} />
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProductList
