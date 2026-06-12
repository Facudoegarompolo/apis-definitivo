import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api/usuarios';

const getSafeUser = (userData) => {
  if (!userData) {
    return null;
  }

  return {
    id: userData.id,
    nombre: userData.nombre,
    email: userData.email
  };
};

// Lee datos guardados para que la sesion siga activa al recargar la pagina.
const savedToken = localStorage.getItem('token');
const getSavedUser = () => {
  try {
    return getSafeUser(JSON.parse(localStorage.getItem('user') || 'null'));
  } catch {
    return null;
  }
};

const savedUser = getSavedUser();

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null
};

const saveSession = ({ token, usuario }) => {
  if (token) {
    localStorage.setItem('token', token);
  }

  if (usuario) {
    localStorage.setItem('user', JSON.stringify(getSafeUser(usuario)));
  }
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getErrorMessage = async (response, defaultMessage) => {
  const text = await response.text();
  return text || defaultMessage;
};

const removePassword = (userData) => {
  const safeUserData = { ...userData };
  delete safeUserData.password;
  return safeUserData;
};

const getAuthData = (payload, fallbackUser) => {
  const usuario = payload?.usuario || payload?.user || payload || fallbackUser;

  return {
    token: payload?.token || null,
    usuario: getSafeUser(usuario)
  };
};

// POST /api/usuarios/login
// Autentica al usuario y devuelve { token, usuario } desde el backend.
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'Credenciales incorrectas'));
    }

    return response.json();
  }
);

// POST /api/usuarios/registro
// Crea el usuario. El backend actual tambien devuelve token y usuario.
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'Error en el registro'));
    }

    return response.json();
  }
);

// GET /api/usuarios/:id
// Obtiene los datos actualizados del usuario autenticado.
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId, { getState, rejectWithValue }) => {
    const { token } = getState().user;

    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo cargar el perfil'));
    }

    return response.json();
  }
);

// PUT /api/usuarios/:id
// Queda preparado para cuando el backend habilite editar el perfil.
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ id, userData }, { getState, rejectWithValue }) => {
    const { token } = getState().user;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo actualizar el perfil'));
    }

    return response.json();
  }
);

// DELETE /api/usuarios/:id
// Elimina el usuario y limpia la sesion local.
export const deleteUserProfile = createAsyncThunk(
  'user/deleteUserProfile',
  async (userId, { getState, rejectWithValue }) => {
    const { token } = getState().user;

    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo eliminar el usuario'));
    }

    return userId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearSession();
    },
    updateLocalUser: (state, action) => {
      // Actualiza datos simples del usuario sin llamar al backend.
      state.user = getSafeUser({
        ...state.user,
        ...action.payload
      });
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, usuario } = getAuthData(action.payload, removePassword(action.meta.arg));

        state.loading = false;
        state.token = token;
        state.user = usuario;
        state.isAuthenticated = Boolean(token);
        saveSession({ token, usuario });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No se pudo iniciar sesion';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { token, usuario } = getAuthData(action.payload, removePassword(action.meta.arg));

        state.loading = false;
        state.token = token;
        state.user = usuario;
        state.isAuthenticated = Boolean(token);
        saveSession({ token, usuario });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No se pudo registrar el usuario';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearSession();
      });
  }
});

export const { logout, updateLocalUser } = userSlice.actions;

export default userSlice.reducer;
