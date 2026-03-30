import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Actor, ActorRole } from '../types';
import { Palette, TrendingUp, Wrench, Shield, Scissors, Settings } from 'lucide-react';

const roleConfig: Record<ActorRole, {
  icon: any;
  gradient: string;
  hoverGradient: string;
  accent: string;
  label: string;
  description: string;
  route: string;
}> = {
  admin: {
    icon: Settings,
    gradient: 'from-slate-700 to-slate-800',
    hoverGradient: 'hover:from-slate-800 hover:to-slate-900',
    accent: 'bg-white/20',
    label: 'Administrateur',
    description: 'Gestion des utilisateurs, des listes de contrôle et configuration système',
    route: '/admin',
  },
  styliste: {
    icon: Palette,
    gradient: 'from-purple-500 to-purple-700',
    hoverGradient: 'hover:from-purple-600 hover:to-purple-800',
    accent: 'bg-white/20',
    label: 'Styliste',
    description: 'Créer et gérer les concepts créatifs, croquis et design des produits',
    route: '/styliste',
  },
  marketing: {
    icon: TrendingUp,
    gradient: 'from-blue-500 to-blue-700',
    hoverGradient: 'hover:from-blue-600 hover:to-blue-800',
    accent: 'bg-white/20',
    label: 'Marketing',
    description: 'Analyser le marché, définir le positionnement et valider le potentiel commercial',
    route: '/marketing',
  },
  ingenieur: {
    icon: Wrench,
    gradient: 'from-orange-500 to-orange-700',
    hoverGradient: 'hover:from-orange-600 hover:to-orange-800',
    accent: 'bg-white/20',
    label: 'Ingénieur Textile',
    description: 'Spécifications techniques, nomenclature et procédés de fabrication',
    route: '/ingenieur',
  },
  qualite: {
    icon: Shield,
    gradient: 'from-emerald-500 to-emerald-700',
    hoverGradient: 'hover:from-emerald-600 hover:to-emerald-800',
    accent: 'bg-white/20',
    label: 'Responsable Qualité',
    description: 'Normes, tests de conformité et validation qualité des produits',
    route: '/qualite',
  },
};

// One representative per role for login
const loginProfiles: Actor[] = [
  { id: '0', name: 'Admin Système', role: 'admin', email: 'admin@textileplm.fr', active: true },
  { id: '1', name: 'Sophie Martin', role: 'styliste', email: 'sophie.martin@textileplm.fr', active: true },
  { id: '2', name: 'Thomas Bernard', role: 'marketing', email: 'thomas.bernard@textileplm.fr', active: true },
  { id: '3', name: 'Marie Dubois', role: 'ingenieur', email: 'marie.dubois@textileplm.fr', active: true },
  { id: '4', name: 'Lucas Petit', role: 'qualite', email: 'lucas.petit@textileplm.fr', active: true },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (actor: Actor) => {
    login(actor);
    navigate(roleConfig[actor.role].route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl text-white mb-3">TextilePLM</h1>
          <p className="text-slate-300 text-lg">
            Plateforme de gestion du cycle de vie des produits textiles
          </p>
          <p className="text-slate-500 mt-2 text-sm">
            Sélectionnez votre profil pour accéder à votre espace de travail
          </p>
        </div>

        {/* Role grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loginProfiles.map((actor) => {
            const config = roleConfig[actor.role];
            const Icon = config.icon;
            return (
              <button
                key={actor.id}
                onClick={() => handleLogin(actor)}
                className={`group relative bg-gradient-to-br ${config.gradient} ${config.hoverGradient} text-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl border border-white/10 text-left`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${config.accent} backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/60 uppercase tracking-wider mb-1">{config.label}</div>
                    <div className="text-lg text-white mb-2 truncate">{actor.name}</div>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs text-white/60">Connexion →</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/70">Système opérationnel – 5 acteurs disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
