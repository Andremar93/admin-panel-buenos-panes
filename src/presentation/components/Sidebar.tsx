import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiredRole?: 'admin' | 'cashier' | 'all';
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose, onToggle }: SidebarProps) => {
  const { userType } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      requiredRole: 'admin',
    },
    {
      path: '/ingresos',
      label: 'Ingresos',
      icon: '💰',
      requiredRole: 'admin',
    },
    {
      path: '/gastos',
      label: 'Gastos',
      icon: '💸',
      requiredRole: 'admin',
    },
    {
      path: '/facturas',
      label: 'Facturas',
      icon: '🧾',
      requiredRole: 'admin',
    },
    {
      path: '/salarios',
      label: 'Salarios',
      icon: '💵',
      requiredRole: 'admin',
    },
    {
      path: '/deudas-empleados',
      label: 'Deudas Empleados',
      icon: '📋',
      requiredRole: 'admin',
    },
    {
      path: '/flujo-caja',
      label: 'Flujo de Caja',
      icon: '📈',
      requiredRole: 'admin',
    },
    {
      path: '/caja',
      label: 'Caja',
      icon: '🏪',
      requiredRole: 'cashier',
    },
  ];

  // Filter nav items based on user role
  const visibleItems = navItems.filter((item) => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === 'all') return true;
    if (item.requiredRole === userType) return true;
    if (item.requiredRole === 'admin' && userType === 'admin') return true;
    if (item.requiredRole === 'cashier' && userType === 'cashier') return true;
    return false;
  });

  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    // For nested routes, check if current path starts with this path
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/caja') return location.pathname === '/caja';
    return location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-0'}
        lg:static lg:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">BP</span>
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Buenos Panes</span>
                <span className="text-xs text-gray-500">Panel Admin</span>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-600 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                // Left double chevron (pointing left)
                <path d="M13 17l-5-5 5-5M19 17l-5-5 5-5" />
              ) : (
                // Right double chevron (pointing right)
                <path d="M11 7l5 5-5 5M5 7l5 5-5 5" />
              )}
            </svg>


          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive: isRouteActive }) =>
                  isRouteActive || isActive(item.path)
                    ? `flex items-center gap-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 ${isOpen ? 'px-3' : 'px-2 justify-center'
                    }`
                    : `flex items-center gap-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-150 ${isOpen ? 'px-3' : 'px-2 justify-center'
                    }`
                }
                title={!isOpen ? item.label : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="h-12 border-t border-gray-100 flex items-center px-4">
          <div className={`flex items-center gap-2 ${isOpen ? '' : 'justify-center'}`}>
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">👤</span>
            </div>
            {isOpen && <span className="text-xs text-gray-600 capitalize">{userType}</span>}
          </div>
        </div>
      </div>
    </aside>
  );
};
