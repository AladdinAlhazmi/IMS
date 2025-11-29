import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { Product, ProductFormData } from '@core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  form!: FormGroup;
  isEditMode = signal(false);
  isSubmitting = signal(false);
  existingProduct = signal<Product | null>(null);
  submitError = signal<string | null>(null);

  readonly categories = this.productService.categories;

  // Predefined categories for new products
  readonly defaultCategories = [
    'Electronics',
    'Furniture',
    'Office Supplies',
    'Software',
    'Hardware',
    'Accessories'
  ];

  ngOnInit(): void {
    this.initForm();

    if (this.id) {
      const productId = parseInt(this.id, 10);
      const product = this.productService.getById(productId);
      
      if (product) {
        this.isEditMode.set(true);
        this.existingProduct.set(product);
        this.form.patchValue({
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity
        });
      } else {
        // Product not found, redirect to list
        this.router.navigate(['/products']);
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      category: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01), Validators.max(999999.99)]],
      quantity: [null, [Validators.required, Validators.min(0), Validators.max(999999), Validators.pattern(/^\d+$/)]]
    });
  }

  get availableCategories(): string[] {
    const existing = this.categories();
    const combined = [...new Set([...this.defaultCategories, ...existing])];
    return combined.sort();
  }

  get f() {
    return this.form.controls;
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    
    if (errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (errors['minlength']) {
      return `${this.getFieldLabel(controlName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.getFieldLabel(controlName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${this.getFieldLabel(controlName)} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${this.getFieldLabel(controlName)} cannot exceed ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return `${this.getFieldLabel(controlName)} must be a whole number`;
    }
    
    return 'Invalid value';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      name: 'Product name',
      category: 'Category',
      price: 'Price',
      quantity: 'Quantity'
    };
    return labels[controlName] || controlName;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const formData: ProductFormData = {
      name: this.form.value.name.trim(),
      category: this.form.value.category,
      price: parseFloat(this.form.value.price),
      quantity: parseInt(this.form.value.quantity, 10)
    };

    try {
      if (this.isEditMode() && this.id) {
        const productId = parseInt(this.id, 10);
        const updated = this.productService.update(productId, formData);
        if (updated) {
          this.router.navigate(['/products']);
        } else {
          this.submitError.set('Failed to update product. Please try again.');
        }
      } else {
        this.productService.create(formData);
        this.router.navigate(['/products']);
      }
    } catch (error) {
      this.submitError.set('An unexpected error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}

