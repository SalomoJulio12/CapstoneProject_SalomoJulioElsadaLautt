import { combineReducers } from 'redux';

// Reducer untuk autentikasi
const initialAuthState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true', // Ambil status login dari localStorage
  user: JSON.parse(localStorage.getItem('user')) || null,    // Ambil user dari localStorage
};

// Reducer untuk menangani status autentikasi
const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isLoggedIn: true, // Mengubah status isLoggedIn menjadi true saat pengguna login
        user: action.payload, // Menyimpan data pengguna dari payload aksi
      };
    case 'LOGOUT':
      return {
        isLoggedIn: false, // Mengubah status isLoggedIn menjadi false saat pengguna logout
        user: null, // Menghapus data pengguna
      };
    default:
      return state;
  }
};

const initialState = {
  products: [], // Inisialisasi state produk sebagai array kosong
};

// Reducer untuk menangani produk
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state, // Mempertahankan state lama (produk sebelumnya)
        products: action.payload, // Mengupdate produk dengan data produk yang diterima dari payload aksi
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
  products: productReducer, // Menambahkan reducer produk
  auth: authReducer, // Menambahkan reducer autentikasi
});

export default rootReducer;