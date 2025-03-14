# Flight Search Tool - UX & Styling Guidelines

## Design System

### Colors
```css
/* Primary Colors - Modern Blues */
--primary-50: #F0F7FF;   /* Lightest blue - subtle backgrounds */
--primary-100: #E0F2FE;  /* Light blue - hover states */
--primary-200: #BAE6FD;  /* Soft blue - disabled states */
--primary-500: #0EA5E9;  /* Main blue - buttons, links */
--primary-600: #0284C7;  /* Darker blue - hover states */
--primary-700: #0369A1;  /* Darkest blue - active states */

/* Accent Colors - Warm Yellows */
--accent-50: #FEFCE8;    /* Lightest yellow - subtle backgrounds */
--accent-100: #FEF9C3;   /* Light yellow - highlights */
--accent-200: #FEF08A;   /* Soft yellow - focus states */
--accent-500: #EAB308;   /* Main yellow - accents */
--accent-600: #CA8A04;   /* Darker yellow - hover states */

/* Neutral Colors */
--neutral-50: #F8FAFC;   /* Off-white - page background */
--neutral-100: #F1F5F9;  /* Light gray - card backgrounds */
--neutral-200: #E2E8F0;  /* Border color */
--neutral-300: #CBD5E1;  /* Disabled text */
--neutral-600: #475569;  /* Secondary text */
--neutral-900: #0F172A;  /* Primary text */

/* Semantic Colors */
--success-500: #22C55E;  /* Success states */
--error-500: #EF4444;    /* Error states */
--warning-500: #F59E0B;  /* Warning states */

/* Gradient Combinations */
--gradient-blue: linear-gradient(135deg, var(--primary-500), var(--primary-700));
--gradient-yellow: linear-gradient(135deg, var(--accent-500), var(--accent-600));
--gradient-card: linear-gradient(135deg, var(--primary-50), var(--accent-50));
```

### Typography

```css
/* Font Families */
--font-primary: 'Inter', sans-serif;
--font-display: 'Clash Display', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing

```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Shadows

```css
/* Shadow Styles */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-full: 9999px;  /* Circular */
```

## Component Guidelines

### Buttons

1. **Primary Button**
   - Background: var(--primary-500)
   - Text: white
   - Padding: var(--space-3) var(--space-6)
   - Border Radius: var(--radius-md)
   - Hover: var(--primary-700)

2. **Secondary Button**
   - Background: transparent
   - Border: 1px solid var(--primary-500)
   - Text: var(--primary-500)
   - Same padding and radius as primary

3. **Text Button**
   - No background
   - Text: var(--primary-500)
   - Padding: var(--space-2) var(--space-4)

### Form Elements

1. **Input Fields**
   - Background: white
   - Border: 1px solid var(--neutral-200)
   - Border Radius: var(--radius-md)
   - Padding: var(--space-3)
   - Focus: 2px solid var(--primary-500)

2. **Select Dropdowns**
   - Same styling as input fields
   - Custom chevron icon
   - Hover state with light background

3. **Date Pickers**
   - Custom calendar component
   - Highlight selected dates
   - Range selection support

### Cards

- Background: white
- Border Radius: var(--radius-lg)
- Shadow: var(--shadow-md)
- Padding: var(--space-6)
- Hover: var(--shadow-lg) transition

## User Experience Principles

### Navigation Flow

1. **Homepage**
   - Clear search form above the fold
   - Popular destinations grid below
   - Quick filters for common searches

2. **Search Results**
   - Left sidebar for filters
   - Main content area for flight cards
   - Map view toggle option
   - Sort options (price, duration, stops)

3. **Flight Details**
   - Expandable cards for flight information
   - Price history graph
   - Similar flight suggestions
   - Booking action button

### Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Loading States

1. **Skeleton Loaders**
   - Animated placeholders
   - Maintain layout structure
   - Match component dimensions

2. **Progress Indicators**
   - Linear progress for searches
   - Spinner for quick actions
   - Loading messages for context

### Error Handling

1. **Form Validation**
   - Inline error messages
   - Red highlight on invalid fields
   - Clear error resolution guidance

2. **API Errors**
   - User-friendly error messages
   - Retry options where applicable
   - Fallback content when possible

### Animations

1. **Micro-interactions**
   - Button hover/active states
   - Form field focus
   - Card hover effects

2. **Transitions**
   - Page transitions
   - Modal/popup animations
   - List item animations

```css
/* Animation Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

## Accessibility

1. **Color Contrast**
   - WCAG 2.1 AA compliance
   - Sufficient text contrast
   - Non-color dependent information

2. **Keyboard Navigation**
   - Visible focus states
   - Logical tab order
   - Keyboard shortcuts

3. **Screen Readers**
   - ARIA labels
   - Semantic HTML
   - Alternative text for images

## Performance Considerations

1. **Image Optimization**
   - Next.js Image component
   - Lazy loading
   - Responsive images

2. **Component Loading**
   - Code splitting
   - Dynamic imports
   - Suspense boundaries

3. **Animation Performance**
   - Use transform/opacity
   - Debounce/throttle events
   - RAF for animations 