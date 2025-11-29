export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface ProductFormData {
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export type SortField = 'name' | 'category' | 'price' | 'quantity' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface UIState {
  searchKeyword: string;
  selectedCategory: string;
  sortConfig: SortConfig;
  currentPage: number;
  itemsPerPage: number;
}

export const DEFAULT_UI_STATE: UIState = {
  searchKeyword: '',
  selectedCategory: '',
  sortConfig: {
    field: 'createdAt',
    direction: 'desc'
  },
  currentPage: 1,
  itemsPerPage: 10
};

