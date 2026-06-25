import { useEffect, useMemo, useState } from 'react'
import CategoryFilter from '../components/CategoryFilter'
import ProductCard from '../components/ProductCard'
import { API_BASE_URL } from '../services/apiBase'
import './ProductList.css'

const API_URL = API_BASE_URL

function getSelectedCategoryIds(categories, selectedCategoryId) {
  if (selectedCategoryId === 'all') {
    return null
  }

  const childrenByParent = categories.reduce((children, category) => {
    if (category.categoriaPadreId != null) {
      const parentId = String(category.categoriaPadreId)
      children.set(parentId, [...(children.get(parentId) || []), String(category.id)])
    }
    return children
  }, new Map())

  const categoryIds = new Set()
  const pendingIds = [selectedCategoryId]

  while (pendingIds.length > 0) {
    const categoryId = pendingIds.pop()
    if (categoryIds.has(categoryId)) continue

    categoryIds.add(categoryId)
    pendingIds.push(...(childrenByParent.get(categoryId) || []))
  }

  return categoryIds
}

function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState('precio-menor')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { Accept: 'application/json' },
          credentials: 'include',
        }
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_URL}/productos`, requestOptions),
          fetch(`${API_URL}/categorias`, requestOptions),
        ])

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Error al cargar el catalogo')
        }

        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
        ])

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCatalog()
  }, [])

  const visibleProducts = useMemo(() => {
    const getPrice = (product) => Number(product.price ?? product.precio ?? product.cost ?? 0)
    const getTitle = (product) => (product.title ?? product.name ?? product.nombre ?? '').toString().toLowerCase()
    const selectedCategoryIds = getSelectedCategoryIds(categories, selectedCategoryId)
    const filteredProducts = selectedCategoryIds
      ? products.filter((product) =>
          product.categorias?.some((category) => selectedCategoryIds.has(String(category.id))),
        )
      : products

    return [...filteredProducts].sort((productA, productB) => {
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
  }, [categories, products, selectedCategoryId, sortOption])

  if (loading) return <div className="productos__status">Cargando productos...</div>
  if (error) return <div className="productos__status productos__status--error">Error: {error}</div>

  return (
    <div className="container py-4">
      <div className="productos__layout">
        <aside className="productos__sidebar">
          <h1 className="productos__title">Lista de Productos</h1>

          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />

          <h2 className="filter__section-title filter__section-title--spaced">Ordenar por</h2>

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
          {visibleProducts.length === 0 ? (
            <p className="productos__status">No hay productos para la categoria seleccionada.</p>
          ) : (
            <div className="productos__grid">
              {visibleProducts.map((product, index) => {
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
