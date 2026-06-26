import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import BrandFilter from '../components/BrandFilter'
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

function ProductList({ showOffers = false }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState('precio-menor')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const selectedBrandId = query.get('brand') ?? 'all'
  const searchQuery = query.get('search')?.toString().trim().toLowerCase()

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { Accept: 'application/json' },
          credentials: 'include',
        }
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          fetch(`${API_URL}${showOffers ? '/productos/ofertas' : '/productos'}`, requestOptions),
          fetch(`${API_URL}/categorias`, requestOptions),
          fetch(`${API_URL}/marcas`, requestOptions),
        ])

        if (!productsResponse.ok || !categoriesResponse.ok || !brandsResponse.ok) {
          throw new Error('Error al cargar el catalogo')
        }

        const [productsData, categoriesData, brandsData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
          brandsResponse.json(),
        ])

        setProducts(productsData)
        setCategories(categoriesData)
        setBrands(brandsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCatalog()
  }, [showOffers])

  const handleBrandSelect = (brandId) => {
    const nextQuery = new URLSearchParams(location.search)

    if (brandId === 'all') {
      nextQuery.delete('brand')
    } else {
      nextQuery.set('brand', brandId)
    }

    const nextSearch = nextQuery.toString()
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ''}`)
  }

  const visibleProducts = useMemo(() => {
    const getPrice = (product) => {
      const price = Number(product.price ?? product.precio ?? product.cost ?? 0)
      const precioOferta = Number(product.precioOferta ?? product.priceOferta ?? 0)
      return product.oferta && precioOferta > 0 ? precioOferta : price
    }
    const getTitle = (product) => (product.title ?? product.name ?? product.nombre ?? '').toString().toLowerCase()
    const selectedCategoryIds = getSelectedCategoryIds(categories, selectedCategoryId)

    const filteredByCategory = selectedCategoryIds
      ? products.filter((product) =>
          product.categorias?.some((category) => selectedCategoryIds.has(String(category.id))),
        )
      : products

    const filteredByBrand = selectedBrandId && selectedBrandId !== 'all'
      ? filteredByCategory.filter((product) => String(product.marca?.id ?? product.marca?._id ?? '') === selectedBrandId)
      : filteredByCategory

    const filteredProducts = searchQuery
      ? filteredByBrand.filter((product) =>
          getTitle(product).includes(searchQuery) ||
          (product.description ?? product.descripcion ?? '').toString().toLowerCase().includes(searchQuery),
        )
      : filteredByBrand

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
  }, [categories, products, selectedCategoryId, selectedBrandId, sortOption, searchQuery])

  if (loading) return <div className="productos__status">Cargando productos...</div>
  if (error) return <div className="productos__status productos__status--error">Error: {error}</div>

  return (
    <div className="container py-4">
      <div className="productos__header">
        <h1 className="productos__title">{showOffers ? 'Ofertas' : 'Lista de Productos'}</h1>
        {showOffers && <p className="productos__subtitle">Encuentra los productos con descuento disponibles ahora.</p>}
      </div>
      <div className="productos__layout">
        <aside className="productos__sidebar">
          <h2 className="filter__section-title filter__section-title--spaced">Ordenar por</h2>
          <div className="cat-pills">
            <button
              type="button"
              className={`cat-pill ${sortOption === 'precio-menor' ? 'cat-pill--active' : ''}`}
              onClick={() => setSortOption('precio-menor')}
            >
              Precio menor
            </button>
            <button
              type="button"
              className={`cat-pill ${sortOption === 'precio-mayor' ? 'cat-pill--active' : ''}`}
              onClick={() => setSortOption('precio-mayor')}
            >
              Precio mayor
            </button>
            <button
              type="button"
              className={`cat-pill ${sortOption === 'nombre' ? 'cat-pill--active' : ''}`}
              onClick={() => setSortOption('nombre')}
            >
              Nombre
            </button>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
          <BrandFilter
            brands={brands}
            selectedBrandId={selectedBrandId}
            onSelect={handleBrandSelect}
          />

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
