import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductPhase, ProductStatus } from '../types';
import {
  Shield, Save, CheckCircle, Clock, AlertCircle, XCircle, CheckCircle2,
  ChevronRight, ArrowLeft, Plus, X, Check, FileText, AlertTriangle,
  ThumbsUp, RotateCcw, FlaskConical
} from 'lucide-react';

const phaseColors: Record<ProductPhase, string> = {
  ideation: 'bg-purple-100 text-purple-700',
  analyse: 'bg-blue-100 text-blue-700',
  developpement: 'bg-orange-100 text-orange-700',
  validation: 'bg-yellow-100 text-yellow-700',
  production: 'bg-green-100 text-green-700',
};
const phaseLabels: Record<ProductPhase, string> = {
  ideation: 'Idéation', analyse: 'Analyse', developpement: 'Développement',
  validation: 'Validation', production: 'Production',
};
const statusConfig: Record<ProductStatus, { icon: any; cls: string }> = {
  'en-cours': { icon: Clock, cls: 'text-blue-600' },
  'en-attente': { icon: AlertCircle, cls: 'text-yellow-600' },
  'valide': { icon: CheckCircle2, cls: 'text-green-600' },
  'rejete': { icon: XCircle, cls: 'text-red-600' },
};

const AVAILABLE_NORMES = [
  'OEKO-TEX Standard 100', 'OEKO-TEX LEATHER Standard', 'GOTS (Global Organic Textile Standard)',
  'REACH', 'ISO 105-C06', 'ISO 105-X12', 'ISO 139', 'EN 14682',
  'CE Marking', 'Bluesign', 'Fair Trade', 'RDS (Responsible Down Standard)',
  'GRS (Global Recycled Standard)', 'FSC', 'ISO 9001',
];

type ConformiteStatus = 'Conforme' | 'Non conforme' | 'En cours' | 'Non démarré';

