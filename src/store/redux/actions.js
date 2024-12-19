export const setProducts = (products) => {
  return {
    type: 'SET_PRODUCTS',
    payload: products,
  };
};

// Action untuk login
export const login = (userData) => {
  // Simpan data login ke localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  
  return {
    type: 'LOGIN',
    payload: userData,
  };
};

// Action untuk logout
export const logout = () => {
  // Hapus data dari localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  
  return {
    type: 'LOGOUT',
  };
};

// Action untuk login default
export const defaultLogin = (username, password) => {
  return (dispatch) => {
    // Kredensial default
    const defaultUser = { username: 'johnd', password: 'm38rmF$', email: 'johnd@example.com' };

    // Validasi username dan password
    if (username === defaultUser.username && password === defaultUser.password) {
      const userData = { username: defaultUser.username, email: defaultUser.email };
      dispatch(login(userData));
    } else {
      throw new Error('Invalid username or password');
    }
  };
};

export const updateStock = (updatedProducts) => ({
  type: 'UPDATE_STOCK',
  payload: updatedProducts,
});