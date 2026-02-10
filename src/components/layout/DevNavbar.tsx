import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Menu, User, LogOut, Bell, MessageCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { socketService } from '@/service/socket/socketService';
import { cn } from '@/lib/utils';
import DevAuthApi from '@/service/Api/DevAuthApi';
import { useUnreadMessagesContext } from '@/contexts/UnreadMessagesContext';

const navItems = [
  { name: 'Home', delay: 0, url: '/developer' },
  { name: 'Sessions', delay: 0.1, url: '/developer/session-requests' },
  { name: 'Portfolio', delay: 0.4, url: '/developer/portfolio' },
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
  const { isAuthenticated, username, email} = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { unreadCount } = useNotificationContext();

  const { unreadCount: unreadMessageCount } = useUnreadMessagesContext();
  

  const handleLogout = () => {
    try {
        socketService.logout()
        dispatch(logout());
        DevAuthApi.logOut()
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
                className="absolute right-0 mt-3 w-72 bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800 z-50"
              >
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://i.imghippo.com/files/GFY5894omo.jpg"
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-white font-semibold truncate">{username}</p>
                      <p className="text-gray-400 text-sm truncate">{email}</p>
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
      style={{ background: navBackground, height: navHeight, }}
      className={cn(
        "fixed w-full top-0 left-0 z-50",
        "bg-black md:bg-transparent",
        "md:backdrop-blur-xl"
      )}
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
              const isActive = location.pathname === item.url;
              return (
                <motion.div 
                  key={item.name} 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: item.delay, duration: 0.3 }} 
                  whileHover={{ y: -2 }}
                >
                  <Link to={item.url} className="relative px-4 py-2 group">
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
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm"
              >
                {isSearchOpen ? <X className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />}
              </motion.button>
            </motion.div>

             {isAuthenticated && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate('/developer/chats')}
                          className="p-2 rounded-full relative
                                   bg-white/5 hover:bg-white/10
                                   border border-white/10 hover:border-white/20
                                   backdrop-blur-sm transition-all duration-300"
                        >
                          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          {unreadMessageCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                            </span>
                          )}
                        </motion.button>
                        )}

            {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/developer/notifications')}
              className="p-2 rounded-full relative
                       bg-white/5 hover:bg-white/10
                       border border-white/10 hover:border-white/20
                       backdrop-blur-sm transition-all duration-300"
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>
            )}

            {!(isMobile && isSearchOpen) && renderAuthSection()}
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="fixed top-0 left-0 w-[280px] h-full bg-gradient-to-b from-black to-zinc-900 border-r border-zinc-800/40 p-6 z-50 md:hidden shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://i.imghippo.com/files/NPo1259thc.png" 
                        alt="DevConnect Logo" 
                        className="w-10 h-10 object-cover" 
                      />
                      <span className="text-white text-xl font-bold">DevConnect</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white bg-zinc-800/50 p-2 rounded-full hover:bg-zinc-700/50"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <p className="text-zinc-400 text-sm mb-4">Main Menu</p>
                    <div className="space-y-1.5">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link 
                            to={item.url}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center w-full py-2.5 px-4 rounded-xl transition-all group
                              ${location.pathname === item.url ? 
                                'bg-blue-600/20 text-blue-400 border-l-4 border-blue-600' : 
                                'hover:bg-zinc-800/50 text-white border-l-4 border-transparent'
                              }`}
                          >
                            <span className="font-medium">{item.name}</span>
                            <motion.div
                              className="ml-auto"
                              initial={false}
                              animate={{ x: location.pathname === item.url ? 0 : 10, opacity: location.pathname === item.url ? 1 : 0 }}
                            >
                              {location.pathname === item.url && (
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              )}
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {isAuthenticated ? (
                    <div className="mt-auto border-t border-zinc-800/50 pt-6">
                      <div className="flex items-center space-x-3 mb-6 bg-zinc-800/30 p-3 rounded-xl">
                        <img
                          src="https://i.imghippo.com/files/GFY5894omo.jpg"
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-white font-medium truncate">{username}</p>
                          <p className="text-zinc-400 text-xs sm:text-sm truncate max-w-[180px]">{email}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-800/30 hover:bg-zinc-800/60 rounded-xl transition-colors"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate('/developer/profile');
                          }}
                        >
                          <User className="w-5 h-5 text-zinc-400" />
                          <span className="text-white">Profile</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-800/30 hover:bg-red-900/20 rounded-xl transition-colors"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5 text-zinc-400" />
                          <span className="text-white">Logout</span>
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto border-t border-zinc-800/50 pt-6">
                      <Link 
                        to="/developer/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Sign In</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                          </svg>
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default DevNavbar;