import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            MucizeOl
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="relative text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group"
            >
              Ana Sayfa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    İlan Ver
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform duration-300">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <span>{user?.firstName} {user?.lastName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors duration-300 hover:bg-red-50 rounded-lg"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 relative group"
                >
                  Giriş Yap
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/register"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform overflow-hidden group"
                >
                  <span className="relative z-10">Kayıt Ol</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

