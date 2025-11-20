import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pendingCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay - Outside header for proper z-index */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
                <h2 className="text-xl font-bold text-white">Menü</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-white hover:bg-white/20 transition-colors"
                  aria-label="Menüyü Kapat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex flex-col flex-1 p-4 space-y-2">
                <Link
                  to="/"
                  className="text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 py-3 px-4 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 py-3 px-4 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 py-3 px-4 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  İletişim
                </Link>

                <div className="border-t border-gray-200 my-2"></div>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/create-listing"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      İlan Ver
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center justify-between text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 py-3 px-4 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Mesajlar
                      </div>
                      {pendingCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 py-3 px-4 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-base">
                          {user?.firstName?.[0] || 'U'}
                        </div>
                        {pendingCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingCount > 9 ? '9+' : pendingCount}
                          </span>
                        )}
                      </div>
                      <span className="flex-1">{user?.firstName} {user?.lastName}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left px-4 py-3 text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-lg border border-gray-200"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-center text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 py-3 px-4 rounded-lg border border-gray-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      to="/register"
                      className="text-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl md:text-3xl font-extrabold hover:scale-105 transition-transform duration-300 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-blue-900">Mucize</span>
              <span className="text-green-400">O</span>
              <span className="text-green-400">l</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link
              to="/"
              className="relative text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group text-sm xl:text-base"
            >
              Ana Sayfa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/about"
              className="relative text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group text-sm xl:text-base"
            >
              Hakkımızda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/contact"
              className="relative text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group text-sm xl:text-base"
            >
              İletişim
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="relative px-4 xl:px-6 py-2 xl:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform overflow-hidden group text-sm xl:text-base"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden xl:inline">İlan Ver</span>
                    <span className="xl:hidden">İlan</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  to="/messages"
                  className="relative text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group text-sm xl:text-base"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="hidden xl:inline">Mesajlar</span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 group relative text-sm xl:text-base"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform duration-300">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden xl:inline">{user?.firstName} {user?.lastName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 xl:px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors duration-300 hover:bg-red-50 rounded-lg text-sm xl:text-base"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-primary-600 transition-colors duration-300 relative group text-sm xl:text-base"
                >
                  Giriş Yap
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/register"
                  className="relative px-4 xl:px-6 py-2 xl:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform overflow-hidden group text-sm xl:text-base"
                >
                  <span className="relative z-10">Kayıt Ol</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
    </>
  );
};

export default Header;

