export type UserRole = 'produtor' | 'analista' | 'julgador';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Date;
}

export interface Test {
  id: string;
  producerId: string;
  analystId: string;
  judgeIds: string[];
  productName: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  attributes: TestAttribute[];
}

export interface TestAttribute {
  name: string;
  type: 'aroma' | 'cor' | 'textura' | 'aparencia' | 'sabor' | 'impressao';
  scale: 'hedonica' | 'intensidade';
}

export interface Evaluation {
  id: string;
  testId: string;
  judgeId: string;
  scores: {
    attributeId: string;
    score: number;
    comments?: string;
  }[];
  purchaseIntention: number;
  comments?: string;
  createdAt: Date;
}