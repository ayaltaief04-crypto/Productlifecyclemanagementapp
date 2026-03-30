import { useState } from "react";
import { Product, ActorRole, ChecklistItem } from "../types";
import { CheckCircle2, Circle, Save, Edit2 } from "lucide-react";

type NonAdminRole = Exclude<ActorRole, 'admin'>;

interface ChecklistTabProps {
  product: Product;
  actorRole: NonAdminRole;
}

export function ChecklistTab({ product, actorRole }: ChecklistTabProps) {
  const checklist = product.checklists.find(cl => cl.actorRole === actorRole);
  const [items, setItems] = useState(checklist?.items || []);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  if (!checklist) return null;

  const toggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            completed: !item.completed,
            completedBy: !item.completed ? 'Utilisateur actuel' : undefined,
            completedAt: !item.completed ? new Date() : undefined
          }
        : item
    ));
  };

  const getActorData = () => {
    switch (actorRole) {
      case 'styliste':
        return product.stylisteData;
      case 'marketing':
        return product.marketingData;
      case 'ingenieur':
        return product.ingenieurData;
      case 'qualite':
        return product.qualiteData;
    }
  };

  const data = getActorData();

  const handleSave = () => {
    setIsEditing(false);
    alert('Données sauvegardées ! (Fonctionnalité simulée)');
  };

  const renderDataForm = () => {
    switch (actorRole) {
      case 'styliste':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Concept créatif</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.stylisteData?.concept}
                />
              ) : (
                <p className="text-gray-900">{product.stylisteData?.concept || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Source d'inspiration</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.stylisteData?.inspiration}
                />
              ) : (
                <p className="text-gray-900">{product.stylisteData?.inspiration || 'Non défini'}</p>
              )}
            </div>
          </div>
        );
      
      case 'marketing':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Marché cible</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={product.marketingData?.targetMarket}
                />
              ) : (
                <p className="text-gray-900">{product.marketingData?.targetMarket || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Fourchette de prix</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={product.marketingData?.priceRange}
                />
              ) : (
                <p className="text-gray-900">{product.marketingData?.priceRange || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Analyse concurrentielle</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.marketingData?.competition}
                />
              ) : (
                <p className="text-gray-900">{product.marketingData?.competition || 'Non défini'}</p>
              )}
            </div>
          </div>
        );
      
      case 'ingenieur':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Matières premières</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.ingenieurData?.materials}
                />
              ) : (
                <p className="text-gray-900">{product.ingenieurData?.materials || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Procédés de fabrication</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.ingenieurData?.fabrication}
                />
              ) : (
                <p className="text-gray-900">{product.ingenieurData?.fabrication || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Nomenclature technique</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={product.ingenieurData?.nomenclature}
                />
              ) : (
                <p className="text-gray-900">{product.ingenieurData?.nomenclature || 'Non défini'}</p>
              )}
            </div>
          </div>
        );
      
      case 'qualite':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Normes applicables</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={product.qualiteData?.normes}
                />
              ) : (
                <p className="text-gray-900">{product.qualiteData?.normes || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Tests qualité</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.qualiteData?.tests}
                />
              ) : (
                <p className="text-gray-900">{product.qualiteData?.tests || 'Non défini'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Conformité</label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  defaultValue={product.qualiteData?.conformite}
                />
              ) : (
                <p className="text-gray-900">{product.qualiteData?.conformite || 'Non défini'}</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Checklist {actorRole}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {checklist.progress}% complété
          </p>
        </div>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${checklist.progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex-shrink-0 mt-0.5"
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div className="flex-1">
              <p className={`text-gray-900 ${item.completed ? 'line-through' : ''}`}>
                {item.label}
              </p>
              {item.completed && item.completedBy && (
                <p className="text-xs text-gray-500 mt-1">
                  Complété par {item.completedBy}
                  {item.completedAt && ` le ${item.completedAt.toLocaleDateString('fr-FR')}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900">Données spécifiques</h4>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>
        {renderDataForm()}
      </div>
    </div>
  );
}