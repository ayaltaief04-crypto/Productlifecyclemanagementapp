import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductVersion, ProductPhase, ProductStatus, BOMItem } from '../types';
import {
  Plus, X, ChevronRight, Clock, Layers, Calendar, Tag, History,
  Edit2, Save, Palette, TrendingUp, Wrench, Shield, MessageCircle,
  ArrowLeft, GitBranch, CheckCircle2, AlertCircle, XCircle, Lightbulb,
  Cog, Rocket, CheckCircle
} from 'lucide-react';

const phaseLabels: Record<ProductPhase, string> = {
  ideation: 'Idéation', analyse: 'Analyse', developpement: 'Développement',
  validation: 'Validation', production: 'Production',
};
const phaseColors: Record<ProductPhase, string> = {
  ideation: 'bg-purple-100 text-purple-700',
  analyse: 'bg-blue-100 text-blue-700',
  developpement: 'bg-orange-100 text-orange-700',
  validation: 'bg-yellow-100 text-yellow-700',
  production: 'bg-green-100 text-green-700',
};
const phaseIcons: Record<ProductPhase, any> = {
  ideation: Lightbulb, analyse: TrendingUp, developpement: Cog, validation: CheckCircle, production: Rocket,
};
const statusColors: Record<ProductStatus, string> = {
  'en-cours': 'text-blue-600 bg-blue-50', 'en-attente': 'text-yellow-600 bg-yellow-50',
  'valide': 'text-green-600 bg-green-50', 'rejete': 'text-red-600 bg-red-50',
};
const statusLabels: Record<ProductStatus, string> = {
  'en-cours': 'En cours', 'en-attente': 'En attente', 'valide': 'Validé', 'rejete': 'Rejeté',
};
const statusIcons: Record<ProductStatus, any> = {
  'en-cours': Clock, 'en-attente': AlertCircle, 'valide': CheckCircle2, 'rejete': XCircle,
};

function incrementVersion(v: string): string {
  const parts = v.split('.');
  if (parts.length === 2) {
    return `${parts[0]}.${parseInt(parts[1]) + 1}`;
  }
  return v + '.1';
}

