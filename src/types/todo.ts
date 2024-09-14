export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    priority: PriorityType;
    order: number; // New property
    editing: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export type PriorityType = 'low' | 'medium' | 'high';