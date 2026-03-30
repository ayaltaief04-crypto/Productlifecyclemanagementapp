import { useState } from "react";
import { Product, Comment, ActorRole } from "../types";
import { Send, MessageCircle } from "lucide-react";
import { actors } from "../data/mockData";

interface DiscussionTabProps {
  product: Product;
}

export function DiscussionTab({ product }: DiscussionTabProps) {
  const [comments, setComments] = useState<Comment[]>(product.comments);
  const [newMessage, setNewMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<ActorRole | 'tous'>('tous');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: actors[0], // Simule l'utilisateur actuel
      message: newMessage,
      timestamp: new Date(),
      actorRole: selectedRole === 'tous' ? undefined : selectedRole,
    };

    setComments([...comments, newComment]);
    setNewMessage("");
  };

  const filteredComments = selectedRole === 'tous' 
    ? comments 
    : comments.filter(c => c.actorRole === selectedRole);

  const roleColors: Record<ActorRole, string> = {
    'styliste': 'bg-purple-100 text-purple-700',
    'marketing': 'bg-blue-100 text-blue-700',
    'ingenieur': 'bg-orange-100 text-orange-700',
    'qualite': 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">Discussion collaborative</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrer par:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as ActorRole | 'tous')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tous">Tous</option>
            <option value="styliste">Styliste</option>
            <option value="marketing">Marketing</option>
            <option value="ingenieur">Ingénieur</option>
            <option value="qualite">Qualité</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun message pour le moment</p>
            <p className="text-sm mt-1">Soyez le premier à commenter !</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                    {comment.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900">{comment.author.name}</p>
                    <p className="text-xs text-gray-500">
                      {comment.timestamp.toLocaleDateString('fr-FR')} à{' '}
                      {comment.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {comment.actorRole && (
                  <span className={`px-2 py-1 rounded-full text-xs ${roleColors[comment.actorRole]}`}>
                    {comment.actorRole}
                  </span>
                )}
              </div>
              <p className="text-gray-700 pl-10">{comment.message}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Poster en tant que:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as ActorRole | 'tous')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">Message général</option>
              <option value="styliste">Styliste</option>
              <option value="marketing">Marketing</option>
              <option value="ingenieur">Ingénieur</option>
              <option value="qualite">Qualité</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
