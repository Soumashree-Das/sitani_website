import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8090/api/v1/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API fails, clear client-side and redirect
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      <LogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;