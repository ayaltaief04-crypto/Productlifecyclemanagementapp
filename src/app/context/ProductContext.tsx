import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ProductVersion, ActorChecklist, ChecklistTemplate } from '../types';
import { mockProducts, defaultChecklistTemplates } from '../data/mockData';

interface ProductContextType {
  products: Product[];
  checklistTemplates: ChecklistTemplate[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addVersion: (productId: string, version: ProductVersion) => void;
  updateChecklist: (productId: string, checklist: ActorChecklist) => void;
  addComment: (productId: string, comment: any) => void;
  getProduct: (id: string) => Product | undefined;
  setChecklistTemplates: (templates: ChecklistTemplate[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [checklistTemplates, setChecklistTemplates] = useState<ChecklistTemplate[]>(defaultChecklistTemplates);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
    );
  };

  const addVersion = (productId: string, version: ProductVersion) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          versions: [...p.versions, version],
          currentVersion: version.version,
          updatedAt: new Date(),
        };
      })
    );
  };

  const updateChecklist = (productId: string, checklist: ActorChecklist) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const completedItems = checklist.items.filter(i => i.completed).length;
        const progress = Math.round((completedItems / checklist.items.length) * 100);
        const updatedChecklist = { ...checklist, progress };
        return {
          ...p,
          checklists: p.checklists.map(cl =>
            cl.actorRole === checklist.actorRole ? updatedChecklist : cl
          ),
          updatedAt: new Date(),
        };
      })
    );
  };

  const addComment = (productId: string, comment: any) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, comments: [...p.comments, comment], updatedAt: new Date() }
          : p
      )
    );
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{
      products,
      checklistTemplates,
      addProduct,
      updateProduct,
      addVersion,
      updateChecklist,
      addComment,
      getProduct,
      setChecklistTemplates,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
