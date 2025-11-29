import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SortField, SortDirection, SortConfig } from '@core/models/product.model';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Input() searchKeyword = '';
  @Input() selectedCategory = '';
  @Input() categories: string[] = [];
  @Input() sortConfig: SortConfig = { field: 'createdAt', direction: 'desc' };

  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<{ field: SortField; direction?: SortDirection }>();
  @Output() resetFilters = new EventEmitter<void>();

  private translateService = inject(TranslateService);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  searchInput = signal('');
  isFiltersOpen = signal(false);

  readonly sortOptions: { field: SortField; labelKey: string }[] = [
    { field: 'name', labelKey: 'sort.name' },
    { field: 'price', labelKey: 'sort.price' },
    { field: 'quantity', labelKey: 'sort.quantity' },
    { field: 'createdAt', labelKey: 'sort.createdAt' }
  ];

  ngOnInit(): void {
    this.searchInput.set(this.searchKeyword);
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.searchChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.set(value);
    this.searchSubject.next(value);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(value);
  }

  onSortFieldChange(event: Event): void {
    const field = (event.target as HTMLSelectElement).value as SortField;
    this.sortChange.emit({ field });
  }

  toggleSortDirection(): void {
    const newDirection: SortDirection = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ field: this.sortConfig.field, direction: newDirection });
  }

  onReset(): void {
    this.searchInput.set('');
    this.resetFilters.emit();
  }

  toggleFilters(): void {
    this.isFiltersOpen.update(v => !v);
  }

  hasActiveFilters(): boolean {
    return !!(this.searchKeyword || this.selectedCategory);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.searchSubject.next('');
  }

  getSortLabel(labelKey: string): string {
    return this.translateService.instant(labelKey);
  }
}
