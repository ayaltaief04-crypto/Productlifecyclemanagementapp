import { useState } from "react";
import { Shield, ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";
import { mockProducts } from "../../data/mockData";

export function QualiteTasks() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    normes: "",
    certifications: "",
    testResistance: "",
    testColoris: "",
    testDimensionnel: "",
    testSolidite: "",
    conformiteREACH: false,
    conformiteOEKO: false,
    conformiteCE: false,
    defautsIdentifies: "",
    actionsCorrectives: "",
    validationFinale: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Contrôle qualité enregistré avec succès !");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl text-gray-900">Espace Responsable Qualité</h1>
          <p className="text-gray-600">Conformité et validation qualité</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardCheck className="w-5 h-5 text-green-600" />
          <h2 className="text-lg text-gray-900">Formulaire de contrôle qualité</h2>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <h3 className="text-sm text-gray-900 mb-4">Normes et certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Normes applicables *
                    </label>
                    <textarea
                      required
                      value={formData.normes}
                      onChange={(e) => setFormData({ ...formData, normes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                      placeholder="Ex: ISO 9001, EN 14682, ASTM D4966..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Certifications requises *
                    </label>
                    <textarea
                      required
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                      placeholder="Ex: OEKO-TEX Standard 100, GOTS..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm text-gray-900 mb-4">Tests qualité effectués</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Test de résistance à l'abrasion
                    </label>
                    <input
                      type="text"
                      value={formData.testResistance}
                      onChange={(e) => setFormData({ ...formData, testResistance: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Résultat du test (ex: 50000 cycles)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Test de solidité des coloris
                    </label>
                    <input
                      type="text"
                      value={formData.testColoris}
                      onChange={(e) => setFormData({ ...formData, testColoris: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Note (ex: 4-5/5)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Test dimensionnel après lavage
                    </label>
                    <input
                      type="text"
                      value={formData.testDimensionnel}
                      onChange={(e) => setFormData({ ...formData, testDimensionnel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Variation (ex: -2% en longueur)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Test de solidité des coutures
                    </label>
                    <input
                      type="text"
                      value={formData.testSolidite}
                      onChange={(e) => setFormData({ ...formData, testSolidite: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Résistance (ex: >300N)"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm text-gray-900 mb-4">Conformité réglementaire</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.conformiteREACH}
                      onChange={(e) => setFormData({ ...formData, conformiteREACH: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {formData.conformiteREACH ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-900">Conformité REACH</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Règlement européen sur les substances chimiques
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.conformiteOEKO}
                      onChange={(e) => setFormData({ ...formData, conformiteOEKO: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {formData.conformiteOEKO ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-900">OEKO-TEX Standard 100</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Certification textile sans substances nocives
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.conformiteCE}
                      onChange={(e) => setFormData({ ...formData, conformiteCE: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {formData.conformiteCE ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-900">Marquage CE</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Conformité européenne applicable
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm text-gray-900 mb-4">Analyse et validation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Défauts identifiés
                    </label>
                    <textarea
                      value={formData.defautsIdentifies}
                      onChange={(e) => setFormData({ ...formData, defautsIdentifies: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                      placeholder="Listez les défauts ou non-conformités détectés..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Actions correctives proposées
                    </label>
                    <textarea
                      value={formData.actionsCorrectives}
                      onChange={(e) => setFormData({ ...formData, actionsCorrectives: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                      placeholder="Proposez des solutions pour corriger les défauts..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Validation finale *
                    </label>
                    <select
                      required
                      value={formData.validationFinale}
                      onChange={(e) => setFormData({ ...formData, validationFinale: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="valide">✓ Validé - Conforme à toutes les normes</option>
                      <option value="valide-reserve">⚠ Validé avec réserves - Corrections mineures</option>
                      <option value="refuse">✗ Refusé - Non conforme</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <strong>Info :</strong> Votre validation qualité est essentielle pour la décision 
                  finale. Le rapport PLM intégrera vos résultats pour recommander l'approbation ou non du produit.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enregistrer le contrôle qualité
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
