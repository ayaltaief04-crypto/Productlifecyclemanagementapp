import { Product } from "../types";
import { GitBranch, User, Calendar } from "lucide-react";

interface HistoryTabProps {
  product: Product;
}

export function HistoryTab({ product }: HistoryTabProps) {
  const phaseColors: Record<string, string> = {
    'ideation': 'bg-purple-100 text-purple-700',
    'analyse': 'bg-blue-100 text-blue-700',
    'developpement': 'bg-orange-100 text-orange-700',
    'validation': 'bg-yellow-100 text-yellow-700',
    'production': 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-1">Historique des versions</h3>
        <p className="text-sm text-gray-600">
          Traçabilité complète du produit et de son évolution
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-6">
          {product.versions.map((version, index) => (
            <div key={version.id} className="relative flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white relative z-10">
                <GitBranch className="w-5 h-5" />
              </div>
              
              <div className="flex-1 bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-900">Version {version.version}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${phaseColors[version.phase]}`}>
                        {version.phase}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{version.changes}</p>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Actuel
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{version.createdBy.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {version.createdAt.toLocaleDateString('fr-FR')} à{' '}
                      {version.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm text-blue-900 mb-2">Informations de traçabilité</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <p>• Produit créé le {product.createdAt.toLocaleDateString('fr-FR')} par {product.createdBy.name}</p>
          <p>• Dernière modification le {product.updatedAt.toLocaleDateString('fr-FR')}</p>
          <p>• {product.versions.length} version(s) enregistrée(s)</p>
          <p>• Phase actuelle: {product.phase}</p>
        </div>
      </div>
    </div>
  );
}
