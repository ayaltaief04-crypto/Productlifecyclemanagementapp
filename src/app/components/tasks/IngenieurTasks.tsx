import { useState } from "react";
import { Wrench, FileText, Plus, Trash2 } from "lucide-react";
import { mockProducts } from "../../data/mockData";

interface NomenclatureItem {
  id: string;
  reference: string;
  designation: string;
  quantite: string;
  unite: string;
  fournisseur: string;
}

export function IngenieurTasks() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [nomenclatureItems, setNomenclatureItems] = useState<NomenclatureItem[]>([
    { id: '1', reference: '', designation: '', quantite: '', unite: 'm', fournisseur: '' }
  ]);
  const [formData, setFormData] = useState({
    materials: "",
    composition: "",
    fabrication: "",
    techniques: "",
    tolerances: "",
    tests: "",
  });

  const addNomenclatureItem = () => {
    setNomenclatureItems([
      ...nomenclatureItems,
      { id: Date.now().toString(), reference: '', designation: '', quantite: '', unite: 'm', fournisseur: '' }
    ]);
  };

  const removeNomenclatureItem = (id: string) => {
    setNomenclatureItems(nomenclatureItems.filter(item => item.id !== id));
  };

  const updateNomenclatureItem = (id: string, field: keyof NomenclatureItem, value: string) => {
    setNomenclatureItems(nomenclatureItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Nomenclature technique enregistrée avec succès !");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Wrench className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl text-gray-900">Espace Ingénieur Textile</h1>
          <p className="text-gray-600">Spécifications techniques et nomenclature</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg text-gray-900">Nomenclature technique</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Sélectionner un produit *
            </label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Choisir un produit --</option>
              {mockProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm text-gray-900 mb-4">Matières premières et composition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Matières premières principales *
                    </label>
                    <textarea
                      required
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                      placeholder="Ex: Lin belge 100%, coton bio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Composition détaillée *
                    </label>
                    <textarea
                      required
                      value={formData.composition}
                      onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                      placeholder="Ex: 100% lin (200g/m²), teinture naturelle..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Procédés de fabrication *
                    </label>
                    <textarea
                      required
                      value={formData.fabrication}
                      onChange={(e) => setFormData({ ...formData, fabrication: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                      placeholder="Ex: Coupe laser, couture renforcée..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Techniques spécifiques
                    </label>
                    <textarea
                      value={formData.techniques}
                      onChange={(e) => setFormData({ ...formData, techniques: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                      placeholder="Techniques particulières utilisées..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Tolérances dimensionnelles
                    </label>
                    <input
                      type="text"
                      value={formData.tolerances}
                      onChange={(e) => setFormData({ ...formData, tolerances: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Ex: +/- 2cm sur longueur"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Tests techniques requis
                    </label>
                    <input
                      type="text"
                      value={formData.tests}
                      onChange={(e) => setFormData({ ...formData, tests: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Ex: Résistance, solidité, déchirure"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-900">Liste des composants (Nomenclature)</h3>
                  <button
                    type="button"
                    onClick={addNomenclatureItem}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un composant
                  </button>
                </div>

                <div className="space-y-3">
                  {nomenclatureItems.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Référence</label>
                            <input
                              type="text"
                              value={item.reference}
                              onChange={(e) => updateNomenclatureItem(item.id, 'reference', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="REF-001"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Désignation</label>
                            <input
                              type="text"
                              value={item.designation}
                              onChange={(e) => updateNomenclatureItem(item.id, 'designation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Lin belge"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Quantité</label>
                            <input
                              type="text"
                              value={item.quantite}
                              onChange={(e) => updateNomenclatureItem(item.id, 'quantite', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="2.5"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Unité</label>
                            <select
                              value={item.unite}
                              onChange={(e) => updateNomenclatureItem(item.id, 'unite', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option value="m">m</option>
                              <option value="kg">kg</option>
                              <option value="pcs">pcs</option>
                              <option value="m²">m²</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Fournisseur</label>
                            <input
                              type="text"
                              value={item.fournisseur}
                              onChange={(e) => updateNomenclatureItem(item.id, 'fournisseur', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Nom fournisseur"
                            />
                          </div>
                        </div>
                        {nomenclatureItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNomenclatureItem(item.id)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900">
                  <strong>Info :</strong> La nomenclature technique sera utilisée par l'équipe qualité 
                  pour vérifier la conformité et par la production pour la fabrication.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Enregistrer la nomenclature
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct("")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
