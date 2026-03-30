import { useAuth } from "../context/AuthContext";
import { StylisteTasks } from "../components/tasks/StylisteTasks";
import { MarketingTasks } from "../components/tasks/MarketingTasks";
import { IngenieurTasks } from "../components/tasks/IngenieurTasks";
import { QualiteTasks } from "../components/tasks/QualiteTasks";

export function MyTasks() {
  const { currentActor } = useAuth();

  if (!currentActor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Veuillez vous connecter pour accéder à vos tâches</p>
      </div>
    );
  }

  return (
    <div>
      {currentActor.role === 'styliste' && <StylisteTasks />}
      {currentActor.role === 'marketing' && <MarketingTasks />}
      {currentActor.role === 'ingenieur' && <IngenieurTasks />}
      {currentActor.role === 'qualite' && <QualiteTasks />}
    </div>
  );
}
