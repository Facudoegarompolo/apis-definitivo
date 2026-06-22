import { createSlice } from '@reduxjs/toolkit';

const hasSameId = (item, productId) => String(item.id) === String(productId);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: []
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => hasSameId(item, product.id));

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity ?? 1) + 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => hasSameId(cartItem, action.payload));
      if (item) item.quantity = (item.quantity ?? 1) + 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => hasSameId(cartItem, action.payload));
      if (!item) return;

      const quantity = item.quantity ?? 1;

      if (quantity === 1) {
        state.items = state.items.filter((cartItem) => !hasSameId(cartItem, action.payload));
      } else {
        item.quantity = quantity - 1;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => !hasSameId(item, action.payload));
    },

    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  selectCartItems(state).reduce((count, item) => count + (item.quantity ?? 1), 0);

export const selectCartTotal = (state) =>
  selectCartItems(state).reduce(
    (total, item) => total + Number(item.precio ?? item.price ?? 0) * (item.quantity ?? 1),
    0
  );

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
