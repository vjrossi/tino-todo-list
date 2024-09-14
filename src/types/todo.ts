export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    priority: PriorityType;
    order: number; // New property
}

export type FilterType = 'all' | 'active' | 'completed';

export type PriorityType = 'low' | 'medium' | 'high';