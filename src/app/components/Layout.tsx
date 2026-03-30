import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  Scissors, LayoutDashboard, LogOut, Settings, Palette, TrendingUp, Wrench, Shield,
  ClipboardList, Users, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const roleColors: Record<string, string> = {
  admin: 'bg-slate-700',
  styliste: 'bg-purple-600',
  marketing: 'bg-blue-600',
  ingenieur: 'bg-orange-600',
  qualite: 'bg-emerald-600',
};

const roleIcons: Record<string, any> = {
  admin: Settings,
  styliste: Palette,
  marketing: TrendingUp,
  ingenieur: Wrench,
  qualite: Shield,
};

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  styliste: 'Styliste',
  marketing: 'Marketing',
  ingenieur: 'Ingénieur Textile',
  qualite: 'Responsable Qualité',
};

function getNavLinks(role: string) {
  const base = [{ to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard }];

  switch (role) {
    case 'admin':
      return [
        { to: '/admin', label: 'Administration', icon: Settings },
        { to: '/admin?tab=users', label: 'Utilisateurs', icon: Users },
        { to: '/admin?tab=checklists', label: 'Listes de contrôle', icon: ClipboardList },
        ...base,
      ];
    case 'styliste':
      return [
        { to: '/styliste', label: 'Mes produits', icon: Palette },
        ...base,
      ];
    case 'marketing':
      return [
        { to: '/marketing', label: 'Mes analyses', icon: TrendingUp },
        ...base,
      ];
    case 'ingenieur':
      return [
        { to: '/ingenieur', label: 'Nomenclatures', icon: Wrench },
        ...base,
      ];
    case 'qualite':
      return [
        { to: '/qualite', label: 'Conformité', icon: Shield },
        ...base,
      ];
    default:
      return base;
  }
}

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentActor, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentActor) {
    navigate('/');
    return null;
  }

  const navLinks = getNavLinks(currentActor.role);
  const RoleIcon = roleIcons[currentActor.role] || LayoutDashboard;
  const avatarColor = roleColors[currentActor.role] || 'bg-gray-600';

  const isActive = (to: string) => {
    const path = to.split('?')[0];
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm text-gray-900">TextilePLM</div>
                <div className="text-xs text-gray-400">Cycle de vie produit</div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-slate-800 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className={`w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center text-white text-sm flex-shrink-0`}>
                  {currentActor.name.charAt(0)}
                </div>
                <div className="text-sm">
                  <div className="text-gray-900 leading-tight">{currentActor.name}</div>
                  <div className="text-gray-400 text-xs">{roleLabels[currentActor.role]}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-7 h-7 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs`}>
                  {currentActor.name.charAt(0)}
                </div>
                {currentActor.name}
              </div>
              <button onClick={handleLogout} className="text-red-500 text-sm flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
