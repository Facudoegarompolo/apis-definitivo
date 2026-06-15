import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api/carrito';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const fetchCarrito = createAsyncThunk(
  'cart/fetchCarrito',
  async (usuarioId, { rejectWithValue }) => {
    const res = await fetch(`${API_URL}/${usuarioId}`, { headers: getHeaders() });
    if (!res.ok) return rejectWithValue('Error al cargar carrito');
    return res.json();
  }
);

export const agregarItemCarrito = createAsyncThunk(
  'cart/agregarItem',
  async ({ usuarioId, productoId, cantidad = 1 }, { rejectWithValue }) => {
    const res = await fetch(`${API_URL}/${usuarioId}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productoId, cantidad })
    });
    if (!res.ok) return rejectWithValue('Error al agregar item');
    return res.json();
  }
);

export const actualizarItemCarrito = createAsyncThunk(
  'cart/actualizarItem',
  async ({ usuarioId, productoId, cantidad }, { rejectWithValue }) => {
    const res = await fetch(`${API_URL}/${usuarioId}/items/${productoId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ productoId, cantidad })
    });
    if (!res.ok) return rejectWithValue('Error al actualizar item');
    return res.json();
  }
);

export const eliminarItemCarrito = createAsyncThunk(
  'cart/eliminarItem',
  async ({ usuarioId, productoId }, { rejectWithValue }) => {
    const res = await fetch(`${API_URL}/${usuarioId}/items/${productoId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) return rejectWithValue('Error al eliminar item');
    return res.json();
  }
);

export const vaciarCarritoDB = createAsyncThunk(
  'cart/vaciarDB',
  async (usuarioId, { rejectWithValue }) => {
    const res = await fetch(`${API_URL}/${usuarioId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) return rejectWithValue('Error al vaciar carrito');
  }
);

// Mapea los items que devuelve el backend al formato que usa Redux
const mapItems = (items = []) =>
  items.map(item => ({
    id: item.productoId,
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad
  }));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    // Todos los thunks que devuelven CarritoResponse actualizan el estado igual
    const handleCarritoResponse = (state, action) => {
      if (!action.payload) return;
      state.items = mapItems(action.payload.items);
      state.total = action.payload.total ?? 0;
    };

    builder
      .addCase(fetchCarrito.fulfilled, handleCarritoResponse)
      .addCase(agregarItemCarrito.fulfilled, handleCarritoResponse)
      .addCase(actualizarItemCarrito.fulfilled, handleCarritoResponse)
      .addCase(eliminarItemCarrito.fulfilled, handleCarritoResponse)
      .addCase(vaciarCarritoDB.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;