// ------ NEW PRODUCT MODAL ------
function NewProductModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Product) => void }) {
  const { currentActor } = useAuth();
  const [form, setForm] = useState({
    name: '', description: '', concept: '', inspiration: '', colorPalette: '',
    phase: 'ideation' as ProductPhase, status: 'en-cours' as ProductStatus,
  });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const now = new Date();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      phase: form.phase,
      status: form.status,
      currentVersion: '0.1',
      createdAt: now,
      createdBy: currentActor!,
      updatedAt: now,
      stylisteData: { concept: form.concept, inspiration: form.inspiration, colorPalette: form.colorPalette },
      marketingData: { targetMarket: '', priceRange: '', competition: '', analysis: '', potential: '' },
      ingenieurData: { materials: '', fabrication: '', nomenclature: '', bom: [], technicalSpecs: '' },
      qualiteData: { normes: '', tests: '', conformite: 'Non démarré', normesList: [], testResults: '', observations: '' },
      checklists: [
        { actorRole: 'styliste', progress: 0, items: [
          { id: 's1', label: 'Définir le concept créatif', completed: false },
          { id: 's2', label: 'Créer les croquis', completed: false },
          { id: 's3', label: 'Sélectionner la palette de couleurs', completed: false },
          { id: 's4', label: 'Valider le design final', completed: false },
        ]},
        { actorRole: 'marketing', progress: 0, items: [
          { id: 'm1', label: 'Analyser le marché cible', completed: false },
          { id: 'm2', label: 'Définir le positionnement prix', completed: false },
          { id: 'm3', label: 'Étudier la concurrence', completed: false },
          { id: 'm4', label: 'Valider le potentiel commercial', completed: false },
        ]},
        { actorRole: 'ingenieur', progress: 0, items: [
          { id: 'i1', label: 'Sélectionner les matières premières', completed: false },
          { id: 'i2', label: 'Créer la nomenclature technique', completed: false },
          { id: 'i3', label: 'Définir les procédés de fabrication', completed: false },
          { id: 'i4', label: 'Valider la faisabilité technique', completed: false },
        ]},
        { actorRole: 'qualite', progress: 0, items: [
          { id: 'q1', label: 'Identifier les normes applicables', completed: false },
          { id: 'q2', label: 'Planifier les tests qualité', completed: false },
          { id: 'q3', label: 'Vérifier la conformité réglementaire', completed: false },
          { id: 'q4', label: 'Valider les standards qualité', completed: false },
        ]},
      ],
      comments: [],
      versions: [{ id: 'v1', version: '0.1', createdAt: now, createdBy: currentActor!, changes: 'Création initiale', phase: form.phase }],
    };
    onCreate(newProduct);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-gray-900">Nouveau produit</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Nom du produit *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Ex: Collection Été 2027 – Robe Légère" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
              placeholder="Description courte du produit" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Phase initiale</label>
              <select value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value as ProductPhase }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                {(Object.keys(phaseLabels) as ProductPhase[]).map(p => (
                  <option key={p} value={p}>{phaseLabels[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Statut</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProductStatus }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                {(Object.keys(statusLabels) as ProductStatus[]).map(s => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" /> Données créatives (Styliste)
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Concept créatif</label>
                <input value={form.concept} onChange={e => setForm(f => ({ ...f, concept: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Ex: Élégance décontractée inspirée de la nature" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Inspiration</label>
                <input value={form.inspiration} onChange={e => setForm(f => ({ ...f, inspiration: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Ex: Côte d'Azur, couleurs méditerranéennes" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Palette de couleurs</label>
                <input value={form.colorPalette} onChange={e => setForm(f => ({ ...f, colorPalette: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Ex: Blanc, Sable, Bleu azur" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Annuler</button>
          <button onClick={handleCreate} disabled={!form.name.trim()}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Créer le produit
          </button>
        </div>
      </div>
    </div>
  );
}

// ------ VERSION DETAIL MODAL ------
function VersionDetailModal({
  product, version, onClose, onSave, onNewVersion
}: {
  product: Product;
  version: ProductVersion;
  onClose: () => void;
  onSave: (updates: Partial<Product>) => void;
  onNewVersion: (changes: string) => void;
}) {
  const { currentActor } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'infos' | 'styliste' | 'marketing' | 'ingenieur' | 'qualite' | 'historique'>('infos');
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [newVersionChanges, setNewVersionChanges] = useState('');

  const [editForm, setEditForm] = useState({
    name: product.name,
    description: product.description,
    phase: product.phase,
    status: product.status,
    concept: product.stylisteData?.concept || '',
    inspiration: product.stylisteData?.inspiration || '',
    colorPalette: product.stylisteData?.colorPalette || '',
    targetMarket: product.marketingData?.targetMarket || '',
    priceRange: product.marketingData?.priceRange || '',
    competition: product.marketingData?.competition || '',
    marketingAnalysis: product.marketingData?.analysis || '',
    marketingPotential: product.marketingData?.potential || '',
    materials: product.ingenieurData?.materials || '',
    fabrication: product.ingenieurData?.fabrication || '',
    nomenclature: product.ingenieurData?.nomenclature || '',
    technicalSpecs: product.ingenieurData?.technicalSpecs || '',
    normes: product.qualiteData?.normes || '',
    tests: product.qualiteData?.tests || '',
    conformite: product.qualiteData?.conformite || '',
    testResults: product.qualiteData?.testResults || '',
    observations: product.qualiteData?.observations || '',
  });

  const handleSave = () => {
    onSave({
      name: editForm.name,
      description: editForm.description,
      phase: editForm.phase,
      status: editForm.status,
      stylisteData: { concept: editForm.concept, inspiration: editForm.inspiration, colorPalette: editForm.colorPalette },
      marketingData: { targetMarket: editForm.targetMarket, priceRange: editForm.priceRange, competition: editForm.competition, analysis: editForm.marketingAnalysis, potential: editForm.marketingPotential },
      ingenieurData: { materials: editForm.materials, fabrication: editForm.fabrication, nomenclature: editForm.nomenclature, technicalSpecs: editForm.technicalSpecs, bom: product.ingenieurData?.bom || [] },
      qualiteData: { normes: editForm.normes, tests: editForm.tests, conformite: editForm.conformite, testResults: editForm.testResults, observations: editForm.observations, normesList: product.qualiteData?.normesList || [] },
    });
    setIsEditing(false);
  };

  const handleNewVersion = () => {
    if (newVersionChanges.trim()) {
      onNewVersion(newVersionChanges);
      setShowNewVersionModal(false);
      setNewVersionChanges('');
    }
  };

  const Field = ({ label, value, field, multiline = false }: { label: string; value: string; field: keyof typeof editForm; multiline?: boolean }) => (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {isEditing ? (
        multiline ? (
          <textarea value={editForm[field]} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
            rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
        ) : (
          <input value={editForm[field]} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
        )
      ) : (
        <div className="text-sm text-gray-700 py-1">{value || <span className="text-gray-300 italic">Non renseigné</span>}</div>
      )}
    </div>
  );

  const sectionTabs = [
    { id: 'infos', label: 'Infos générales', icon: Tag },
    { id: 'styliste', label: 'Styliste', icon: Palette },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'ingenieur', label: 'Ingénieur', icon: Wrench },
    { id: 'qualite', label: 'Qualité', icon: Shield },
    { id: 'historique', label: 'Historique', icon: History },
  ] as const;

  const overallProgress = Math.round(product.checklists.reduce((s, c) => s + c.progress, 0) / product.checklists.length);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            {isEditing ? (
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="w-full text-xl text-gray-900 border-b-2 border-purple-300 focus:outline-none pb-1 mb-2 bg-transparent" />
            ) : (
              <h2 className="text-xl text-gray-900 mb-2 truncate">{product.name}</h2>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                <GitBranch className="w-3 h-3" /> v{version.version}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs ${phaseColors[product.phase]}`}>
                {phaseLabels[product.phase]}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs ${statusColors[product.status]}`}>
                {statusLabels[product.status]}
              </span>
              <span className="text-xs text-gray-400">Progression: {overallProgress}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700">
                  <Save className="w-4 h-4" /> Sauvegarder
                </button>
                <button onClick={() => setIsEditing(false)} className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">
                  <Edit2 className="w-4 h-4" /> Modifier
                </button>
                <button onClick={() => setShowNewVersionModal(true)}
                  className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700">
                  <GitBranch className="w-4 h-4" /> Nouvelle version
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg ml-1"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>

        {/* Section tabs */}
        <div className="border-b border-gray-100 overflow-x-auto">
          <nav className="flex gap-0.5 px-4 pt-2">
            {sectionTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs rounded-t-lg border-b-2 transition-colors whitespace-nowrap -mb-px ${
                    activeSection === tab.id
                      ? 'border-purple-500 text-purple-700 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Infos générales */}
          {activeSection === 'infos' && (
            <div className="space-y-4">
              <Field label="Description" value={product.description} field="description" multiline />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Phase</label>
                  {isEditing ? (
                    <select value={editForm.phase} onChange={e => setEditForm(f => ({ ...f, phase: e.target.value as ProductPhase }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                      {(Object.keys(phaseLabels) as ProductPhase[]).map(p => (
                        <option key={p} value={p}>{phaseLabels[p]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${phaseColors[product.phase]}`}>{phaseLabels[product.phase]}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Statut</label>
                  {isEditing ? (
                    <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as ProductStatus }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                      {(Object.keys(statusLabels) as ProductStatus[]).map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${statusColors[product.status]}`}>{statusLabels[product.status]}</span>
                  )}
                </div>
              </div>
              {/* Checklist progress */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-3">Progression par acteur</div>
                <div className="space-y-2">
                  {product.checklists.map(cl => (
                    <div key={cl.actorRole} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 capitalize">{cl.actorRole}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${cl.progress === 100 ? 'bg-green-500' : cl.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                          style={{ width: `${cl.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{cl.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-xs text-gray-400">
                <div><span className="block text-gray-300">Créé le</span>{product.createdAt.toLocaleDateString('fr-FR')}</div>
                <div><span className="block text-gray-300">Créé par</span>{product.createdBy.name}</div>
              </div>
            </div>
          )}

          {/* Styliste */}
          {activeSection === 'styliste' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Données créatives</span>
              </div>
              <Field label="Concept créatif" value={product.stylisteData?.concept || ''} field="concept" multiline />
              <Field label="Sources d'inspiration" value={product.stylisteData?.inspiration || ''} field="inspiration" multiline />
              <Field label="Palette de couleurs" value={product.stylisteData?.colorPalette || ''} field="colorPalette" />
            </div>
          )}

          {/* Marketing (read-only in styliste view) */}
          {activeSection === 'marketing' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Analyse marketing</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">Lecture seule</span>
              </div>
              {[
                { label: 'Marché cible', value: product.marketingData?.targetMarket },
                { label: 'Fourchette de prix', value: product.marketingData?.priceRange },
                { label: 'Concurrence', value: product.marketingData?.competition },
                { label: 'Analyse', value: product.marketingData?.analysis },
                { label: 'Potentiel commercial', value: product.marketingData?.potential },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                  <div className="text-sm text-gray-700">{f.value || <span className="text-gray-300 italic">Non renseigné</span>}</div>
                </div>
              ))}
            </div>
          )}

          {/* Ingénieur (read-only) */}
          {activeSection === 'ingenieur' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">Données techniques</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">Lecture seule</span>
              </div>
              {[
                { label: 'Matières premières', value: product.ingenieurData?.materials },
                { label: 'Procédé de fabrication', value: product.ingenieurData?.fabrication },
                { label: 'Référence nomenclature', value: product.ingenieurData?.nomenclature },
                { label: 'Spécifications techniques', value: product.ingenieurData?.technicalSpecs },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                  <div className="text-sm text-gray-700">{f.value || <span className="text-gray-300 italic">Non renseigné</span>}</div>
                </div>
              ))}
              {product.ingenieurData?.bom && product.ingenieurData.bom.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 mb-2">Nomenclature / BOM ({product.ingenieurData.bom.length} éléments)</div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-gray-50">
                        <th className="text-left px-3 py-2 text-gray-500">Réf.</th>
                        <th className="text-left px-3 py-2 text-gray-500">Désignation</th>
                        <th className="text-left px-3 py-2 text-gray-500">Qté</th>
                        <th className="text-left px-3 py-2 text-gray-500">Fournisseur</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {product.ingenieurData.bom.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-mono text-gray-600">{b.reference}</td>
                            <td className="px-3 py-2 text-gray-700">{b.designation}</td>
                            <td className="px-3 py-2 text-gray-600">{b.quantite} {b.unite}</td>
                            <td className="px-3 py-2 text-gray-500">{b.fournisseur}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Qualité (read-only) */}
          {activeSection === 'qualite' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-600">Données qualité</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">Lecture seule</span>
              </div>
              {[
                { label: 'Normes applicables', value: product.qualiteData?.normes },
                { label: 'Tests planifiés', value: product.qualiteData?.tests },
                { label: 'Conformité', value: product.qualiteData?.conformite },
                { label: 'Résultats des tests', value: product.qualiteData?.testResults },
                { label: 'Observations', value: product.qualiteData?.observations },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                  <div className="text-sm text-gray-700">{f.value || <span className="text-gray-300 italic">Non renseigné</span>}</div>
                </div>
              ))}
              {product.qualiteData?.normesList && product.qualiteData.normesList.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 mb-2">Normes certifiées</div>
                  <div className="flex flex-wrap gap-2">
                    {product.qualiteData.normesList.map(n => (
                      <span key={n} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{n}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Historique */}
          {activeSection === 'historique' && (
            <div className="space-y-3">
              {[...product.versions].reverse().map(v => {
                const PhaseIcon = phaseIcons[v.phase];
                return (
                  <div key={v.id} className={`flex gap-4 p-4 rounded-xl border ${v.version === product.currentVersion ? 'border-purple-200 bg-purple-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${v.version === product.currentVersion ? 'bg-purple-200' : 'bg-gray-200'}`}>
                        <PhaseIcon className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm ${v.version === product.currentVersion ? 'text-purple-700' : 'text-gray-700'}`}>
                          Version {v.version}
                        </span>
                        {v.version === product.currentVersion && (
                          <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">Actuelle</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${phaseColors[v.phase]}`}>{phaseLabels[v.phase]}</span>
                      </div>
                      <p className="text-sm text-gray-600">{v.changes}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {v.createdAt.toLocaleDateString('fr-FR')} · {v.createdBy.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New version modal */}
      {showNewVersionModal && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-gray-900 mb-2">Générer une nouvelle version</h3>
            <p className="text-sm text-gray-500 mb-4">
              Version actuelle: <strong>v{product.currentVersion}</strong> → <strong>v{incrementVersion(product.currentVersion)}</strong>
            </p>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Description des modifications *</label>
              <textarea
                value={newVersionChanges}
                onChange={e => setNewVersionChanges(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                placeholder="Décrivez les changements apportés dans cette version..."
                autoFocus
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowNewVersionModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm">Annuler</button>
              <button onClick={handleNewVersion} disabled={!newVersionChanges.trim()}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                <GitBranch className="w-4 h-4" /> Créer la version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------ MAIN PAGE ------
export function StylistePage() {
  const { products, addProduct, updateProduct, addVersion } = useProducts();
  const { currentActor } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ProductVersion | null>(null);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [filterPhase, setFilterPhase] = useState<string>('all');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const filtered = filterPhase === 'all' ? products : products.filter(p => p.phase === filterPhase);

  const handleSelectProduct = (productId: string) => {
    if (selectedProductId === productId) {
      setSelectedProductId(null);
      setSelectedVersion(null);
    } else {
      setSelectedProductId(productId);
      setSelectedVersion(null);
    }
  };

  const handleSaveProduct = (updates: Partial<Product>) => {
    if (selectedProductId) updateProduct(selectedProductId, updates);
  };

  const handleNewVersion = (changes: string) => {
    if (!selectedProduct || !currentActor) return;
    const newVer: ProductVersion = {
      id: 'v' + Date.now(),
      version: incrementVersion(selectedProduct.currentVersion),
      createdAt: new Date(),
      createdBy: currentActor,
      changes,
      phase: selectedProduct.phase,
    };
    addVersion(selectedProduct.id, newVer);
    setSelectedVersion(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Mes produits</h1>
          <p className="text-gray-500 mt-1 text-sm">{products.length} produit{products.length > 1 ? 's' : ''} en gestion</p>
        </div>
        <button
          onClick={() => setShowNewProductModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouveau produit
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 mr-1">Phase:</span>
        {['all', ...Object.keys(phaseLabels)].map(phase => (
          <button
            key={phase}
            onClick={() => setFilterPhase(phase)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterPhase === phase
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {phase === 'all' ? 'Tous' : phaseLabels[phase as ProductPhase]}
          </button>
        ))}
      </div>

      <div className={`flex gap-6 transition-all ${selectedProduct ? '' : ''}`}>
        {/* Product Grid */}
        <div className={`grid gap-4 transition-all ${selectedProduct
          ? 'grid-cols-1 sm:grid-cols-2 w-full lg:w-96 lg:flex lg:flex-col'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full'
        }`}>
          {filtered.map(product => {
            const isSelected = product.id === selectedProductId;
            const PhaseIcon = phaseIcons[product.phase];
            const StatusIcon = statusIcons[product.status];
            const overallProgress = Math.round(product.checklists.reduce((s, c) => s + c.progress, 0) / product.checklists.length);

            return (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product.id)}
                className={`bg-slate-100 rounded-xl overflow-hidden text-left transition-all hover:shadow-md group border-2 ${
                  isSelected ? 'border-purple-400 shadow-md' : 'border-transparent hover:border-purple-200'
                }`}
              >
                {/* Product image */}
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                      <Palette className="w-10 h-10 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs backdrop-blur-sm bg-white/80 ${statusColors[product.status]}`}>
                      <StatusIcon className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs backdrop-blur-sm ${phaseColors[product.phase]} opacity-90`}>
                      {phaseLabels[product.phase]}
                    </span>
                  </div>
                </div>

                {/* Card info */}
                <div className="p-4">
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {product.versions.length} version{product.versions.length > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {product.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </span>
                    <span className="text-purple-600">{overallProgress}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${overallProgress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                      style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>

                {selectedProduct && isSelected && (
                  <div className="px-4 pb-3 text-xs text-purple-600 flex items-center gap-1">
                    <ChevronRight className="w-3.5 h-3.5" /> Versions →
                  </div>
                )}
              </button>
            );
          })}

          {/* New product card */}
          <button
            onClick={() => setShowNewProductModal(true)}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-purple-400 hover:bg-purple-50 transition-all group min-h-[220px]"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-purple-100 transition-colors">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600" />
            </div>
            <span className="text-sm text-gray-400 group-hover:text-purple-600">Nouveau produit</span>
          </button>
        </div>

        {/* Version list panel */}
        {selectedProduct && (
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-gray-900 text-sm truncate">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedProduct.versions.length} version{selectedProduct.versions.length > 1 ? 's' : ''} disponible{selectedProduct.versions.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => { setSelectedProductId(null); setSelectedVersion(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current version highlight */}
              <div className="px-5 py-3 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
                <div className="text-xs text-purple-600 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  Version actuelle: <strong>v{selectedProduct.currentVersion}</strong>
                </div>
                <button
                  onClick={() => {
                    const currentVer = selectedProduct.versions.find(v => v.version === selectedProduct.currentVersion) || selectedProduct.versions[selectedProduct.versions.length - 1];
                    setSelectedVersion(currentVer);
                  }}
                  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700"
                >
                  Ouvrir
                </button>
              </div>

              {/* Versions list */}
              <div className="divide-y divide-gray-100">
                {[...selectedProduct.versions].reverse().map(version => {
                  const PhaseIcon = phaseIcons[version.phase];
                  const isCurrent = version.version === selectedProduct.currentVersion;
                  return (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className="w-full flex items-start gap-4 px-5 py-4 hover:bg-gray-50 text-left transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isCurrent ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <PhaseIcon className={`w-4 h-4 ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${isCurrent ? 'text-purple-700' : 'text-gray-700'}`}>
                            Version {version.version}
                          </span>
                          {isCurrent && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Actuelle</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${phaseColors[version.phase]}`}>
                            {phaseLabels[version.phase]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{version.changes}</p>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{version.createdAt.toLocaleDateString('fr-FR')}</span>
                          <span>{version.createdBy.name}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 mt-2 flex-shrink-0 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewProductModal && (
        <NewProductModal
          onClose={() => setShowNewProductModal(false)}
          onCreate={(p) => { addProduct(p); setShowNewProductModal(false); }}
        />
      )}

      {selectedVersion && selectedProduct && (
        <VersionDetailModal
          product={selectedProduct}
          version={selectedVersion}
          onClose={() => setSelectedVersion(null)}
          onSave={handleSaveProduct}
          onNewVersion={handleNewVersion}
        />
      )}
    </div>
  );
}
