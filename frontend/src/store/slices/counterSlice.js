// Importa createSlice para crear reducers de forma simplificada
import { createSlice } from '@reduxjs/toolkit';

// Define un slice de Redux que maneja el estado del contador
const counterSlice = createSlice({
  name: 'counter', // Nombre del slice o estado del contador
  initialState: { value: 0 }, // Estado inicial: contador en 0
  reducers: { // agrupa todas las funciones que modifican el estado

    // state = { value: 0 } (el estado actual del contador)
    increment: (state) => { 
      state.value += 1;
    },

    decrement: (state) => { 
      state.value -= 1;
    },

    // action es un objeto que contiene la información que se envía cuando se dispara una acción.
    // action = {
    //   type: 'counter/incrementByAmount', // Tipo de acción (generado automáticamente)
    //   payload: 5                         // El valor que enviaste
    // }
    // Cuando haces esto:
    // dispatch(incrementByAmount(5));
    incrementByAmount: (state, action) => { // Acción que suma una cantidad personalizada
      state.value += action.payload; // action.payload contiene el valor a sumar
    },

    reset: (state) => { // Acción que reinicia el contador a 0
      state.value = 0;
    },
  },
});

// Exporta las acciones para usarlas en componentes
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Exporta el reducer para agregarlo al estor
export default counterSlice.reducer;
