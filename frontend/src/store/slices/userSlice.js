import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWithCsrf, initializeCsrfToken } from '../../services/csrfClient';

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

const initialState = {
  user: null,
  isAuthenticated: false,
  sessionChecked: false,
  loading: false,
  error: null
};

const getErrorMessage = async (response, defaultMessage) => {
  const text = await response.text();
  return text || defaultMessage;
};

const getAuthUser = (payload) => getSafeUser(payload?.usuario || payload?.user || payload);

// La cookie HttpOnly se guarda desde Set-Cookie y se envia con credentials: include.
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
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

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      credentials: 'include',
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

// Al recargar la pagina, el backend valida la cookie y devuelve el usuario actual.
export const restoreSession = createAsyncThunk(
  'user/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      await initializeCsrfToken();
    } catch {
      return rejectWithValue(null);
    }

    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

    if (!response.ok) {
      return rejectWithValue(null);
    }

    return response.json();
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    let response;

    try {
      response = await fetchWithCsrf(`${API_URL}/logout`, {
        method: 'POST'
      });
    } catch {
      return rejectWithValue('No se pudo inicializar la proteccion CSRF');
    }

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo cerrar la sesion'));
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo cargar el perfil'));
    }

    return response.json();
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ id, userData }, { rejectWithValue }) => {
    let response;

    try {
      response = await fetchWithCsrf(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
    } catch {
      return rejectWithValue('No se pudo inicializar la proteccion CSRF');
    }

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo actualizar el perfil'));
    }

    return response.json();
  }
);

export const deleteUserProfile = createAsyncThunk(
  'user/deleteUserProfile',
  async (userId, { rejectWithValue }) => {
    let response;

    try {
      response = await fetchWithCsrf(`${API_URL}/${userId}`, {
        method: 'DELETE'
      });
    } catch {
      return rejectWithValue('No se pudo inicializar la proteccion CSRF');
    }

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response, 'No se pudo eliminar el usuario'));
    }

    return userId;
  }
);

const clearSession = (state) => {
  state.user = null;
  state.isAuthenticated = false;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateLocalUser: (state, action) => {
      state.user = getSafeUser({
        ...state.user,
        ...action.payload
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = getAuthUser(action.payload);
        state.isAuthenticated = Boolean(state.user);
        state.sessionChecked = true;
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
        state.loading = false;
        state.user = getAuthUser(action.payload);
        state.isAuthenticated = Boolean(state.user);
        state.sessionChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No se pudo registrar el usuario';
      })
      .addCase(restoreSession.pending, (state) => {
        state.sessionChecked = false;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload);
        state.isAuthenticated = Boolean(state.user);
        state.sessionChecked = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        clearSession(state);
        state.sessionChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearSession(state);
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No se pudo cerrar la sesion';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = getSafeUser(action.payload);
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        clearSession(state);
      });
  }
});

export const { updateLocalUser } = userSlice.actions;

export default userSlice.reducer;
