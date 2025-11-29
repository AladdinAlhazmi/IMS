import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '@core/services/product.service';
import { SortField, SortDirection } from '@core/models/product.model';
import { QuantityHighlightDirective } from '@core/directives/quantity-highlight.directive';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchFilterComponent } from '@shared/components/search-filter/search-filter.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    QuantityHighlightDirective,
    PaginationComponent,
    SearchFilterComponent,
    ProductFormComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private translateService = inject(TranslateService);
  readonly languageService = inject(LanguageService);

  // Expose service signals to template
  readonly products = this.productService.paginatedProducts;
  readonly totalProducts = this.productService.totalItems;
  readonly totalPages = this.productService.totalPages;
  readonly categories = this.productService.categories;
  readonly uiState = this.productService.uiState;

  // Local UI state
  deleteConfirmId = signal<number | null>(null);
  viewMode = signal<'table' | 'cards'>('table');
  
  // Dialog state
  showProductDialog = signal(false);
  editingProductId = signal<string | undefined>(undefined);

  onSearchChange(keyword: string): void {
    this.productService.setSearchKeyword(keyword);
  }

  onCategoryChange(category: string): void {
    this.productService.setSelectedCategory(category);
  }

  onSortChange(event: { field: SortField; direction?: SortDirection }): void {
    this.productService.setSortConfig(event.field, event.direction);
  }

  onPageChange(page: number): void {
    this.productService.setCurrentPage(page);
  }

  onResetFilters(): void {
    this.productService.resetFilters();
  }

  // Dialog methods
  openAddDialog(): void {
    this.editingProductId.set(undefined);
    this.showProductDialog.set(true);
  }

  openEditDialog(id: number): void {
    this.editingProductId.set(id.toString());
    this.showProductDialog.set(true);
  }

  closeDialog(): void {
    this.showProductDialog.set(false);
    this.editingProductId.set(undefined);
  }

  // Column sorting
  onColumnSort(field: SortField): void {
    this.productService.setSortConfig(field);
  }

  getSortDirection(field: SortField): 'asc' | 'desc' | null {
    const sortConfig = this.uiState().sortConfig;
    if (sortConfig.field === field) {
      return sortConfig.direction;
    }
    return null;
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteProduct(id: number): void {
    this.productService.delete(id);
    this.deleteConfirmId.set(null);
  }

  toggleViewMode(): void {
    this.viewMode.update(mode => mode === 'table' ? 'cards' : 'table');
  }

  formatPrice(price: number): string {
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(date: Date): string {
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  getStockBadgeClass(quantity: number): string {
    if (quantity <= 5) return 'badge-danger';
    if (quantity <= 10) return 'badge-warning';
    return 'badge-success';
  }

  getStockLabel(quantity: number): string {
    if (quantity <= 5) return this.translateService.instant('status.critical');
    if (quantity <= 10) return this.translateService.instant('status.low');
    return this.translateService.instant('status.inStock');
  }
}
