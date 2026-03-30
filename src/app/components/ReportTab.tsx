import { Product, DecisionReport } from "../types";
import { FileText, Download, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ReportTabProps {
  product: Product;
}

export function ReportTab({ product }: ReportTabProps) {
  const generateReport = (): DecisionReport => {
    const overallProgress = Math.round(
      product.checklists.reduce((sum, cl) => sum + cl.progress, 0) / product.checklists.length
    );

    const summary = {
      styliste: product.checklists.find(cl => cl.actorRole === 'styliste')?.progress || 0,
      marketing: product.checklists.find(cl => cl.actorRole === 'marketing')?.progress || 0,
      ingenieur: product.checklists.find(cl => cl.actorRole === 'ingenieur')?.progress || 0,
      qualite: product.checklists.find(cl => cl.actorRole === 'qualite')?.progress || 0,
    };

    const risks: string[] = [];
    const strengths: string[] = [];

    if (summary.qualite < 50) risks.push("Validation qualité incomplète");
    if (summary.ingenieur < 50) risks.push("Spécifications techniques non finalisées");
    if (summary.marketing < 75) risks.push("Analyse de marché à compléter");
    
    if (summary.styliste === 100) strengths.push("Concept créatif validé");
    if (summary.marketing >= 75) strengths.push("Fort potentiel commercial identifié");
    if (summary.qualite >= 75) strengths.push("Conformité réglementaire en bonne voie");

    let recommendation: 'approuver' | 'reviser' | 'rejeter';
    if (overallProgress >= 80 && summary.qualite >= 75) {
      recommendation = 'approuver';
    } else if (overallProgress >= 50) {
      recommendation = 'reviser';
    } else {
      recommendation = 'rejeter';
    }

    return {
      productId: product.id,
      productName: product.name,
      generatedAt: new Date(),
      overallProgress,
      recommendation,
      summary,
      risks,
      strengths,
    };
  };

  const report = generateReport();

  const handleDownload = () => {
    alert('Téléchargement du rapport PDF... (Fonctionnalité simulée)');
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'approuver': return 'bg-green-100 text-green-700 border-green-200';
      case 'reviser': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejeter': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 mb-1">Rapport d'aide à la décision</h3>
          <p className="text-sm text-gray-600">
            Généré le {report.generatedAt.toLocaleDateString('fr-FR')} à{' '}
            {report.generatedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Télécharger PDF
        </button>
      </div>

      <div className={`rounded-lg border-2 p-6 ${getRecommendationColor(report.recommendation)}`}>
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6" />
          <h4 className="text-lg">Recommandation</h4>
        </div>
        <p className="text-2xl capitalize mb-2">{report.recommendation}</p>
        <p className="text-sm opacity-90">
          Basée sur une progression globale de {report.overallProgress}%
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="text-gray-900">Points forts</h4>
          </div>
          {report.strengths.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun point fort identifié pour le moment</p>
          ) : (
            <ul className="space-y-2">
              {report.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="text-gray-900">Risques identifiés</h4>
          </div>
          {report.risks.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun risque majeur identifié</p>
          ) : (
            <ul className="space-y-2">
              {report.risks.map((risk, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h4 className="text-gray-900">Progression par acteur</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(report.summary).map(([role, progress]) => (
            <div key={role} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 capitalize">{role}</span>
                <span className="text-gray-900">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    progress === 100 ? 'bg-green-600' :
                    progress >= 75 ? 'bg-blue-600' :
                    progress >= 50 ? 'bg-yellow-600' :
                    'bg-orange-600'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-gray-900 mb-3">Résumé exécutif</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Le produit <strong>{product.name}</strong> est actuellement en phase de{' '}
            <strong>{product.phase}</strong> avec une progression globale de{' '}
            <strong>{report.overallProgress}%</strong>.
          </p>
          <p>
            Sur la base de l'analyse des checklists de tous les acteurs et de l'état d'avancement 
            du projet, la recommandation est de <strong>{report.recommendation}</strong> ce produit.
          </p>
          {report.recommendation === 'reviser' && (
            <p className="text-orange-700 mt-3">
              Il est recommandé de compléter les tâches en attente avant de passer à la phase suivante.
            </p>
          )}
          {report.recommendation === 'approuver' && (
            <p className="text-green-700 mt-3">
              Le produit est prêt à passer à la phase suivante du cycle de vie.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
