export type ActorRole = 'admin' | 'styliste' | 'marketing' | 'ingenieur' | 'qualite';

export interface Actor {
  id: string;
  name: string;
  role: ActorRole;
  avatar?: string;
  email?: string;
  active?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
}

export interface ActorChecklist {
  actorRole: Exclude<ActorRole, 'admin'>;
  items: ChecklistItem[];
  progress: number;
}

export interface Comment {
  id: string;
  author: Actor;
  message: string;
  timestamp: Date;
  actorRole?: ActorRole;
}

export interface ProductSnapshot {
  name: string;
  description: string;
  phase: ProductPhase;
  status: ProductStatus;
  stylisteData?: {
    concept: string;
    inspiration: string;
    colorPalette?: string;
    sketches?: string[];
  };
  marketingData?: {
    targetMarket: string;
    priceRange: string;
    competition: string;
    analysis?: string;
    potential?: string;
  };
  ingenieurData?: {
    materials: string;
    fabrication: string;
    nomenclature: string;
    bom?: BOMItem[];
    technicalSpecs?: string;
  };
  qualiteData?: {
    normes: string;
    tests: string;
    conformite: string;
    normesList?: string[];
    testResults?: string;
    observations?: string;
  };
}

export interface BOMItem {
  id: string;
  reference: string;
  designation: string;
  matiere: string;
  quantite: number;
  unite: string;
  fournisseur: string;
}

export interface ProductVersion {
  id: string;
  version: string;
  createdAt: Date;
  createdBy: Actor;
  changes: string;
  phase: ProductPhase;
  snapshot?: ProductSnapshot;
}

export type ProductPhase =
  | 'ideation'
  | 'analyse'
  | 'developpement'
  | 'validation'
  | 'production';

export type ProductStatus =
  | 'en-cours'
  | 'en-attente'
  | 'valide'
  | 'rejete';

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  phase: ProductPhase;
  status: ProductStatus;
  currentVersion: string;
  createdAt: Date;
  createdBy: Actor;
  updatedAt: Date;
  checklists: ActorChecklist[];
  comments: Comment[];
  versions: ProductVersion[];
  stylisteData?: {
    concept: string;
    inspiration: string;
    colorPalette?: string;
    sketches?: string[];
  };
  marketingData?: {
    targetMarket: string;
    priceRange: string;
    competition: string;
    analysis?: string;
    potential?: string;
  };
  ingenieurData?: {
    materials: string;
    fabrication: string;
    nomenclature: string;
    bom?: BOMItem[];
    technicalSpecs?: string;
  };
  qualiteData?: {
    normes: string;
    tests: string;
    conformite: string;
    normesList?: string[];
    testResults?: string;
    observations?: string;
  };
}

export interface ChecklistTemplate {
  role: Exclude<ActorRole, 'admin'>;
  items: string[];
}

export interface DecisionReport {
  productId: string;
  productName: string;
  generatedAt: Date;
  overallProgress: number;
  recommendation: 'approuver' | 'reviser' | 'rejeter';
  summary: {
    styliste: number;
    marketing: number;
    ingenieur: number;
    qualite: number;
  };
  risks: string[];
  strengths: string[];
}
