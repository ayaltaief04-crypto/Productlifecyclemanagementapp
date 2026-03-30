import { useState } from "react";
import { TrendingUp, ClipboardList, BarChart3 } from "lucide-react";
import { mockProducts } from "../../data/mockData";

export function MarketingTasks() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    targetMarket: "",
    demographics: "",
    priceRange: "",
    priceJustification: "",
    competitors: "",
    marketSize: "",
    trends: "",
    distribution: "",
    marketingStrategy: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Analyse marketing enregistrée avec succès !");
    setFormData({
      targetMarket: "",
      demographics: "",
      priceRange: "",
      priceJustification: "",
      competitors: "",
      marketSize: "",
      trends: "",
      distribution: "",
      marketingStrategy: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl text-gray-900">Espace Marketing</h1>
          <p className="text-gray-600">Analyser le marché et définir le positionnement</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg text-gray-900">Formulaire d'analyse marketing</h2>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h3 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analyse de marché
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Marché cible *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.targetMarket}
                      onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Femmes urbaines 25-45 ans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Démographie détaillée *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.demographics}
                      onChange={(e) => setFormData({ ...formData, demographics: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CSP+, revenus >40k€, style de vie actif"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Fourchette de prix *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 89€ - 120€"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Taille du marché estimée
                    </label>
                    <input
                      type="text"
                      value={formData.marketSize}
                      onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 500M€ en France"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">
                      Justification du prix *
                    </label>
                    <textarea
                      required
                      value={formData.priceJustification}
                      onChange={(e) => setFormData({ ...formData, priceJustification: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                      placeholder="Expliquez le positionnement prix..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">
                      Analyse de la concurrence *
                    </label>
                    <textarea
                      required
                      value={formData.competitors}
                      onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                      placeholder="Listez les concurrents principaux et leurs forces/faiblesses..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">
                      Tendances du marché *
                    </label>
                    <textarea
                      required
                      value={formData.trends}
                      onChange={(e) => setFormData({ ...formData, trends: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                      placeholder="Tendances actuelles et opportunités..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Canaux de distribution *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.distribution}
                      onChange={(e) => setFormData({ ...formData, distribution: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: E-commerce, boutiques, grands magasins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Stratégie marketing
                    </label>
                    <input
                      type="text"
                      value={formData.marketingStrategy}
                      onChange={(e) => setFormData({ ...formData, marketingStrategy: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Influenceurs, réseaux sociaux, presse"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Info :</strong> Cette analyse sera visible par tous les acteurs et aidera 
                  à la prise de décision dans le rapport PLM.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enregistrer l'analyse
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
