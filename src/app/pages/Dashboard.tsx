import { useState } from "react";
import { Link } from "react-router";
import { useProducts } from "../context/ProductContext";
import { Product, ProductPhase, ProductStatus } from "../types";
import { 
  Lightbulb, 
  TrendingUp, 
  Cog, 
  CheckCircle, 
  Rocket,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";

const phaseIcons: Record<ProductPhase, any> = {
  'ideation': Lightbulb,
  'analyse': TrendingUp,
  'developpement': Cog,
  'validation': CheckCircle,
  'production': Rocket,
};

const phaseColors: Record<ProductPhase, string> = {
  'ideation': 'bg-purple-100 text-purple-700',
  'analyse': 'bg-blue-100 text-blue-700',
  'developpement': 'bg-orange-100 text-orange-700',
  'validation': 'bg-yellow-100 text-yellow-700',
  'production': 'bg-green-100 text-green-700',
};

const statusIcons: Record<ProductStatus, any> = {
  'en-cours': Clock,
  'en-attente': AlertCircle,
  'valide': CheckCircle2,
  'rejete': XCircle,
};

const statusColors: Record<ProductStatus, string> = {
  'en-cours': 'text-blue-600',
  'en-attente': 'text-yellow-600',
  'valide': 'text-green-600',
  'rejete': 'text-red-600',
};

export function Dashboard() {
  const { products } = useProducts();

  const calculateOverallProgress = (product: Product) => {
    const total = product.checklists.reduce((sum, cl) => sum + cl.progress, 0);
    return Math.round(total / product.checklists.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Suivi des produits en développement
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total produits</div>
            <div className="text-2xl text-gray-900">{products.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const PhaseIcon = phaseIcons[product.phase];
          const StatusIcon = statusIcons[product.status];
          const overallProgress = calculateOverallProgress(product);

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  <StatusIcon className={`w-5 h-5 ${statusColors[product.status]} flex-shrink-0 ml-2`} />
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${phaseColors[product.phase]}`}>
                    <PhaseIcon className="w-3.5 h-3.5" />
                    {product.phase.charAt(0).toUpperCase() + product.phase.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">v{product.currentVersion}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progression globale</span>
                    <span className="text-gray-900">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                  {product.checklists.map((checklist) => (
                    <div key={checklist.actorRole} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {checklist.actorRole === 'styliste' && 'Style'}
                        {checklist.actorRole === 'marketing' && 'Market'}
                        {checklist.actorRole === 'ingenieur' && 'Tech'}
                        {checklist.actorRole === 'qualite' && 'Qualité'}
                      </div>
                      <div className="text-sm text-gray-900">
                        {checklist.progress}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Mis à jour le {product.updatedAt.toLocaleDateString('fr-FR')}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}