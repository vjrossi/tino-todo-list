export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
  }