import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductPhase, ProductStatus } from '../types';
import {
  TrendingUp, Save, CheckCircle, Clock, AlertCircle, XCircle, CheckCircle2,
  Target, DollarSign, BarChart2, Users, Lightbulb, ChevronDown, ChevronRight,
  ArrowLeft, FileText, X, Check
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
const statusConfig: Record<ProductStatus, { label: string; icon: any; cls: string }> = {
  'en-cours': { label: 'En cours', icon: Clock, cls: 'text-blue-600 bg-blue-50' },
  'en-attente': { label: 'En attente', icon: AlertCircle, cls: 'text-yellow-600 bg-yellow-50' },
  'valide': { label: 'Validé', icon: CheckCircle2, cls: 'text-green-600 bg-green-50' },
  'rejete': { label: 'Rejeté', icon: XCircle, cls: 'text-red-600 bg-red-50' },
};

function AnalysisForm({ product, onSave }: { product: Product; onSave: (updates: Partial<Product>) => void }) {
  const { currentActor } = useAuth();
  const { updateChecklist } = useProducts();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    targetMarket: product.marketingData?.targetMarket || '',
    priceRange: product.marketingData?.priceRange || '',
    competition: product.marketingData?.competition || '',
    analysis: product.marketingData?.analysis || '',
    potential: product.marketingData?.potential || '',
  });

  const [checklist, setChecklist] = useState(
    product.checklists.find(c => c.actorRole === 'marketing') || {
      actorRole: 'marketing' as const, progress: 0,
      items: [
        { id: 'm1', label: 'Analyser le marché cible', completed: false },
        { id: 'm2', label: 'Définir le positionnement prix', completed: false },
        { id: 'm3', label: 'Étudier la concurrence', completed: false },
        { id: 'm4', label: 'Valider le potentiel commercial', completed: false },
      ],
    }
  );

  const handleSave = () => {
    onSave({ marketingData: form });
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
          ...item,
          completed: !item.completed,
          completedBy: !item.completed ? currentActor?.name : undefined,
          completedAt: !item.completed ? new Date() : undefined,
        } : item
      ),
    }));
  };

  const checklistProgress = Math.round(checklist.items.filter(i => i.completed).length / checklist.items.length * 100);

  const formSections = [
    {
      id: 'market',
      icon: Target,
      label: 'Marché cible',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      fields: [
        { key: 'targetMarket', label: 'Description du marché cible', placeholder: 'Ex: Femmes 25-45 ans, urbaines, CSP+', multiline: true },
      ],
    },
    {
      id: 'price',
      icon: DollarSign,
      label: 'Positionnement prix',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      fields: [
        { key: 'priceRange', label: 'Fourchette de prix (€)', placeholder: 'Ex: 89€ - 120€', multiline: false },
      ],
    },
    {
      id: 'competition',
      icon: BarChart2,
      label: 'Analyse concurrentielle',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      fields: [
        { key: 'competition', label: 'Concurrents identifiés', placeholder: 'Ex: Zara, Mango – positionnement premium', multiline: false },
        { key: 'analysis', label: 'Analyse détaillée du marché', placeholder: 'Tendances, opportunités, menaces...', multiline: true },
      ],
    },
    {
      id: 'potential',
      icon: TrendingUp,
      label: 'Potentiel commercial',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      fields: [
        { key: 'potential', label: 'Évaluation du potentiel', placeholder: 'Ex: Élevé – tendance durable, marché captif', multiline: true },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-2 space-y-4">
        {formSections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
                <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${section.color}`} />
                </div>
                <h4 className="text-sm text-gray-700">{section.label}</h4>
              </div>
              <div className="p-5 space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-500 mb-1.5">{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé !</> : <><Save className="w-4 h-4" /> Sauvegarder l'analyse</>}
        </button>
      </div>

      {/* Checklist sidebar */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm text-gray-700">Checklist Marketing</h4>
              <span className={`text-xs px-2.5 py-1 rounded-full ${checklistProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {checklistProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${checklistProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${checklistProgress}%` }} />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {checklist.items.map(item => (
              <button
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 text-left transition-colors"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                  {item.completed && item.completedBy && (
                    <div className="text-xs text-gray-400 mt-0.5">{item.completedBy}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product info card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <div className="text-xs text-blue-600 font-medium">Informations produit</div>
          <div className="space-y-2 text-xs text-blue-800">
            <div><span className="text-blue-400 block">Phase</span>{phaseLabels[product.phase]}</div>
            <div><span className="text-blue-400 block">Version actuelle</span>v{product.currentVersion}</div>
            <div><span className="text-blue-400 block">Créé par</span>{product.createdBy.name}</div>
          </div>
          {product.stylisteData?.concept && (
            <div className="pt-2 border-t border-blue-200">
              <div className="text-xs text-blue-400 mb-1">Concept (Styliste)</div>
              <p className="text-xs text-blue-700">{product.stylisteData.concept}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MarketingPage() {
  const { products, updateProduct } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const getMarketingProgress = (product: Product) => {
    const cl = product.checklists.find(c => c.actorRole === 'marketing');
    return cl?.progress || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {selectedProduct ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedProductId(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl text-gray-900 truncate max-w-md">{selectedProduct.name}</h1>
                <p className="text-gray-500 text-sm">Formulaire d'analyse marketing</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl text-gray-900">Mes analyses</h1>
              <p className="text-gray-500 mt-1 text-sm">Sélectionnez un produit pour remplir l'analyse marketing</p>
            </div>
          )}
        </div>
      </div>

      {!selectedProduct ? (
        /* Product list */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const progress = getMarketingProgress(product);
            const StatusIcon = statusConfig[product.status].icon;
            return (
              <button
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group text-left"
              >
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <TrendingUp className="w-8 h-8 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm bg-white/80 ${phaseColors[product.phase]}`}>
                      {phaseLabels[product.phase]}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                    <StatusIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${statusConfig[product.status].cls.split(' ')[0]}`} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Analyse marketing</span>
                      <span className={`${progress === 100 ? 'text-green-600' : progress > 0 ? 'text-blue-600' : 'text-gray-400'}`}>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">v{product.currentVersion}</span>
                    <span className="text-xs text-blue-600 group-hover:underline flex items-center gap-1">
                      Remplir l'analyse <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <AnalysisForm
          product={selectedProduct}
          onSave={(updates) => updateProduct(selectedProduct.id, updates)}
        />
      )}
    </div>
  );
}
