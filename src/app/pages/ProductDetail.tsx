import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProducts } from "../context/ProductContext";
import { Product, ActorRole, Comment } from "../types";
import { 
  ArrowLeft, 
  MessageCircle, 
  CheckSquare, 
  History, 
  FileText,
  Palette,
  TrendingUp,
  Wrench,
  Shield,
  Send,
  Download
} from "lucide-react";
import { ChecklistTab } from "../components/ChecklistTab";
import { DiscussionTab } from "../components/DiscussionTab";
import { HistoryTab } from "../components/HistoryTab";
import { ReportTab } from "../components/ReportTab";

type TabType = 'styliste' | 'marketing' | 'ingenieur' | 'qualite' | 'discussion' | 'historique' | 'rapport';
type NonAdminRole = 'styliste' | 'marketing' | 'ingenieur' | 'qualite';

const tabIcons: Record<TabType, any> = {
  'styliste': Palette,
  'marketing': TrendingUp,
  'ingenieur': Wrench,
  'qualite': Shield,
  'discussion': MessageCircle,
  'historique': History,
  'rapport': FileText,
};

const tabLabels: Record<TabType, string> = {
  'styliste': 'Styliste',
  'marketing': 'Marketing',
  'ingenieur': 'Ingénieur',
  'qualite': 'Qualité',
  'discussion': 'Discussion',
  'historique': 'Historique',
  'rapport': 'Rapport',
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<TabType>('styliste');
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Produit non trouvé</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    const total = product.checklists.reduce((sum, cl) => sum + cl.progress, 0);
    return Math.round(total / product.checklists.length);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </button>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl text-gray-900">{product.name}</h1>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  v{product.currentVersion}
                </span>
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-500 mb-1">Phase actuelle</div>
              <div className="text-gray-900 capitalize">{product.phase}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Statut</div>
              <div className="text-gray-900 capitalize">{product.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Créé par</div>
              <div className="text-gray-900">{product.createdBy.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Progression</div>
              <div className="text-gray-900">{calculateOverallProgress()}%</div>
            </div>
          </div>

          <div className="pt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${calculateOverallProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex gap-1 p-2">
            {(['styliste', 'marketing', 'ingenieur', 'qualite', 'discussion', 'historique', 'rapport'] as TabType[]).map((tab) => {
              const Icon = tabIcons[tab];
              const checklist = product.checklists.find(cl => cl.actorRole === tab);
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors relative ${
                    activeTab === tab
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tabLabels[tab]}</span>
                  {checklist && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      checklist.progress === 100 
                        ? 'bg-green-100 text-green-700'
                        : checklist.progress > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {checklist.progress}%
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {(['styliste', 'marketing', 'ingenieur', 'qualite'] as NonAdminRole[]).includes(activeTab as NonAdminRole) && (
            <ChecklistTab product={product} actorRole={activeTab as NonAdminRole} />
          )}
          {activeTab === 'discussion' && <DiscussionTab product={product} />}
          {activeTab === 'historique' && <HistoryTab product={product} />}
          {activeTab === 'rapport' && <ReportTab product={product} />}
        </div>
      </div>
    </div>
  );
}