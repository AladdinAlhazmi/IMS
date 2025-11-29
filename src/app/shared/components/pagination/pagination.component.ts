import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input({ required: true }) set currentPage(value: number) {
    this._currentPage.set(value);
  }
  @Input({ required: true }) set totalPages(value: number) {
    this._totalPages.set(value);
  }
  @Input() set totalItems(value: number) {
    this._totalItems.set(value);
  }
  @Input() itemsPerPage = 10;

  @Output() pageChange = new EventEmitter<number>();

  private _currentPage = signal(1);
  private _totalPages = signal(1);
  private _totalItems = signal(0);

  readonly currentPageValue = this._currentPage.asReadonly();
  readonly totalPagesValue = this._totalPages.asReadonly();
  readonly totalItemsValue = this._totalItems.asReadonly();

  readonly pages = computed(() => {
    const total = this._totalPages();
    const current = this._currentPage();
    const pages: (number | string)[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (current > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push('...');
      }
      
      pages.push(total);
    }
    
    return pages;
  });

  readonly showingFrom = computed(() => {
    const current = this._currentPage();
    return (current - 1) * this.itemsPerPage + 1;
  });

  readonly showingTo = computed(() => {
    const current = this._currentPage();
    const total = this._totalItems();
    return Math.min(current * this.itemsPerPage, total);
  });

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page !== this._currentPage() && page >= 1 && page <= this._totalPages()) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    if (this._currentPage() > 1) {
      this.pageChange.emit(this._currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this._currentPage() < this._totalPages()) {
      this.pageChange.emit(this._currentPage() + 1);
    }
  }

  isNumber(value: number | string): value is number {
    return typeof value === 'number';
  }
}
