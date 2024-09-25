export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    priority: PriorityType;
    order: number;
    editing: boolean;
    dueDate: Date | null;
}

export type FilterType = 'all' | 'active' | 'completed';

export type PriorityType = 'low' | 'medium' | 'high';