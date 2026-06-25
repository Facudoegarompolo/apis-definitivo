import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiUrl } from '../../services/apiBase'
import { fetchWithCsrf } from '../../services/csrfClient'

const API_URL = apiUrl('/favoritos')

async function getErrorMessage(response, defaultMessage) {
  const message = await response.text()
  return message || defaultMessage
}

export const loadFavorites = createAsyncThunk(
  'favorite/loadFavorites',
  async (_, { rejectWithValue }) => {
    const response = await fetch(API_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudieron cargar los favoritos'))
    }

    return response.json()
  },
)

export const addFavorite = createAsyncThunk(
  'favorite/addFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetchWithCsrf(`${API_URL}/${productId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        return rejectWithValue(await getErrorMessage(response, 'No se pudo agregar el favorito'))
      }

      return response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const removeFavorite = createAsyncThunk(
  'favorite/removeFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetchWithCsrf(`${API_URL}/${productId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        return rejectWithValue(await getErrorMessage(response, 'No se pudo eliminar el favorito'))
      }

      return response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  items: [],
  loading: false,
  savingProductIds: [],
  error: null,
}

function markSaving(state, action) {
  const productId = String(action.meta.arg)
  if (!state.savingProductIds.includes(productId)) {
    state.savingProductIds.push(productId)
  }
  state.error = null
}

function finishSaving(state, action) {
  const productId = String(action.meta.arg)
  state.savingProductIds = state.savingProductIds.filter((id) => id !== productId)
}

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    resetFavorites: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'No se pudieron cargar los favoritos'
      })
      .addCase(addFavorite.pending, markSaving)
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items = action.payload
        finishSaving(state, action)
      })
      .addCase(addFavorite.rejected, (state, action) => {
        finishSaving(state, action)
        state.error = action.payload || 'No se pudo agregar el favorito'
      })
      .addCase(removeFavorite.pending, markSaving)
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = action.payload
        finishSaving(state, action)
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        finishSaving(state, action)
        state.error = action.payload || 'No se pudo eliminar el favorito'
      })
  },
})

export const { resetFavorites } = favoriteSlice.actions

export default favoriteSlice.reducer
