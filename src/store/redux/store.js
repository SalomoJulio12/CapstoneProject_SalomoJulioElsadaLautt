import { configureStore } from '@reduxjs/toolkit'; // Mengimpor fungsi configureStore dari Redux Toolkit untuk konfigurasi store
import rootReducer from './reducer'; // Mengimpor rootReducer, yang menggabungkan semua reducer di aplikasi

// Membuat store Redux dengan configureStore yang disediakan oleh Redux Toolkit
const store = configureStore({
  reducer: rootReducer, // rootReducer adalah fungsi reducer utama yang menggabungkan semua slice reducer
});

export default store;