export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    priority: PriorityType;
}

export type FilterType = 'all' | 'active' | 'completed';

export type PriorityType = 'low' | 'medium' | 'high';