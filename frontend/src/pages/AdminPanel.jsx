import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { API_BASE_URL } from '../services/apiBase'
import { fetchWithCsrf } from '../services/csrfClient'
import './AdminPanel.css'

const API_URL = API_BASE_URL

const emptyProductForm = {
  id: null,
  nombre: '',
  descripcion: '',
  precio: '',
  oferta: false,
  precioOferta: '',
  stock: '',
  marcaId: '',
  categoriaIds: [],
}

const emptyCategoryForm = {
  nombre: '',
  categoriaPadreId: '',
}

const emptyBrandForm = {
  nombre: '',
}

function normalizeProductForm(product) {
  return {
    id: product.id,
    nombre: product.nombre ?? '',
    descripcion: product.descripcion ?? '',
    precio: product.precio ?? '',
    oferta: product.oferta ?? false,
    precioOferta: product.precioOferta ?? '',
    stock: product.stock ?? '',
    marcaId: product.marca?.id ? String(product.marca.id) : '',
    categoriaIds: product.categorias?.map((category) => String(category.id)) ?? [],
  }
}

function AdminPanel() {
  const { user, isAuthenticated, sessionChecked } = useSelector((state) => state.user)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)
  const [brandForm, setBrandForm] = useState(emptyBrandForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const isAdmin = user?.rol === 'ROLE_ADMIN'

  const parentCategoryOptions = useMemo(
    () => categories.filter((category) => String(category.id) !== String(categoryForm.id)),
    [categories, categoryForm.id],
  )

  const loadData = useCallback(async () => {
    setError('')
    setLoading(true)

    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      }
      const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        fetch(`${API_URL}/productos`, requestOptions),
        fetch(`${API_URL}/categorias`, requestOptions),
        fetch(`${API_URL}/marcas`, requestOptions),
      ])

      if (!productsResponse.ok || !categoriesResponse.ok || !brandsResponse.ok) {
        throw new Error('No se pudo cargar la informacion del panel')
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
  }, [])

  useEffect(() => {
    if (sessionChecked && isAuthenticated && isAdmin) {
      const timeoutId = window.setTimeout(() => {
        loadData()
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }
  }, [sessionChecked, isAuthenticated, isAdmin, loadData])

  if (!sessionChecked) {
    return <div className="admin-status">Cargando sesion...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3500)
  }

  const handleProductField = (event) => {
    const { name, value } = event.target
    setProductForm((current) => ({ ...current, [name]: value }))
  }

  const toggleProductCategory = (categoryId) => {
    setProductForm((current) => {
      const categoriaIds = current.categoriaIds.includes(categoryId)
        ? current.categoriaIds.filter((id) => id !== categoryId)
        : [...current.categoriaIds, categoryId]

      return { ...current, categoriaIds }
    })
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nombre: productForm.nombre.trim(),
      descripcion: productForm.descripcion.trim(),
      precio: Number(productForm.precio),
      oferta: Boolean(productForm.oferta),
      precioOferta: productForm.oferta ? Number(productForm.precioOferta) : null,
      stock: Number(productForm.stock),
      marcaId: productForm.marcaId ? Number(productForm.marcaId) : null,
      categoriaIds: productForm.categoriaIds.map(Number),
    }

    const isEditing = Boolean(productForm.id)

    try {
      const response = await fetchWithCsrf(
        `${API_URL}/productos${isEditing ? `/${productForm.id}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw new Error(isEditing ? 'No se pudo modificar el producto' : 'No se pudo crear el producto')
      }

      setProductForm(emptyProductForm)
      await loadData()
      showNotice(isEditing ? 'Producto actualizado' : 'Producto agregado')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    setSaving(true)
    setError('')

    try {
      const response = await fetchWithCsrf(`${API_URL}/productos/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto')
      }

      await loadData()
      showNotice('Producto eliminado')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const adjustStock = (amount) => {
    setProductForm((current) => ({
      ...current,
      stock: Math.max(0, Number(current.stock || 0) + amount),
    }))
  }

  const handleBrandSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nombre: brandForm.nombre.trim(),
    }

    try {
      const response = await fetchWithCsrf(`${API_URL}/marcas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('No se pudo crear la marca')
      }

      setBrandForm(emptyBrandForm)
      await loadData()
      showNotice('Marca agregada')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBrand = async (brandId) => {
    setSaving(true)
    setError('')

    try {
      const response = await fetchWithCsrf(`${API_URL}/marcas/${brandId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar la marca')
      }

      await loadData()
      showNotice('Marca eliminada')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nombre: categoryForm.nombre.trim(),
      categoriaPadreId: categoryForm.categoriaPadreId ? Number(categoryForm.categoriaPadreId) : null,
    }

    try {
      const response = await fetchWithCsrf(`${API_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('No se pudo crear la categoria')
      }

      setCategoryForm(emptyCategoryForm)
      await loadData()
      showNotice('Categoria agregada')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    setSaving(true)
    setError('')

    try {
      const response = await fetchWithCsrf(`${API_URL}/categorias/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar la categoria')
      }

      await loadData()
      showNotice('Categoria eliminada')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Panel de administrador</p>
          <h1>Catalogo y stock</h1>
        </div>
        <button className="admin-refresh" type="button" onClick={loadData} disabled={loading || saving}>
          Actualizar
        </button>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}
      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <div className="admin-status">Cargando datos...</div>
      ) : (
        <div className="admin-grid">
          <form className="admin-panel admin-form" onSubmit={handleCategorySubmit}>
            <h2>Categorias</h2>

            <label>
              Nombre
              <input
                value={categoryForm.nombre}
                onChange={(event) => setCategoryForm((current) => ({ ...current, nombre: event.target.value }))}
                required
              />
            </label>

            <label>
              Categoria padre
              <select
                value={categoryForm.categoriaPadreId}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, categoriaPadreId: event.target.value }))
                }
              >
                <option value="">Sin padre</option>
                {parentCategoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </label>

            <button className="admin-primary" type="submit" disabled={saving}>
              Agregar categoria
            </button>

            <div className="admin-list">
              {categories.map((category) => (
                <div className="admin-list-row" key={category.id}>
                  <span>{category.nombre}</span>
                  <button type="button" onClick={() => handleDeleteCategory(category.id)} disabled={saving}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </form>

          <form className="admin-panel admin-form" onSubmit={handleBrandSubmit}>
            <h2>Marcas</h2>

            <label>
              Nombre
              <input
                value={brandForm.nombre}
                onChange={(event) => setBrandForm((current) => ({ ...current, nombre: event.target.value }))}
                required
              />
            </label>

            <button className="admin-primary" type="submit" disabled={saving}>
              Agregar marca
            </button>

            <div className="admin-list">
              {brands.map((brand) => (
                <div className="admin-list-row" key={brand.id}>
                  <span>{brand.nombre}</span>
                  <button type="button" onClick={() => handleDeleteBrand(brand.id)} disabled={saving}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </form>

          <form className="admin-panel admin-form" onSubmit={handleProductSubmit}>
            <h2>{productForm.id ? 'Modificar stock' : 'Agregar producto'}</h2>

            <label>
              Nombre
              <input name="nombre" value={productForm.nombre} onChange={handleProductField} required />
            </label>

            <label>
              Marca
              <select name="marcaId" value={productForm.marcaId} onChange={handleProductField}>
                <option value="">Sin marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Descripcion
              <textarea
                name="descripcion"
                value={productForm.descripcion}
                onChange={handleProductField}
                rows="3"
              />
            </label>

            <div className="admin-form-row">
              <label>
                Precio
                <input
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.precio}
                  onChange={handleProductField}
                  required
                />
              </label>

              <label className="admin-checkbox-label">
                <span>En oferta</span>
                <input
                  name="oferta"
                  type="checkbox"
                  checked={productForm.oferta}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, oferta: event.target.checked }))
                  }
                />
              </label>

              <label>
                Precio oferta
                <input
                  name="precioOferta"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.precioOferta}
                  onChange={handleProductField}
                  disabled={!productForm.oferta}
                />
              </label>

              <label>
                Stock
                <span className="admin-stock-control">
                  <button type="button" onClick={() => adjustStock(-1)} disabled={saving}>
                    -
                  </button>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.stock}
                    onChange={handleProductField}
                    required
                  />
                  <button type="button" onClick={() => adjustStock(1)} disabled={saving}>
                    +
                  </button>
                </span>
              </label>
            </div>

            <fieldset className="admin-categories-field">
              <legend>Categorias del producto</legend>
              <div className="admin-category-checks">
                {categories.map((category) => (
                  <label key={category.id}>
                    <input
                      type="checkbox"
                      checked={productForm.categoriaIds.includes(String(category.id))}
                      onChange={() => toggleProductCategory(String(category.id))}
                    />
                    {category.nombre}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="admin-actions">
              <button className="admin-primary" type="submit" disabled={saving}>
                {productForm.id ? 'Guardar cambios' : 'Agregar producto'}
              </button>
              {productForm.id && (
                <button type="button" onClick={() => setProductForm(emptyProductForm)} disabled={saving}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section className="admin-panel admin-products">
            <h2>Productos</h2>

            <div className="admin-table">
              {products.map((product) => (
                <div className="admin-product-row" key={product.id}>
                  <div>
                    <strong>{product.nombre}</strong>
                    <span>Marca: {product.marca?.nombre ?? 'Sin marca'}</span>
                    <span>Stock: {product.stock ?? 0}</span>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => setProductForm(normalizeProductForm(product))}>
                      Modificar
                    </button>
                    <button type="button" onClick={() => handleDeleteProduct(product.id)} disabled={saving}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default AdminPanel