function QualiteForm({ product, onSave }: { product: Product; onSave: (updates: Partial<Product>) => void }) {
  const { currentActor } = useAuth();
  const { updateChecklist } = useProducts();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    normes: product.qualiteData?.normes || '',
    tests: product.qualiteData?.tests || '',
    conformite: product.qualiteData?.conformite || 'Non démarré' as ConformiteStatus,
    testResults: product.qualiteData?.testResults || '',
    observations: product.qualiteData?.observations || '',
  });

  const [normesList, setNormesList] = useState<string[]>(product.qualiteData?.normesList || []);
  const [showNormesDropdown, setShowNormesDropdown] = useState(false);
  const [customNorme, setCustomNorme] = useState('');

  const [checklist, setChecklist] = useState(
    product.checklists.find(c => c.actorRole === 'qualite') || {
      actorRole: 'qualite' as const, progress: 0,
      items: [
        { id: 'q1', label: 'Identifier les normes applicables', completed: false },
        { id: 'q2', label: 'Planifier les tests qualité', completed: false },
        { id: 'q3', label: 'Vérifier la conformité réglementaire', completed: false },
        { id: 'q4', label: 'Valider les standards qualité', completed: false },
      ],
    }
  );

  const handleSave = () => {
    onSave({ qualiteData: { ...form, normesList } });
    const completedItems = checklist.items.filter(i => i.completed).length;
    const progress = Math.round((completedItems / checklist.items.length) * 100);
    updateChecklist(product.id, { ...checklist, progress });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCheckItem = (id: string) => {
    setChecklist(cl => ({
      ...cl,
      items: cl.items.map(item =>
        item.id === id ? {
          ...item, completed: !item.completed,
          completedBy: !item.completed ? currentActor?.name : undefined,
          completedAt: !item.completed ? new Date() : undefined,
        } : item
      ),
    }));
  };

  const toggleNorme = (n: string) => {
    setNormesList(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  };

  const addCustomNorme = () => {
    if (customNorme.trim() && !normesList.includes(customNorme.trim())) {
      setNormesList(prev => [...prev, customNorme.trim()]);
      setCustomNorme('');
    }
  };

  const conformiteOptions: { value: ConformiteStatus; label: string; icon: any; color: string }[] = [
    { value: 'Non démarré', label: 'Non démarré', icon: Clock, color: 'text-gray-500 bg-gray-100' },
    { value: 'En cours', label: 'En cours d\'analyse', icon: RotateCcw, color: 'text-blue-600 bg-blue-50' },
    { value: 'Non conforme', label: 'Non conforme', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { value: 'Conforme', label: 'Conforme', icon: ThumbsUp, color: 'text-green-600 bg-green-50' },
  ];

  const checklistProgress = Math.round(checklist.items.filter(i => i.completed).length / checklist.items.length * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-4">
        {/* Conformité status */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <label className="text-sm text-gray-700">Statut de conformité</label>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {conformiteOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <button key={opt.value} onClick={() => setForm(f => ({ ...f, conformite: opt.value }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      form.conformite === opt.value ? `border-current ${opt.color}` : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs text-center leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Normes */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <label className="text-sm text-gray-700">Normes applicables</label>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{normesList.length} sélectionnée{normesList.length > 1 ? 's' : ''}</span>
          </div>
          <div className="p-5 space-y-4">
            {/* Selected normes */}
            {normesList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {normesList.map(n => (
                  <span key={n} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    {n}
                    <button onClick={() => toggleNorme(n)} className="ml-0.5 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
            {/* Normes selector */}
            <div>
              <button onClick={() => setShowNormesDropdown(!showNormesDropdown)}
                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 border border-dashed border-emerald-300 px-4 py-2 rounded-lg hover:border-emerald-400 transition-colors">
                <Plus className="w-4 h-4" /> Ajouter une norme
              </button>
              {showNormesDropdown && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {AVAILABLE_NORMES.filter(n => !normesList.includes(n)).map(n => (
                      <button key={n} onClick={() => { toggleNorme(n); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-left text-sm text-gray-700 transition-colors">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0" />
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100 flex gap-2">
                    <input value={customNorme} onChange={e => setCustomNorme(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomNorme()}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="Norme personnalisée..." />
                    <button onClick={addCustomNorme} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Text field for free notes */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Notes sur les normes</label>
              <textarea value={form.normes} onChange={e => setForm(f => ({ ...f, normes: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                placeholder="Détails supplémentaires sur les normes applicables..." />
            </div>
          </div>
        </div>

        {/* Tests */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <label className="text-sm text-gray-700">Tests qualité</label>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Tests planifiés</label>
              <textarea value={form.tests} onChange={e => setForm(f => ({ ...f, tests: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                placeholder="Ex: Résistance coloris, solidité, dimensionnel, frottement..." />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Résultats des tests</label>
              <textarea value={form.testResults} onChange={e => setForm(f => ({ ...f, testResults: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                placeholder="Ex: Solidité couleur: 4/5 | Résistance traction: conforme | Dimensionnel: -2.5%" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Observations et recommandations</label>
              <textarea value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                placeholder="Observations, points d'attention, recommandations pour la production..." />
            </div>
          </div>
        </div>

        <button onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé !</> : <><Save className="w-4 h-4" /> Sauvegarder le rapport qualité</>}
        </button>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm text-gray-700">Checklist Qualité</h4>
              <span className={`text-xs px-2.5 py-1 rounded-full ${checklistProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {checklistProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${checklistProgress === 100 ? 'bg-green-500' : 'bg-emerald-500'}`}
                style={{ width: `${checklistProgress}%` }} />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {checklist.items.map(item => (
              <button key={item.id} onClick={() => toggleCheckItem(item.id)}
                className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 text-left transition-colors">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.label}</span>
                  {item.completed && item.completedBy && (
                    <div className="text-xs text-gray-400 mt-0.5">{item.completedBy}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conformité status card */}
        <div className={`border rounded-xl p-4 ${
          form.conformite === 'Conforme' ? 'bg-green-50 border-green-200' :
          form.conformite === 'Non conforme' ? 'bg-red-50 border-red-200' :
          form.conformite === 'En cours' ? 'bg-blue-50 border-blue-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-xs font-medium mb-2 ${
            form.conformite === 'Conforme' ? 'text-green-700' :
            form.conformite === 'Non conforme' ? 'text-red-700' :
            form.conformite === 'En cours' ? 'text-blue-700' : 'text-gray-600'
          }`}>
            Statut de conformité
          </div>
          <div className={`text-sm ${
            form.conformite === 'Conforme' ? 'text-green-800' :
            form.conformite === 'Non conforme' ? 'text-red-800' :
            form.conformite === 'En cours' ? 'text-blue-800' : 'text-gray-700'
          }`}>
            {form.conformite}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Normes: {normesList.length > 0 ? normesList.length + ' certifiée' + (normesList.length > 1 ? 's' : '') : 'Aucune'}
          </div>
        </div>

        {/* Product info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
          <div className="text-xs text-emerald-600 font-medium">Informations produit</div>
          <div className="space-y-1.5 text-xs text-emerald-800">
            <div><span className="text-emerald-400 block">Phase</span>{phaseLabels[product.phase]}</div>
            <div><span className="text-emerald-400 block">Ingénieur matières</span>{product.ingenieurData?.materials || <span className="italic text-emerald-300">Non renseigné</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QualitePage() {
  const { products, updateProduct } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {selectedProduct ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedProductId(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl text-gray-900 truncate max-w-md">{selectedProduct.name}</h1>
                <p className="text-gray-500 text-sm">Formulaire de conformité qualité</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl text-gray-900">Conformité Qualité</h1>
              <p className="text-gray-500 mt-1 text-sm">Sélectionnez un produit pour gérer sa conformité et ses tests qualité</p>
            </div>
          )}
        </div>
      </div>

      {!selectedProduct ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const cl = product.checklists.find(c => c.actorRole === 'qualite');
            const progress = cl?.progress || 0;
            const normes = product.qualiteData?.normesList?.length || 0;
            const StatusIcon = statusConfig[product.status].icon;
            const conformite = product.qualiteData?.conformite || 'Non démarré';
            return (
              <button key={product.id} onClick={() => setSelectedProductId(product.id)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group text-left">
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
                      <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm bg-white/80 ${phaseColors[product.phase]}`}>
                      {phaseLabels[product.phase]}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium ${
                      conformite === 'Conforme' ? 'bg-green-100 text-green-700' :
                      conformite === 'Non conforme' ? 'bg-red-100 text-red-700' :
                      conformite === 'En cours' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {conformite}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                    <StatusIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${statusConfig[product.status].cls}`} />
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {normes} norme{normes > 1 ? 's' : ''} certifiée{normes > 1 ? 's' : ''}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Checklist qualité</span>
                      <span className={`${progress === 100 ? 'text-green-600' : progress > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className="text-xs text-emerald-600 group-hover:underline flex items-center gap-1">
                      Gérer la conformité <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <QualiteForm
          product={selectedProduct}
          onSave={(updates) => updateProduct(selectedProduct.id, updates)}
        />
      )}
    </div>
  );
}
