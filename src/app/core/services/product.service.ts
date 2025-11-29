import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, ProductFormData, UIState, DEFAULT_UI_STATE, SortConfig, SortField, SortDirection } from '../models/product.model';
import { StorageService } from './storage.service';
import MOCK_DATA from '../../../assets/mock-data.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private storageService = inject(StorageService);
  
  private readonly PRODUCTS_KEY = 'products';
  private readonly UI_STATE_KEY = 'uiState';

  // Signals for reactive state
  private productsSignal = signal<Product[]>([]);
  private uiStateSignal = signal<UIState>(DEFAULT_UI_STATE);

  // Public readonly signals
  readonly products = this.productsSignal.asReadonly();
  readonly uiState = this.uiStateSignal.asReadonly();

  // Computed values
  readonly categories = computed(() => {
    const cats = [...new Set(this.productsSignal().map(p => p.category))];
    return cats.sort();
  });

  readonly filteredProducts = computed(() => {
    let result = [...this.productsSignal()];
    const state = this.uiStateSignal();

    // Search filter
    if (state.searchKeyword.trim()) {
      const keyword = state.searchKeyword.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(keyword));
    }

    // Category filter
    if (state.selectedCategory) {
      result = result.filter(p => p.category === state.selectedCategory);
    }

    // Sort
    result = this.sortProducts(result, state.sortConfig);

    return result;
  });

  readonly paginatedProducts = computed(() => {
    const state = this.uiStateSignal();
    const filtered = this.filteredProducts();
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    return filtered.slice(start, end);
  });

  readonly totalPages = computed(() => {
    const state = this.uiStateSignal();
    return Math.ceil(this.filteredProducts().length / state.itemsPerPage) || 1;
  });

  readonly totalItems = computed(() => this.filteredProducts().length);

  constructor() {
    this.initializeProducts();
    this.loadUIState();
  }

  private initializeProducts(): void {
    const stored = this.storageService.getItem<Product[]>(this.PRODUCTS_KEY);
    if (stored && stored.length > 0) {
      // Convert date strings back to Date objects
      const products = stored.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
      this.productsSignal.set(products);
    } else {
      // Initialize with mock data
      const mockProducts: Product[] = MOCK_DATA.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
      this.productsSignal.set(mockProducts);
      this.saveProducts();
    }
  }

  private loadUIState(): void {
    const stored = this.storageService.getItem<UIState>(this.UI_STATE_KEY);
    if (stored) {
      this.uiStateSignal.set({ ...DEFAULT_UI_STATE, ...stored });
    }
  }

  private saveProducts(): void {
    this.storageService.setItem(this.PRODUCTS_KEY, this.productsSignal());
  }

  private saveUIState(): void {
    this.storageService.setItem(this.UI_STATE_KEY, this.uiStateSignal());
  }

  private sortProducts(products: Product[], config: SortConfig): Product[] {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (config.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return config.direction === 'asc' ? comparison : -comparison;
    });
  }

  private getNextId(): number {
    const products = this.productsSignal();
    if (products.length === 0) return 1;
    return Math.max(...products.map(p => p.id)) + 1;
  }

  // CRUD Operations
  getById(id: number): Product | undefined {
    return this.productsSignal().find(p => p.id === id);
  }

  create(data: ProductFormData): Product {
    const newProduct: Product = {
      ...data,
      id: this.getNextId(),
      createdAt: new Date()
    };
    
    this.productsSignal.update(products => [...products, newProduct]);
    this.saveProducts();
    return newProduct;
  }

  update(id: number, data: ProductFormData): Product | null {
    const index = this.productsSignal().findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.productsSignal()[index];
    const updated: Product = {
      ...existing,
      ...data
    };

    this.productsSignal.update(products => {
      const newProducts = [...products];
      newProducts[index] = updated;
      return newProducts;
    });
    
    this.saveProducts();
    return updated;
  }

  delete(id: number): boolean {
    const initialLength = this.productsSignal().length;
    this.productsSignal.update(products => products.filter(p => p.id !== id));
    
    if (this.productsSignal().length < initialLength) {
      this.saveProducts();
      // Adjust current page if necessary
      const currentPage = this.uiStateSignal().currentPage;
      if (currentPage > this.totalPages()) {
        this.setCurrentPage(this.totalPages());
      }
      return true;
    }
    return false;
  }

  // UI State Management
  setSearchKeyword(keyword: string): void {
    this.uiStateSignal.update(state => ({ ...state, searchKeyword: keyword, currentPage: 1 }));
    this.saveUIState();
  }

  setSelectedCategory(category: string): void {
    this.uiStateSignal.update(state => ({ ...state, selectedCategory: category, currentPage: 1 }));
    this.saveUIState();
  }

  setSortConfig(field: SortField, direction?: SortDirection): void {
    this.uiStateSignal.update(state => {
      const newDirection = direction ?? (
        state.sortConfig.field === field && state.sortConfig.direction === 'asc' ? 'desc' : 'asc'
      );
      return { ...state, sortConfig: { field, direction: newDirection }, currentPage: 1 };
    });
    this.saveUIState();
  }

  setCurrentPage(page: number): void {
    const maxPage = this.totalPages();
    const validPage = Math.max(1, Math.min(page, maxPage));
    this.uiStateSignal.update(state => ({ ...state, currentPage: validPage }));
    this.saveUIState();
  }

  resetFilters(): void {
    this.uiStateSignal.set(DEFAULT_UI_STATE);
    this.saveUIState();
  }
}

