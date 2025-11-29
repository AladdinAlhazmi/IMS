import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Product, SortField, SortDirection } from '@core/models/product.model';
import { QuantityHighlightDirective } from '@core/directives/quantity-highlight.directive';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchFilterComponent } from '@shared/components/search-filter/search-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    QuantityHighlightDirective,
    PaginationComponent,
    SearchFilterComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);

  // Expose service signals to template
  readonly products = this.productService.paginatedProducts;
  readonly totalProducts = this.productService.totalItems;
  readonly totalPages = this.productService.totalPages;
  readonly categories = this.productService.categories;
  readonly uiState = this.productService.uiState;

  // Local UI state
  deleteConfirmId = signal<number | null>(null);
  viewMode = signal<'table' | 'cards'>('table');

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
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
    if (quantity <= 5) return 'Critical';
    if (quantity <= 10) return 'Low';
    return 'In Stock';
  }
}

