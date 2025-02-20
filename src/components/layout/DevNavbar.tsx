import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Menu, User, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import AuthApi from '@/service/Api/AuthApi';
import { logout } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Home', delay: 0, url: '/' },
  { name: 'Sessions', delay: 0.1, url: '/sessions' },
  { name: 'Community', delay: 0.2, url: '/community' },
  { name: 'Resources', delay: 0.3, url: '/resources' },
  { name: 'Blog', delay: 0.4, url: '/blog' },
  { name: 'Quiz', delay: 0.5, url: '/quiz' },
  { name: 'About', delay: 0.6, url: '/about' },
];

const DevNavbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { scrollY } = useScroll();
  const dispatch = useAppDispatch();
  const { isAuthenticated, username, email } = useAppSelector((state) => state.user);
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await AuthApi.logOut();
      dispatch(logout());
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      toast.success('Logout Successfully');
    } catch (error) {
      console.error('Logout failed: ', error);
      toast.error('Logout failed')
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && isSearchOpen) {
      setIsProfileOpen(false);
    }
  }, [isSearchOpen, isMobile]);

  const navBackground = useTransform(scrollY, [0, 100], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.95)"]);
  const navHeight = useTransform(scrollY, [0, 100], ["5rem", "4rem"]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.8]);

  const renderAuthSection = () => {
    if (isAuthenticated) {
      return (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative"
          >
            <img
              src="https://i.imghippo.com/files/GFY5894omo.jpg"
              alt="Profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-blue-500 object-cover"
            />
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-0 mt-3 w-72 bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
              >
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://i.imghippo.com/files/GFY5894omo.jpg"
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">{username}</p>
                      <p className="text-gray-400 text-sm">{email}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-gray-900 transition-colors group"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/developer/profile')
                  }}
                >
                  <div className="bg-gray-800 p-2 rounded-full group-hover:bg-blue-900 transition-colors">
                    <User className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Profile</p>
                    <p className="text-gray-400 text-xs">View and edit your profile</p>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-gray-900 transition-colors group"
                  onClick={handleLogout}
                >
                  <div className="bg-gray-800 p-2 rounded-full group-hover:bg-red-900 transition-colors">
                    <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Logout</p>
                    <p className="text-gray-400 text-xs">Sign out of your account</p>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Link to="/developer/auth/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-900 border border-white transition-colors"
          >
            Sign In
          </motion.button>
        </Link>
      </div>
    );
  };

  return (
    <motion.nav
      style={{ background: navBackground, height: navHeight, backdropFilter: "blur(10px)" }}
      className="fixed w-full top-0 left-0 z-50"
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6 h-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            <motion.div style={{ scale: logoScale }} className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden">
                  <img 
                    src="https://i.imghippo.com/files/NPo1259thc.png" 
                    alt="DevConnect Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="text-white text-lg md:text-xl font-bold hidden md:block">DevConnect</span>
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === `/${item.url}`;
              return (
                <motion.div 
                  key={item.name} 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: item.delay, duration: 0.3 }} 
                  whileHover={{ y: -2 }}
                >
                  <Link to={`${item.url}`} className="relative px-4 py-2 group">
                    <span className={`relative z-10 text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="navbar-active" 
                        className="absolute inset-0 bg-purple-600 rounded-full opacity-20" 
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }} 
                      />
                    )}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" 
                      whileHover={{ scale: 1.05 }} 
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <motion.div layout className="flex items-center space-x-2 relative">
              <motion.div
                className="relative overflow-hidden"
                style={{
                  width: isSearchOpen ? '250px' : 0,
                  maxWidth: '250px',
                  transition: "width 0.4s ease-in-out",
                }}
              >
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div 
                      className="relative w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.input
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        type="text"
                        placeholder="Search DevConnect..."
                        className={`
                          bg-black/50 text-white px-4 py-2 rounded-full w-full 
                          border border-gray-700
                          focus:outline-none 
                          text-sm md:text-base
                        `}
                      />
                      {isSearchFocused && (
                        <motion.div 
                          layoutId="search-focus-ring"
                          className="absolute inset-0 rounded-full pointer-events-none 
                            border-2 border-gray-500 
                            animate-pulse"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="bg-black text-white p-2 rounded-full"
              >
                {isSearchOpen ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Search className="w-4 h-4 md:w-5 md:h-5" />}
              </motion.button>
            </motion.div>

            {!(isMobile && isSearchOpen) && renderAuthSection()}
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-40 md:hidden"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="w-64 h-full bg-black/95 p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://i.imghippo.com/files/NPo1259thc.png" 
                        alt="DevConnect Logo" 
                        className="w-10 h-10 object-cover" 
                      />
                      <span className="text-white text-xl font-bold">DevConnect</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>


                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to={`/${item.name.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-white transition-colors 
                          hover:text-blue-500 
                          hover:pl-4
                          hover:bg-white/10 
                          rounded-lg 
                          group"
                      >
                        <span className="transition-transform group-hover:ml-2">
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  {isAuthenticated ? (
                    <div className="mt-6 border-t border-gray-800 pt-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <img
                          src="https://i.imghippo.com/files/GFY5894omo.jpg"
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{username}</p>
                          <p className="text-gray-400 text-sm">{email}</p>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                         
                        }}
                      >
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Profile</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-900 rounded-lg transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Logout</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="mt-6 border-t border-gray-800 pt-6">
                      <Link 
                        to="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-900 transition-colors"
                        >
                          Sign In
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default DevNavbar;