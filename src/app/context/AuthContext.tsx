import { createContext, useContext, useState, ReactNode } from 'react';
import { Actor, ActorRole } from '../types';
import { actors as initialActors } from '../data/mockData';

interface AuthContextType {
  currentActor: Actor | null;
  users: Actor[];
  login: (actor: Actor) => void;
  logout: () => void;
  addUser: (user: Omit<Actor, 'id'>) => void;
  updateUser: (id: string, updates: Partial<Actor>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentActor, setCurrentActor] = useState<Actor | null>(null);
  const [users, setUsers] = useState<Actor[]>(initialActors);

  const login = (actor: Actor) => setCurrentActor(actor);
  const logout = () => setCurrentActor(null);

  const addUser = (user: Omit<Actor, 'id'>) => {
    const newUser: Actor = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<Actor>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthContext.Provider value={{ currentActor, users, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
