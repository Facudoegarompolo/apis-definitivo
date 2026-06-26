import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiUrl } from '../../services/apiBase'
import { fetchWithCsrf } from '../../services/csrfClient'

const FAVORITES_API_URL = apiUrl('/favoritos')

export const loadFavorites = createAsyncThunk(
  'favorite/loadFavorites',
  async (_, { rejectWithValue }) => {
    const res = await fetch(FAVORITES_API_URL, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    if (!res.ok) return rejectWithValue('No se pudieron cargar los favoritos')
    return res.json()
  }
)

export const addFavorite = createAsyncThunk(
  'favorite/addFavorite',
  async (productoId, { rejectWithValue }) => {
    const res = await fetchWithCsrf(`${FAVORITES_API_URL}/${productoId}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return rejectWithValue('No se pudo agregar a favoritos')
    return res.json()
  }
)

export const removeFavorite = createAsyncThunk(
  'favorite/removeFavorite',
  async (productoId, { rejectWithValue }) => {
    const res = await fetchWithCsrf(`${FAVORITES_API_URL}/${productoId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return rejectWithValue('No se pudo eliminar el favorito')
    return res.json()
  }
)

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    items: [],
    savingProductIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = []
      state.error = null
    },
    resetFavorites: (state) => {
      state.items = []
      state.savingProductIds = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload ?? []
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'No se pudieron cargar los favoritos'
      })
      .addCase(addFavorite.pending, (state, action) => {
        state.error = null
        const productId = String(action.meta.arg)
        if (!state.savingProductIds.includes(productId)) {
          state.savingProductIds.push(productId)
        }
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.items = action.payload ?? []
        state.savingProductIds = state.savingProductIds.filter(
          (id) => id !== String(action.meta.arg)
        )
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'No se pudo agregar a favoritos'
        state.savingProductIds = state.savingProductIds.filter(
          (id) => id !== String(action.meta.arg)
        )
      })
      .addCase(removeFavorite.pending, (state, action) => {
        state.error = null
        const productId = String(action.meta.arg)
        if (!state.savingProductIds.includes(productId)) {
          state.savingProductIds.push(productId)
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.items = action.payload ?? []
        state.savingProductIds = state.savingProductIds.filter(
          (id) => id !== String(action.meta.arg)
        )
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'No se pudo eliminar el favorito'
        state.savingProductIds = state.savingProductIds.filter(
          (id) => id !== String(action.meta.arg)
        )
      })
  },
})

export const { clearFavorites, resetFavorites } = favoriteSlice.actions
export default favoriteSlice.reducer