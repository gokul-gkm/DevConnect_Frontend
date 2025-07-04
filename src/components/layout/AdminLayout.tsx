import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Code2, 
  TrendingUp, 
  Award, 
  Briefcase, 
  FileText, 
  Settings, 
  Crown,
  LogOut,
  ChevronRight,
  Search,
  Menu,
  X 
} from 'lucide-react';
import AdminApi from '@/service/Api/AdminApi';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { adminLogout } from '@/redux/slices/adminSlice';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const mainNavItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <Code2 className="w-5 h-5" />, label: 'Developers', path: '/admin/developers' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Revenue', path: '/admin/revenue' },
    { icon: <Award className="w-5 h-5" />, label: 'Leaderboard', path: '/admin/leaderboard' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Sessions', path: '/admin/sessions' },
    { icon: <FileText className="w-5 h-5" />, label: 'Blogs', path: '/admin/blogs' },
  ];

  const bottomNavItems = [
    { icon: <Settings className="w-5 h-5" />, label: 'Platform Settings', path: '/settings' },
    { icon: <Crown className="w-5 h-5" />, label: 'Admin', path: '/admin' },
  ];

  const handleLogout = async () => {
    try {
      await AdminApi.adminLogOut();
      dispatch(adminLogout());
      toast.success('Logout Successfully');
    } catch (error) {
      console.error('Logout failed: ', error);
      toast.error('Logout failed')
    }
  }

  return (
    <div className="flex h-screen bg-[#070B14] relative">

      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#7C3AED] text-white"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>


      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed md:static
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          bg-[#0B1127] flex flex-col transition-all duration-300 border-r border-[#1B2559]/10
          h-full z-50
        `}
      >

        <div className="h-16 flex items-center gap-3 px-4">
          <div className="min-w-[32px] h-8 rounded flex items-center justify-center text-white font-medium">
            <img src='https://i.imghippo.com/files/NPo1259thc.png' className='h-6 w-6' alt="logo" />
          </div>
          {!isCollapsed && <span className="text-white font-medium">DevConnect</span>}
        </div>

        <div className="px-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={isCollapsed ? "" : "Search for..."}
              className="w-full bg-[#1B2559]/10 rounded-md pl-9 pr-4 py-2 text-sm text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>


        <nav className="flex-1 px-2">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-[#7C3AED] text-white' 
                    : 'text-gray-400 hover:bg-[#1B2559]/20'}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[#1B2559]/10">
            {bottomNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-[#7C3AED] text-white' 
                    : 'text-gray-400 hover:bg-[#1B2559]/20'}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center p-2 mx-4 mb-2 text-gray-400 hover:bg-[#1B2559]/20 rounded-md"
        >
          <ChevronRight className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>


        <div className="p-4">
          <button className="w-full bg-[#7C3AED] text-white rounded-md p-2 flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors"
            onClick={ handleLogout}>
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden bg-[#070B14] md:ml-0 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;