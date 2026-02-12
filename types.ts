
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'exercise';
  url?: string;
  description?: string;
  quiz?: QuizQuestion[];
  completed?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  items: ContentItem[];
}

export interface UserItemProgress {
  itemId: string;
  itemTitle: string;
  folderName: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string;
}

export interface UserReport {
  userId: string;
  userName: string;
  userEmail: string;
  progress: UserItemProgress[];
}

export interface Progress {
  userId: string;
  completedItems: string[]; 
}
