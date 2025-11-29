# Inventory Management System

A modern, feature-rich Inventory Management System built with Angular 17 and Tailwind CSS. This application runs entirely on the frontend, using LocalStorage for data persistence.

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)

## Features

### Core Functionality
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Search**: Real-time search with debouncing for optimal performance
- **Filtering**: Filter products by category
- **Sorting**: Sort by name, price, quantity, or date (ascending/descending)
- **Pagination**: Custom-built pagination without external dependencies
- **Data Persistence**: All data stored in LocalStorage

### UI/UX Features
- **Dark Mode**: Toggle between light and dark themes (preference saved in LocalStorage)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Multiple Views**: Switch between table and card layouts
- **Smooth Animations**: Fade-in, slide-up effects for a polished experience
- **Form Validation**: Real-time validation with helpful error messages
- **Low Stock Indicators**: Visual highlighting for products with low quantity

### Technical Features
- **Angular Signals**: Modern reactive state management
- **Reactive Forms**: Type-safe form handling with validation
- **Standalone Components**: Modern Angular architecture
- **Custom Directive**: Quantity highlight directive for stock warnings
- **State Persistence**: UI state (filters, sort, pagination) preserved across sessions

## Project Structure

```
src/
├── app/
│   ├── core/                          # Core functionality
│   │   ├── models/
│   │   │   └── product.model.ts       # Product interface & types
│   │   ├── services/
│   │   │   ├── product.service.ts     # Product CRUD & state management
│   │   │   └── storage.service.ts     # LocalStorage wrapper
│   │   └── directives/
│   │       └── quantity-highlight.directive.ts
│   │
│   ├── features/                      # Feature modules
│   │   └── products/
│   │       └── components/
│   │           ├── product-list/      # Product listing page
│   │           └── product-form/      # Add/Edit product form
│   │
│   ├── shared/                        # Shared components
│   │   └── components/
│   │       ├── pagination/            # Custom pagination
│   │       └── search-filter/         # Search & filter controls
│   │
│   ├── app.component.*                # Root component
│   ├── app.config.ts                  # App configuration
│   └── app.routes.ts                  # Route definitions
│
├── assets/
│   └── mock-data.json                 # Initial product data
│
├── styles.css                         # Global styles & Tailwind imports
├── index.html                         # Entry HTML
└── main.ts                            # Bootstrap file
```

## Setup and Installation

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd IMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## Usage Guide

### Products List
- View all products in a table or card layout
- Use the search bar to find products by name
- Filter by category using the dropdown
- Sort by clicking on the column headers or using the sort dropdown
- Navigate through pages using the pagination controls

### Add a Product
1. Click the "Add Product" button
2. Fill in the product details:
   - **Name**: Product name (required, 2-100 characters)
   - **Category**: Select from available categories
   - **Price**: Product price (required, must be > 0)
   - **Quantity**: Stock quantity (required, must be >= 0)
3. Click "Add Product" to save

### Edit a Product
1. Hover over a product row and click the edit icon
2. Modify the desired fields
3. Click "Update Product" to save changes

### Delete a Product
1. Hover over a product row and click the delete icon
2. Confirm the deletion in the modal dialog

### Dark Mode
- Click the sun/moon icon in the header to toggle dark mode
- Your preference is automatically saved

## Design Decisions

### Architecture
- **Feature-based Structure**: Code is organized by feature (products) with core services and shared components separated for reusability
- **Standalone Components**: All components use Angular's standalone API for better tree-shaking and simpler imports
- **Lazy Loading**: Feature components are lazy-loaded for optimal initial bundle size

### State Management
- **Angular Signals**: Used for reactive state management, providing fine-grained reactivity
- **Computed Values**: Derived state (filtered products, pagination) is calculated using computed signals
- **LocalStorage Integration**: All state changes are automatically persisted

### Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid, consistent styling
- **Custom Design System**: Extended Tailwind config with custom colors, fonts, and animations
- **CSS Components**: Reusable component classes defined in global styles
- **Dark Mode**: Class-based dark mode with system preference detection

### Form Handling
- **Reactive Forms**: Chosen for type safety and powerful validation capabilities
- **Custom Validators**: Price must be > 0, quantity must be >= 0
- **User Feedback**: Real-time validation messages with clear error states

### Custom Directive
- **QuantityHighlightDirective**: Attribute directive that highlights products based on stock levels
  - Critical stock (≤5): Red highlighting
  - Low stock (≤10): Amber/yellow highlighting
  - Configurable thresholds via inputs

## Product Model

```typescript
interface Product {
  id: number;          // Auto-generated unique identifier
  name: string;        // Product name
  category: string;    // Product category
  quantity: number;    // Stock quantity
  price: number;       // Price in USD
  createdAt: Date;     // Auto-generated creation timestamp
}
```

## Validation Rules

| Field    | Rules                                      |
|----------|-------------------------------------------|
| name     | Required, 2-100 characters                |
| category | Required                                  |
| price    | Required, must be greater than 0          |
| quantity | Required, must be >= 0, whole numbers only|

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- **Debounced Search**: 300ms debounce on search input to reduce unnecessary filtering
- **Computed Signals**: Memoized derived state for efficient re-renders
- **Lazy Loading**: Routes are lazy-loaded to reduce initial bundle size
- **Optimized Animations**: CSS-based animations for smooth 60fps performance

## License

This project is created for educational purposes.

