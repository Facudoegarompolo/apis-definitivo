import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiUrl } from '../../services/apiBase'
import { fetchWithCsrf } from '../../services/csrfClient'

const CART_API_URL = apiUrl('/carrito')

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
})

export const fetchCarrito = createAsyncThunk(
  'cart/fetchCarrito',
  async (_, { rejectWithValue }) => {
    const res = await fetch(CART_API_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    if (!res.ok) return rejectWithValue('Error al cargar carrito')
    return res.json()
  }
)

export const agregarItemCarrito = createAsyncThunk(
  'cart/agregarItem',
  async ({ productoId, cantidad = 1 }, { rejectWithValue }) => {
    const res = await fetchWithCsrf(`${CART_API_URL}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productoId, cantidad }),
    })
    if (!res.ok) return rejectWithValue('Error al agregar item')
    return res.json()
  }
)

export const actualizarItemCarrito = createAsyncThunk(
  'cart/actualizarItem',
  async ({ productoId, cantidad }, { rejectWithValue }) => {
    const res = await fetchWithCsrf(`${CART_API_URL}/items/${productoId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ productoId, cantidad }),
    })
    if (!res.ok) return rejectWithValue('Error al actualizar item')
    return res.json()
  }
)

export const eliminarItemCarrito = createAsyncThunk(
  'cart/eliminarItem',
  async ({ productoId }, { rejectWithValue }) => {
    const res = await fetchWithCsrf(`${CART_API_URL}/items/${productoId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return rejectWithValue('Error al eliminar item')
    return res.json()
  }
)

export const vaciarCarritoDB = createAsyncThunk(
  'cart/vaciarDB',
  async (_, { rejectWithValue }) => {
    const res = await fetchWithCsrf(CART_API_URL, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return rejectWithValue('Error al vaciar carrito')
    return res
  }
)

const mapItems = (items = []) =>
  items.map((item) => ({
    id: item.productoId ?? item.id,
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad ?? item.quantity,
    quantity: item.cantidad ?? item.quantity ?? 1,
    subtotal: item.subtotal,
    imagen: item.imagen,
    oferta: item.oferta,
    precioOferta: item.precioOferta,
  }))

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, loading: false, error: null },
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const handleCarritoResponse = (state, action) => {
      if (!action.payload) return
      state.items = mapItems(action.payload.items)
      state.total = action.payload.total ?? 0
      state.loading = false
      state.error = null
    }

    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCarrito.fulfilled, handleCarritoResponse)
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al cargar carrito'
      })
      .addCase(agregarItemCarrito.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(agregarItemCarrito.fulfilled, handleCarritoResponse)
      .addCase(agregarItemCarrito.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al agregar item'
      })
      .addCase(actualizarItemCarrito.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(actualizarItemCarrito.fulfilled, handleCarritoResponse)
      .addCase(actualizarItemCarrito.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al actualizar item'
      })
      .addCase(eliminarItemCarrito.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(eliminarItemCarrito.fulfilled, handleCarritoResponse)
      .addCase(eliminarItemCarrito.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al eliminar item'
      })
      .addCase(vaciarCarritoDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(vaciarCarritoDB.fulfilled, (state) => {
        state.items = []
        state.total = 0
        state.loading = false
        state.error = null
      })
      .addCase(vaciarCarritoDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al vaciar carrito'
      })
  },
})

export const { clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0)
export const selectCartTotal = (state) => state.cart.total

export default cartSlice.reducer