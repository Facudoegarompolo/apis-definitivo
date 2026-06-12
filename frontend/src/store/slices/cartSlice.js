import { createSlice } from '@reduxjs/toolkit';

// cartSlice cumple la función del CartProvider en useContext
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // listado de productos en el carrito
    items: [],
    total: 0
  },
  // agrupa todas las funciones que modifican el estado del carrito
  reducers: {
    // función para agregar un producto al carrito
    // state = { items: [] } (el estado actual del carrito)
    // action es un objeto que contiene la acción y el dato enviado (payload)
    // action = {
    //   type: 'cart/addToCart', // Tipo de acción (generado automáticamente)
    //   payload: { id: 1, nombre: 'Producto A', precio: 100 } // El producto que enviaste
    // }
    addToCart: (state, action) => {
      const product = action.payload;
      // find busca en items si ya existe un producto con el mismo id. 
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        // si no encuentra el producto en el array items
        // agrega dicho producto al array items del carrito
        state.items.push(product);
      }

      //TODO: ssanchez - si no existe, incrementar la cantidad del producto
    },

    removeFromCart: (state, action) => {
      // filter crea un nuevo array sin el producto que queremos eliminar
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
