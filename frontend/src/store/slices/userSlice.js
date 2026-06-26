import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiUrl } from '../../services/apiBase'
import { fetchWithCsrf } from '../../services/csrfClient'

const API_URL = apiUrl('/usuarios')

const getSafeUser = (userData) => {
  if (!userData) {
    return null
  }

  return {
    id: userData.id,
    nombre: userData.nombre,
    email: userData.email,
  }
}

const getSavedUser = () => {
  try {
    return getSafeUser(JSON.parse(localStorage.getItem('user') || 'null'))
  } catch {
    return null
  }
}

const savedToken = localStorage.getItem('token')
const savedUser = getSavedUser()

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken),
  sessionChecked: false,
  loading: false,
  error: null,
}

const saveSession = ({ token, usuario }) => {
  if (token) {
    localStorage.setItem('token', token)
  }

  if (usuario) {
    localStorage.setItem('user', JSON.stringify(getSafeUser(usuario)))
  }
}

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const getErrorMessage = async (response, defaultMessage) => {
  const text = await response.text()
  return text || defaultMessage
}

const removePassword = (userData) => {
  const safeUserData = { ...userData }
  delete safeUserData.password
  return safeUserData
}

const getAuthData = (payload, fallbackUser) => {
  const usuario = payload?.usuario || payload?.user || payload || fallbackUser

  return {
    token: payload?.token || null,
    usuario: getSafeUser(usuario),
  }
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'Credenciales incorrectas'))
    }

    return response.json()
  }
)

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'Error en el registro'))
    }

    return response.json()
  }
)

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo cargar el perfil'))
    }

    return response.json()
  }
)

export const checkSession = createAsyncThunk(
  'user/checkSession',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No hay sesión activa'))
    }

    return response.json()
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ id, userData }, { rejectWithValue }) => {
    const response = await fetchWithCsrf(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo actualizar el perfil'))
    }

    return response.json()
  }
)

export const deleteUserProfile = createAsyncThunk(
  'user/deleteUserProfile',
  async (userId, { rejectWithValue }) => {
    const response = await fetchWithCsrf(`${API_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo eliminar el usuario'))
    }

    return userId
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      clearSession()
    },
    updateLocalUser: (state, action) => {
      state.user = getSafeUser({
        ...state.user,
        ...action.payload,
      })
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    setSessionChecked: (state) => {
      state.sessionChecked = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, usuario } = getAuthData(action.payload, removePassword(action.meta.arg))

        state.loading = false
        state.token = token
        state.user = usuario
        state.isAuthenticated = Boolean(usuario)
        saveSession({ token, usuario })
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'No se pudo iniciar sesion'
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { token, usuario } = getAuthData(action.payload, removePassword(action.meta.arg))

        state.loading = false
        state.token = token
        state.user = usuario
        state.isAuthenticated = Boolean(usuario)
        saveSession({ token, usuario })
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'No se pudo registrar el usuario'
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload)
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(checkSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        const usuario = getSafeUser(action.payload)

        state.loading = false
        state.sessionChecked = true
        state.user = usuario
        state.isAuthenticated = Boolean(usuario)
        saveSession({ usuario })
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false
        state.sessionChecked = true
        state.user = null
        state.token = null
        state.isAuthenticated = false
        clearSession()
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload)
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        clearSession()
      })
  },
})

export const { logout, updateLocalUser, restoreSession } = userSlice.actions
export default userSlice.reducer
