import { Directive, Input, ElementRef, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appQuantityHighlight]',
  standalone: true
})
export class QuantityHighlightDirective implements OnChanges {
  @Input('appQuantityHighlight') quantity = 0;
  @Input() lowStockThreshold = 10;
  @Input() criticalStockThreshold = 5;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quantity'] || changes['lowStockThreshold'] || changes['criticalStockThreshold']) {
      this.updateHighlight();
    }
  }

  private updateHighlight(): void {
    const element = this.el.nativeElement;
    
    // Remove all highlight classes first
    this.renderer.removeClass(element, 'low-stock');
    this.renderer.removeClass(element, 'critical-stock');
    this.renderer.removeClass(element, 'border-l-amber-400');
    this.renderer.removeClass(element, 'border-l-red-400');
    this.renderer.removeClass(element, 'dark:border-l-amber-500');
    this.renderer.removeClass(element, 'dark:border-l-red-500');
    this.renderer.removeClass(element, 'border-l-4');
    this.renderer.removeClass(element, 'bg-amber-50/50');
    this.renderer.removeClass(element, 'bg-red-50/50');
    this.renderer.removeClass(element, 'dark:bg-amber-900/10');
    this.renderer.removeClass(element, 'dark:bg-red-900/10');

    if (this.quantity <= this.criticalStockThreshold) {
      this.renderer.addClass(element, 'critical-stock');
      this.renderer.addClass(element, 'border-l-4');
      this.renderer.addClass(element, 'border-l-red-400');
      this.renderer.addClass(element, 'dark:border-l-red-500');
      this.renderer.addClass(element, 'bg-red-50/50');
      this.renderer.addClass(element, 'dark:bg-red-900/10');
    } else if (this.quantity <= this.lowStockThreshold) {
      this.renderer.addClass(element, 'low-stock');
      this.renderer.addClass(element, 'border-l-4');
      this.renderer.addClass(element, 'border-l-amber-400');
      this.renderer.addClass(element, 'dark:border-l-amber-500');
      this.renderer.addClass(element, 'bg-amber-50/50');
      this.renderer.addClass(element, 'dark:bg-amber-900/10');
    }
  }
}

