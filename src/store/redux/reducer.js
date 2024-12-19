import { combineReducers } from 'redux';

// Reducer untuk autentikasi
const initialAuthState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true', // Ambil status login dari localStorage
  user: JSON.parse(localStorage.getItem('user')) || null,    // Ambil user dari localStorage
};

const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isLoggedIn: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

const initialState = {
  products: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: action.payload, // Update products dengan stok yang sudah dikurangi
      };
    default:
      return state;
  }
};

// Gabungkan semua reducer
const rootReducer = combineReducers({
  products: productReducer,
  auth: authReducer,
});

export default rootReducer;