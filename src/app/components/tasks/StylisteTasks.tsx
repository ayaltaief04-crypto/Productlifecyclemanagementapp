import { useState } from "react";
import { Palette, Plus, Image, Sparkles } from "lucide-react";

export function StylisteTasks() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    concept: "",
    inspiration: "",
    colorPalette: "",
    materials: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Idée de produit créée avec succès !");
    setFormData({
      productName: "",
      description: "",
      concept: "",
      inspiration: "",
      colorPalette: "",
      materials: "",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Espace Styliste</h1>
            <p className="text-gray-600">Créer et gérer vos concepts créatifs</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle idée produit
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg text-gray-900">Créer une nouvelle idée de produit</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Robe Fluide Collection Été"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                  placeholder="Décrivez le produit..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Concept créatif *
                </label>
                <textarea
                  required
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                  placeholder="Quel est le concept principal ?"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Source d'inspiration *
                </label>
                <textarea
                  required
                  value={formData.inspiration}
                  onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                  placeholder="D'où vient l'inspiration ?"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Palette de couleurs *
                </label>
                <input
                  type="text"
                  required
                  value={formData.colorPalette}
                  onChange={(e) => setFormData({ ...formData, colorPalette: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Blanc cassé, bleu azur, terracotta"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Matériaux souhaités
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Lin, coton bio, soie"
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900">
                <strong>Note :</strong> Une fois l'idée créée, les autres acteurs (Marketing, Ingénieur, Qualité) 
                pourront commencer à travailler sur ce produit de manière collaborative.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Créer l'idée produit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Vos créations apparaîtront ici</p>
          <p className="text-sm mt-1">Cliquez sur "Nouvelle idée produit" pour commencer</p>
        </div>
      </div>
    </div>
  );
}
