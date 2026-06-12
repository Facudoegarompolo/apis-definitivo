import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    // array de objetos de productos: id, nombre, precio, 
    items: []
  },

  reducers: {
    // action = {
    //   type: 'favorite/addFavorite', // Tipo de acción (generado automáticamente)
    //   payload: { id: 1, nombre: 'Producto A', precio: 100 } // El producto que enviaste
    // }
    // en el componeten dispatch(addFavorite(producto

    addFavorite: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push(product);
      }
    },
    
    removeFavorite: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearFavorites: (state) => {
      state.items = [];
    }

  }
});

export const { addFavorite, removeFavorite, clearFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
