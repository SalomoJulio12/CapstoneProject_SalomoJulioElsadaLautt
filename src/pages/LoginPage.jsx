import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { defaultLogin } from '../store/redux/actions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('johnd'); // Default username
  const [password, setPassword] = useState('m38rmF$'); // Default password

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim data username dan password ke action
      await dispatch(defaultLogin(username, password));

      // Jika berhasil, tampilkan SweetAlert
      Swal.fire({
        title: 'Login Successful!',
        text: 'You have logged in successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate('/'); // Arahkan ke halaman utama
      });
    } catch (error) {
      // Jika gagal, tampilkan pesan error
      Swal.fire({
        title: 'Login Failed',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md bg-black text-white font-bold hover:bg-gray-800 ${
              loading && 'opacity-50 cursor-not-allowed'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;