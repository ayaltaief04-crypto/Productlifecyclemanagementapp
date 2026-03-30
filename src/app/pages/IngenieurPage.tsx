import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductPhase, ProductStatus, BOMItem } from '../types';
import {
  Wrench, Save, CheckCircle, Clock, AlertCircle, XCircle, CheckCircle2,
  Plus, Trash2, ChevronRight, ArrowLeft, Package, FileText, Edit2, X, Check,
  Layers, Settings
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

function NomenclatureForm({ product, onSave }: { product: Product; onSave: (updates: Partial<Product>) => void }) {
  const { currentActor } = useAuth();
  const { updateChecklist } = useProducts();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'bom'>('general');

  const [form, setForm] = useState({
    materials: product.ingenieurData?.materials || '',
    fabrication: product.ingenieurData?.fabrication || '',
    nomenclature: product.ingenieurData?.nomenclature || '',
    technicalSpecs: product.ingenieurData?.technicalSpecs || '',
  });

  const [bom, setBom] = useState<BOMItem[]>(product.ingenieurData?.bom || []);
  const [editingBomId, setEditingBomId] = useState<string | null>(null);
  const [newBomRow, setNewBomRow] = useState<Partial<BOMItem>>({
    reference: '', designation: '', matiere: '', quantite: 1, unite: 'm', fournisseur: '',
  });
  const [showNewBomRow, setShowNewBomRow] = useState(false);

  const [checklist, setChecklist] = useState(
    product.checklists.find(c => c.actorRole === 'ingenieur') || {
      actorRole: 'ingenieur' as const, progress: 0,
      items: [
        { id: 'i1', label: 'Sélectionner les matières premières', completed: false },
        { id: 'i2', label: 'Créer la nomenclature technique', completed: false },
        { id: 'i3', label: 'Définir les procédés de fabrication', completed: false },
        { id: 'i4', label: 'Valider la faisabilité technique', completed: false },
      ],
    }
  );

  const handleSave = () => {
    onSave({ ingenieurData: { ...form, bom } });
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

  const addBomRow = () => {
    if (!newBomRow.reference || !newBomRow.designation) return;
    const row: BOMItem = {
      id: Date.now().toString(),
      reference: newBomRow.reference || '',
      designation: newBomRow.designation || '',
      matiere: newBomRow.matiere || '',
      quantite: newBomRow.quantite || 1,
      unite: newBomRow.unite || 'm',
      fournisseur: newBomRow.fournisseur || '',
    };
    setBom(prev => [...prev, row]);
    setNewBomRow({ reference: '', designation: '', matiere: '', quantite: 1, unite: 'm', fournisseur: '' });
    setShowNewBomRow(false);
  };

  const removeBomRow = (id: string) => setBom(prev => prev.filter(r => r.id !== id));

  const updateBomRow = (id: string, updates: Partial<BOMItem>) => {
    setBom(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const checklistProgress = Math.round(checklist.items.filter(i => i.completed).length / checklist.items.length * 100);
  const unites = ['m', 'cm', 'kg', 'g', 'm²', 'pcs', 'rouleau', 'bobine'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'general' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Données générales
          </button>
          <button onClick={() => setActiveTab('bom')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'bom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Layers className="w-3.5 h-3.5" /> Nomenclature BOM
            <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">{bom.length}</span>
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="space-y-4">
            {[
              { id: 'materials', label: 'Matières premières', placeholder: 'Ex: Lin belge 100% (200g/m²), teinture naturelle', icon: Package, multiline: true },
              { id: 'fabrication', label: 'Procédé de fabrication', placeholder: 'Ex: Coupe laser, couture renforcée, finitions main', icon: Settings, multiline: true },
              { id: 'nomenclature', label: 'Référence nomenclature', placeholder: 'Ex: REF-LIN-2026-001', icon: FileText, multiline: false },
              { id: 'technicalSpecs', label: 'Spécifications techniques', placeholder: 'Grammage, laize, entretien, retrait après lavage...', icon: Wrench, multiline: true },
            ].map(field => {
              const Icon = field.icon;
              return (
                <div key={field.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <label className="text-sm text-gray-700">{field.label}</label>
                  </div>
                  <div className="p-4">
                    {field.multiline ? (
                      <textarea value={form[field.id as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                        placeholder={field.placeholder} />
                    ) : (
                      <input value={form[field.id as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder={field.placeholder} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'bom' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h4 className="text-sm text-gray-700">Nomenclature / Bill of Materials</h4>
                <p className="text-xs text-gray-400 mt-0.5">{bom.length} composant{bom.length > 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowNewBomRow(true)}
                className="flex items-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-orange-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Référence', 'Désignation', 'Matière', 'Quantité', 'Unité', 'Fournisseur', ''].map(h => (
                      <th key={h} className="text-left text-xs text-gray-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bom.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 group">
                      {editingBomId === row.id ? (
                        <>
                          {(['reference', 'designation', 'matiere'] as const).map(field => (
                            <td key={field} className="px-3 py-2">
                              <input value={row[field]} onChange={e => updateBomRow(row.id, { [field]: e.target.value })}
                                className="w-full border border-orange-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                            </td>
                          ))}
                          <td className="px-3 py-2">
                            <input type="number" value={row.quantite} onChange={e => updateBomRow(row.id, { quantite: parseFloat(e.target.value) })}
                              className="w-16 border border-orange-300 rounded px-2 py-1 text-xs focus:outline-none" />
                          </td>
                          <td className="px-3 py-2">
                            <select value={row.unite} onChange={e => updateBomRow(row.id, { unite: e.target.value })}
                              className="border border-orange-300 rounded px-2 py-1 text-xs focus:outline-none bg-white">
                              {unites.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input value={row.fournisseur} onChange={e => updateBomRow(row.id, { fournisseur: e.target.value })}
                              className="w-full border border-orange-300 rounded px-2 py-1 text-xs focus:outline-none" />
                          </td>
                          <td className="px-3 py-2">
                            <button onClick={() => setEditingBomId(null)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-xs font-mono text-gray-600">{row.reference}</td>
                          <td className="px-4 py-3 text-xs text-gray-700">{row.designation}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{row.matiere}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{row.quantite}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{row.unite}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{row.fournisseur}</td>
                          <td className="px-4 py-3">
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                              <button onClick={() => setEditingBomId(row.id)} className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => removeBomRow(row.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {showNewBomRow && (
                    <tr className="bg-orange-50">
                      {(['reference', 'designation', 'matiere'] as const).map(field => (
                        <td key={field} className="px-3 py-2">
                          <input
                            value={newBomRow[field] || ''}
                            onChange={e => setNewBomRow(r => ({ ...r, [field]: e.target.value }))}
                            className="w-full border border-orange-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
                            placeholder={field === 'reference' ? 'REF-...' : field === 'designation' ? 'Désignation' : 'Matière'}
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <input type="number" value={newBomRow.quantite} onChange={e => setNewBomRow(r => ({ ...r, quantite: parseFloat(e.target.value) }))}
                          className="w-16 border border-orange-300 rounded px-2 py-1.5 text-xs focus:outline-none" />
                      </td>
                      <td className="px-3 py-2">
                        <select value={newBomRow.unite} onChange={e => setNewBomRow(r => ({ ...r, unite: e.target.value }))}
                          className="border border-orange-300 rounded px-2 py-1.5 text-xs focus:outline-none bg-white">
                          {unites.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input value={newBomRow.fournisseur || ''} onChange={e => setNewBomRow(r => ({ ...r, fournisseur: e.target.value }))}
                          className="w-full border border-orange-300 rounded px-2 py-1.5 text-xs focus:outline-none"
                          placeholder="Fournisseur" />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button onClick={addBomRow} className="p-1.5 bg-orange-600 text-white rounded hover:bg-orange-700">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setShowNewBomRow(false)} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {bom.length === 0 && !showNewBomRow && (
                <div className="py-10 text-center text-gray-400 text-sm">
                  <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  Aucun composant. Cliquez sur "Ajouter" pour commencer.
                </div>
              )}
            </div>
          </div>
        )}

        <button onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé !</> : <><Save className="w-4 h-4" /> Sauvegarder la nomenclature</>}
        </button>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm text-gray-700">Checklist Ingénieur</h4>
              <span className={`text-xs px-2.5 py-1 rounded-full ${checklistProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {checklistProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${checklistProgress === 100 ? 'bg-green-500' : 'bg-orange-500'}`}
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

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <div className="text-xs text-orange-600 font-medium">Résumé produit</div>
          <div className="space-y-1.5 text-xs text-orange-800">
            <div><span className="text-orange-400 block">Référence</span>{form.nomenclature || <span className="italic text-orange-300">Non définie</span>}</div>
            <div><span className="text-orange-400 block">Phase</span>{phaseLabels[product.phase]}</div>
            <div><span className="text-orange-400 block">Composants BOM</span>{bom.length} élément{bom.length > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IngenieurPage() {
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
                <p className="text-gray-500 text-sm">Nomenclature technique et BOM</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl text-gray-900">Nomenclatures</h1>
              <p className="text-gray-500 mt-1 text-sm">Sélectionnez un produit pour gérer sa nomenclature technique</p>
            </div>
          )}
        </div>
      </div>

      {!selectedProduct ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const cl = product.checklists.find(c => c.actorRole === 'ingenieur');
            const progress = cl?.progress || 0;
            const bomCount = product.ingenieurData?.bom?.length || 0;
            const StatusIcon = statusConfig[product.status].icon;
            return (
              <button key={product.id} onClick={() => setSelectedProductId(product.id)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group text-left">
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                      <Wrench className="w-8 h-8 text-orange-400" />
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
                    <StatusIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${statusConfig[product.status].cls}`} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{bomCount} composant{bomCount > 1 ? 's' : ''}</span>
                    {product.ingenieurData?.nomenclature && (
                      <span className="font-mono text-gray-500 text-xs">{product.ingenieurData.nomenclature}</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Avancement ingénieur</span>
                      <span className={`${progress === 100 ? 'text-green-600' : progress > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-orange-500' : 'bg-gray-200'}`}
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className="text-xs text-orange-600 group-hover:underline flex items-center gap-1">
                      Gérer la nomenclature <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <NomenclatureForm
          product={selectedProduct}
          onSave={(updates) => updateProduct(selectedProduct.id, updates)}
        />
      )}
    </div>
  );
}
