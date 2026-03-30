import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Actor, ActorRole, ChecklistTemplate } from '../types';
import {
  Users, ClipboardList, Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle,
  Palette, TrendingUp, Wrench, Shield, Settings, Mail, ChevronDown, GripVertical,
  BarChart3
} from 'lucide-react';

const roleColors: Record<ActorRole, string> = {
  admin: 'bg-slate-100 text-slate-700 border-slate-200',
  styliste: 'bg-purple-100 text-purple-700 border-purple-200',
  marketing: 'bg-blue-100 text-blue-700 border-blue-200',
  ingenieur: 'bg-orange-100 text-orange-700 border-orange-200',
  qualite: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const roleLabels: Record<ActorRole, string> = {
  admin: 'Administrateur',
  styliste: 'Styliste',
  marketing: 'Marketing',
  ingenieur: 'Ingénieur Textile',
  qualite: 'Responsable Qualité',
};

const roleIcons: Record<ActorRole, any> = {
  admin: Settings,
  styliste: Palette,
  marketing: TrendingUp,
  ingenieur: Wrench,
  qualite: Shield,
};

const checklistRoleConfig: Record<string, { color: string; icon: any; label: string }> = {
  styliste: { color: 'border-purple-500 bg-purple-50', icon: Palette, label: 'Styliste' },
  marketing: { color: 'border-blue-500 bg-blue-50', icon: TrendingUp, label: 'Marketing' },
  ingenieur: { color: 'border-orange-500 bg-orange-50', icon: Wrench, label: 'Ingénieur Textile' },
  qualite: { color: 'border-emerald-500 bg-emerald-50', icon: Shield, label: 'Responsable Qualité' },
};

function UserModal({ user, onSave, onClose }: {
  user?: Actor;
  onSave: (data: Omit<Actor, 'id'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Actor, 'id'>>({
    name: user?.name || '',
    role: user?.role || 'styliste',
    email: user?.email || '',
    active: user?.active ?? true,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-gray-900">{user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom complet *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Prénom Nom"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Adresse email *</label>
            <input
              type="email"
              value={form.email || ''}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="email@textileplm.fr"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rôle *</label>
            <div className="relative">
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as ActorRole }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 appearance-none bg-white"
              >
                {(Object.keys(roleLabels) as ActorRole[]).map(r => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, active: !f.active }))}
              className={`w-10 h-6 rounded-full transition-colors ${form.active ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${form.active ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className="text-sm text-gray-600">Compte {form.active ? 'actif' : 'inactif'}</span>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={() => { if (form.name && form.email) onSave(form); }}
            className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {user ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const { products } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Actor | undefined>();
  const [filterRole, setFilterRole] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  const handleSave = (data: Omit<Actor, 'id'>) => {
    if (editingUser) {
      updateUser(editingUser.id, data);
    } else {
      addUser(data);
    }
    setShowModal(false);
    setEditingUser(undefined);
  };

  const getProductCount = (userId: string) =>
    products.filter(p => p.createdBy.id === userId).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['styliste', 'marketing', 'ingenieur', 'qualite'] as ActorRole[]).map(role => {
          const Icon = roleIcons[role];
          const count = users.filter(u => u.role === role).length;
          return (
            <div key={role} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  role === 'styliste' ? 'bg-purple-100' :
                  role === 'marketing' ? 'bg-blue-100' :
                  role === 'ingenieur' ? 'bg-orange-100' : 'bg-emerald-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    role === 'styliste' ? 'text-purple-600' :
                    role === 'marketing' ? 'text-blue-600' :
                    role === 'ingenieur' ? 'text-orange-600' : 'text-emerald-600'
                  }`} />
                </div>
                <span className="text-xs text-gray-500">{roleLabels[role]}</span>
              </div>
              <div className="text-2xl text-gray-900">{count}</div>
              <div className="text-xs text-gray-400">utilisateur{count > 1 ? 's' : ''}</div>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'admin', 'styliste', 'marketing', 'ingenieur', 'qualite'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                filterRole === role
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role === 'all' ? 'Tous' : roleLabels[role as ActorRole]}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setEditingUser(undefined); setShowModal(true); }}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Ajouter un utilisateur
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs text-gray-500 px-5 py-3">Utilisateur</th>
              <th className="text-left text-xs text-gray-500 px-5 py-3">Rôle</th>
              <th className="text-left text-xs text-gray-500 px-5 py-3 hidden md:table-cell">Email</th>
              <th className="text-left text-xs text-gray-500 px-5 py-3 hidden sm:table-cell">Produits</th>
              <th className="text-left text-xs text-gray-500 px-5 py-3">Statut</th>
              <th className="text-right text-xs text-gray-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(user => {
              const Icon = roleIcons[user.role];
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
                        user.role === 'admin' ? 'bg-slate-700' :
                        user.role === 'styliste' ? 'bg-purple-600' :
                        user.role === 'marketing' ? 'bg-blue-600' :
                        user.role === 'ingenieur' ? 'bg-orange-600' : 'bg-emerald-600'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${roleColors[user.role]}`}>
                      <Icon className="w-3 h-3" />
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{getProductCount(user.id)}</span>
                  </td>
                  <td className="px-5 py-4">
                    {user.active ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" /> Actif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <XCircle className="w-3.5 h-3.5" /> Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setShowModal(true); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {confirmDelete === user.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { deleteUser(user.id); setConfirmDelete(null); }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Aucun utilisateur trouvé</div>
        )}
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingUser(undefined); }}
        />
      )}
    </div>
  );
}

function ChecklistsTab() {
  const { checklistTemplates, setChecklistTemplates } = useProducts();
  const [selectedRole, setSelectedRole] = useState<string>('styliste');
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState<{ role: string; index: number; value: string } | null>(null);

  const roles = ['styliste', 'marketing', 'ingenieur', 'qualite'];
  const template = checklistTemplates.find(t => t.role === selectedRole);

  const addItem = () => {
    if (!newItem.trim()) return;
    setChecklistTemplates(checklistTemplates.map(t =>
      t.role === selectedRole ? { ...t, items: [...t.items, newItem.trim()] } : t
    ));
    setNewItem('');
  };

  const removeItem = (index: number) => {
    setChecklistTemplates(checklistTemplates.map(t =>
      t.role === selectedRole ? { ...t, items: t.items.filter((_, i) => i !== index) } : t
    ));
  };

  const saveEdit = () => {
    if (!editingItem || !editingItem.value.trim()) return;
    setChecklistTemplates(checklistTemplates.map(t => {
      if (t.role !== editingItem.role) return t;
      const items = [...t.items];
      items[editingItem.index] = editingItem.value.trim();
      return { ...t, items };
    }));
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Role tabs */}
      <div className="flex flex-wrap gap-3">
        {roles.map(role => {
          const config = checklistRoleConfig[role];
          const Icon = config.icon;
          const tmpl = checklistTemplates.find(t => t.role === role);
          return (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${
                selectedRole === role ? config.color : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{config.label}</span>
              <span className="ml-1 text-xs opacity-60">({tmpl?.items.length || 0})</span>
            </button>
          );
        })}
      </div>

      {template && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 text-sm">
                Liste de contrôle – {checklistRoleConfig[selectedRole]?.label}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{template.items.length} tâches définies</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {template.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3 group hover:bg-gray-50">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                  {index + 1}
                </div>
                {editingItem?.role === selectedRole && editingItem.index === index ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      value={editingItem.value}
                      onChange={e => setEditingItem(ei => ei ? { ...ei, value: e.target.value } : null)}
                      className="flex-1 border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingItem(null); }}
                    />
                    <button onClick={saveEdit} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingItem(null)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-700">{item}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={() => setEditingItem({ role: selectedRole, index, value: item })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add item */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="Nouvelle tâche..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              onClick={addItem}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'checklists'>(
    tabParam === 'users' ? 'users' : tabParam === 'checklists' ? 'checklists' : 'overview'
  );
  const { users } = useAuth();
  const { products } = useProducts();

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'checklists', label: 'Listes de contrôle', icon: ClipboardList },
  ] as const;

  const activeUsers = users.filter(u => u.active).length;
  const inProgressProducts = products.filter(p => p.status === 'en-cours').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestion des utilisateurs et de la configuration</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">
          <Settings className="w-4 h-4" />
          Panel Admin
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">actifs</span>
              </div>
              <div className="text-3xl text-gray-900">{activeUsers}</div>
              <div className="text-sm text-gray-500 mt-1">Utilisateurs actifs</div>
              <div className="text-xs text-gray-400 mt-0.5">sur {users.length} total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">en cours</span>
              </div>
              <div className="text-3xl text-gray-900">{inProgressProducts}</div>
              <div className="text-sm text-gray-500 mt-1">Produits en cours</div>
              <div className="text-xs text-gray-400 mt-0.5">sur {products.length} total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{users.filter(u => u.role === 'styliste').length}</div>
              <div className="text-sm text-gray-500 mt-1">Stylistes</div>
              <div className="text-xs text-gray-400 mt-0.5">actifs dans le système</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{products.filter(p => p.status === 'valide').length}</div>
              <div className="text-sm text-gray-500 mt-1">Produits validés</div>
              <div className="text-xs text-gray-400 mt-0.5">qualité confirmée</div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-gray-900 mb-4">Accès rapides</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  Gérer les utilisateurs ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('checklists')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors text-left"
                >
                  <ClipboardList className="w-4 h-4 text-gray-400" />
                  Configurer les listes de contrôle
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-gray-900 mb-4">État des rôles</h3>
              <div className="space-y-3">
                {(['styliste', 'marketing', 'ingenieur', 'qualite'] as ActorRole[]).map(role => {
                  const Icon = roleIcons[role];
                  const count = users.filter(u => u.role === role && u.active).length;
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon className="w-4 h-4 text-gray-400" />
                        {roleLabels[role]}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${count > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {count} actif{count > 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'checklists' && <ChecklistsTab />}
    </div>
  );
}
