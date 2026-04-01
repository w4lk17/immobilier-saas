# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev      # Start development server (standard)
npm run devt     # Start development server with Turbopack (faster)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Setup
Copy `.env.example` to `.env.local` and configure `NEXT_PUBLIC_API_URL` to point to your backend API (default: `http://localhost:3333/api`).

### Testing
Test with different user accounts to verify role-based access:
- **Admin** (admin@test.com): Should access all routes including `/admin/*`
- **Manager** (manager@test.com): Should access dashboard routes, NOT admin routes
- **Tenant** (tenant@test.com): Should ONLY access `/tenant-portal/*` routes

Clear browser cookies/cache after structural changes to test fresh authentication flows.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router (React 19)
- **State Management**: Zustand for auth, TanStack Query for server state
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives with Tailwind CSS v4
- **HTTP Client**: Axios with interceptors for auth/refresh token handling
- **Charts**: Recharts for data visualization

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (landing, about, pricing)
│   ├── (auth)/            # Authentication routes (login, register, forgot-password)
│   ├── (dashboard)/       # Protected routes shared by Admin + Manager + Owner
│   ├── admin/             # Admin-only routes (users, managers)
│   ├── manager/           # Manager-specific routes (properties, contracts, tenants, owners, expenses, invoices)
│   ├── owner-portal/      # Owner-specific dashboard routes
│   ├── tenant-portal/     # Tenant-only routes (my-contracts, my-invoices)
│   └── unauthorized/      # Unauthorized access page
├── features/              # Feature-based modules
│   ├── auth/              # Authentication (login, register, profile)
│   ├── users/             # User management (admin only)
│   ├── managers/          # Manager management (admin only) - formerly managers
│   ├── owners/            # Property owner profiles
│   ├── tenants/           # Tenant profiles
│   ├── properties/        # Property/building management
│   ├── contracts/         # Lease contracts
│   ├── invoices/          # Invoice management - formerly payments
│   ├── expenses/          # Expense tracking
│   ├── maintenance/       # Maintenance request management
│   ├── profile/           # User profile management
│   └── reports/           # Financial reports
│   └── [feature]/
│       ├── components/    # Feature-specific UI components
│       ├── hooks/         # TanStack Query hooks (use[Feature].hooks.ts)
│       ├── schemas/       # Zod validation schemas
│       └── services/      # API service layer
├── components/
│   ├── auth/              # Auth guards (RoleGuard, ClientGuard)
│   ├── layouts/           # Layout components (sidebar, header, nav)
│   ├── shared/            # Reusable components (DataTable, charts, form components)
│   └── ui/                # Radix UI primitives (shadcn/ui style)
├── hooks/                 # Shared React hooks (non-feature specific)
├── lib/                   # Utilities and helpers
│   ├── api.ts             # Axios instance with interceptors
│   ├── authUtils.ts       # Authentication utilities (redirects, role names)
│   ├── dateUtils.ts       # Date formatting utilities
│   ├── exportUtils.ts     # CSV/Excel export functionality
│   ├── permissions.ts     # RBAC permission helpers
│   ├── statusHelpers.ts   # Status badge helpers
│   └── tableUtils.ts      # DataTable utilities
├── providers/             # React context providers
├── store/                 # Zustand stores (authStore.ts)
├── styles/                # Global styles and Tailwind config
└── types/                 # TypeScript types and enums
```

### Role-Based Access Control (RBAC)

The application uses a hybrid architecture with route groups for different user roles:

| Route Group | Access | Purpose |
|-------------|--------|---------|
| `(public)` | Everyone | Landing page, about, pricing |
| `(auth)` | Unauthenticated only | Login, register, forgot-password |
| `(dashboard)` | Admin, Manager, Owner | Shared business functionality |
| `admin/` | Admin only | User management, manager management |
| `tenant-portal/` | Tenant only | My contracts, my payments, maintenance |

**Roles and Permissions:**
- **ADMIN**: Full access to all features and user/manager management
- **MANAGER**: Can manage properties, contracts, tenants, owners, expenses, payments (for assigned properties)
- **OWNER**: Read-only access to own properties, related contracts, expenses, payments
- **TENANT**: Read-only access to own contracts and payments

Each protected layout uses `RoleGuard` component to enforce access at the layout level. Components can use `usePermissions()` hook from `@/features/auth/hooks/usePermissions` for granular permission checks.

### Feature Module Pattern

Each feature follows a consistent structure:

- **services/**: API layer (CRUD operations using axios)
- **hooks/**: TanStack Query hooks that wrap service methods
- **schemas/**: Zod schemas for form validation (create/update)
- **components/**: Feature components (list, forms, modals, table columns)

Example pattern for adding a new feature:
1. Create API service in `services/[feature]Api.ts`
2. Create query/mutation hooks in `hooks/use[Feature].hooks.ts`
3. Create Zod schemas in `schemas/[feature]Schemas.ts`
4. Build components (list, form, table columns)
5. Create pages in `app/(dashboard)/[feature]/page.tsx`

### Data Fetching Pattern

All API calls go through:
1. **Service layer** (`services/`) - axios calls
2. **Query hooks** (`hooks/`) - TanStack Query wrappers
3. **Components** - use the hooks

Query keys follow pattern: `['resource']` or `['resource', id, 'modifier']`

```typescript
// Service
async getById(id: number): Promise<Feature> { ... }

// Hook
export function useFeature(id: number) {
  return useQuery({
    queryKey: ['features', id],
    queryFn: () => service.getById(id),
    enabled: !!id,
  });
}
```

### Type System

- **Base types**: `BaseEntity` (id, timestamps)
- **Entity types**: Direct API response types (`User`, `Property`, `Contract`, etc.)
- **Relation types**: Extended with nested data (`PropertyWithRelations`, `ContractWithRelations`)
- **Snippet types**: Minimal data for selects/dropdowns (`UserSnippet`)

Enums in `types/enums.ts` mirror backend Prisma schema enums.

### Authentication Flow

1. Credentials sent to `/auth/login` or `/auth/register`
2. Backend sets HttpOnly cookies (access + refresh tokens)
3. Axios interceptor:
   - On 401 error: calls `/auth/refresh` to get new access token
   - On refresh failure: clears auth store, redirects to `/login`
4. Zustand `authStore` holds user state with helper methods (`isAdmin()`, `canManageUsers()`)

### Path Aliases

The project uses `@/*` path alias configured in `tsconfig.json` pointing to `./src/*`. Use this for all imports:
```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
```

### Route Groups

- `(public)`: Public routes (landing, about, pricing) - no auth required
- `(auth)`: Authentication routes (login, register, forgot-password) - unauthenticated only, no layout
- `(dashboard)`: Protected routes shared by Admin + Manager + Owner - wrapped by `ClientGuard` and `RoleGuard`, sidebar layout
- `admin/`: Admin-only routes (users, managers) - additional `RoleGuard` at layout level
- `manager/`: Manager-specific routes for managing properties and related entities
- `owner-portal/`: Owner-specific dashboard for viewing own properties and financial data
- `tenant-portal/`: Tenant-only routes (my-contracts, my-payments) - `RoleGuard` at layout level

### Permissions

RBAC is defined in `lib/permissions.ts`:
- `Permission` enum for all capabilities
- `rolePermissions` maps roles to allowed permissions
- Helpers: `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()`

**Permission Matrix:**

| Feature | Admin | Manager | Owner | Tenant |
|---------|-------|---------|-------|--------|
| Users Management | ✅ All | ❌ | ❌ | ❌ |
| Managers Management | ✅ All | ❌ | ❌ | ❌ |
| Properties | ✅ View All | ✅ View Assigned | ✅ View Own | ❌ |
| Create Property | ✅ | ✅ | ❌ | ❌ |
| Contracts | ✅ View All | ✅ View All | ❌ | ✅ View Own |
| Payments | ✅ View All | ✅ View All | ❌ | ✅ View Own |
| Expenses | ✅ View All | ✅ View Assigned | ❌ | ❌ |
| Reports | ✅ All Data | ✅ Managed Data | ✅ Own Data | ✅ Own Data |

**Important:** Backend filters data based on authenticated user. Frontend guards (`RoleGuard`, `usePermissions()`) are for UX only, not security.

### DataTable Component

The shared DataTable (`components/shared/DataTable/`) provides a powerful, reusable data table with:
- **Column sorting/filtering**: Multi-column search support
- **Pagination**: Mobile-responsive pagination with desktop and mobile views
- **View options**: Show/hide columns with mobile-friendly trigger
- **Toolbar**: Search input, export functionality, bulk actions bar
- **Export**: CSV and Excel export capabilities
- **Mobile-responsive**: Optimized for all screen sizes

**DataTable Props:**
```typescript
<DataTable
  columns={columns}                    // Required: Column definitions
  data={data}                          // Required: Table data
  searchColumn="name"                  // Search column (optional)
  searchPlaceholder="Rechercher..."    // Search input placeholder
  newButtonHref="/resource/new"        // "New" button link (optional)
  newButtonTitle="Nouveau"             // "New" button text
  enableExport={true}                  // Enable CSV/Excel export
  exportFileName="resource"            // Export file name
  enableBulkActions={true}             // Enable row selection
  bulkActions={(rows) => {...}}        // Bulk action buttons
  meta={{ customFn }}                  // Custom meta for columns
  emptyStateContent={<EmptyState />}   // Custom empty state
/>
```

**Creating Column Definitions:**
```typescript
// features/[feature]/[feature].columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { getStatusBadge } from "@/lib/statusHelpers";

export const featureColumns: ColumnDef<FeatureWithRelations>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div>{row.getValue("name")}</div>
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => getStatusBadge(row.getValue("status"), "feature")
  },
  // Actions column typically uses meta.functions
  {
    id: "actions",
    cell: ({ row, table }) => (
      <Button onClick={() => table.options.meta?.viewDetails(row.original)}>
        Voir
      </Button>
    )
  }
];
```

**Best Practices:**
- Use `DataTableEmptyState` for consistent empty states across all list pages
- Use `getStatusBadge()` from `@/lib/statusHelpers` for status columns
- Enable export by default on all list pages
- Pass custom functions via `meta` prop for actions (view, edit, delete)
- Search column should match a commonly searched field (name, email, address)

### Shared Utilities

The `lib/` directory contains reusable utilities:

**statusHelpers.ts** - Centralized status badge rendering:
```typescript
import { getStatusBadge } from "@/lib/statusHelpers";

// Usage in column definitions
cell: ({ row }) => getStatusBadge(row.getValue("status"), "contract")
// Types: "contract", "payment", "property", "expense", "user", "tenant", "manager"
```

**tableUtils.ts** - Table-specific utilities:
```typescript
import { globalFilterFn } from "@/lib/tableUtils";

// Multi-column search (for use with TanStack Table global filter)
globalFilterFn(row, searchValue, ['name', 'email', 'address'])
```

**exportUtils.ts** - Data export functionality:
```typescript
import { exportToCSV, exportToExcel, getExportDatePrefix } from "@/lib/exportUtils";

// Simple export
exportToCSV(data, "filename");

// With custom columns
exportToCSV(data, "filename", [
  { key: "name", label: "Nom" },
  { key: "email", label: "Email" }
]);

// Date-prefixed filename
exportToCSV(data, `${getExportDatePrefix()}-users`);
```

**authUtils.ts** - Authentication helpers:
```typescript
import { getRoleRedirectPath, getRoleName } from "@/lib/authUtils";

// Get role-based dashboard path after login
const redirectPath = getRoleRedirectPath(user);
// Returns: "/admin" for ADMIN, "/manager-portal" for MANAGER, etc.

// Get French role name for display
const roleName = getRoleName(user.role);
// Returns: "Administrateur", "Gestionnaire", "Propriétaire", "Locataire"
```

**dateUtils.ts** - Date formatting utilities:
```typescript
import { formatDate, formatDateTime, formatRelativeDate } from "@/lib/dateUtils";

formatDate(date)              // "26/03/2026"
formatDateTime(date)          // "26/03/2026 à 14:30"
formatRelativeDate(date)      // "Aujourd'hui", "Hier", or formatted date
```

### Mobile-First Development

This application follows mobile-first responsive design principles:

**DataTable Mobile Optimizations:**
- **Pagination**: Separate mobile/desktop layouts
  - Mobile: Prev/Next buttons + "Page X / Y" text
  - Desktop: First/Prev/Next/Last buttons + page size selector
- **Toolbar**: Vertical stacking on mobile, horizontal on desktop
  - Search input is full-width on mobile
  - Export and view options are icon-only on mobile
- **Table Wrapper**: Horizontal scroll for table content with `min-w-[640px]`

**Responsive Design Patterns:**
```typescript
// Tailwind responsive classes: mobile (default) → sm → md → lg → xl
<div className="flex flex-col sm:flex-row">        // Stack on mobile, row on sm+
<div className="w-full sm:w-auto">                 // Full width mobile, auto on sm+
<div className="hidden sm:block">                  // Hidden on mobile
<div className="block sm:hidden">                  // Only on mobile
<div className="text-sm lg:text-base">             // Smaller text on mobile
```

**Mobile Navigation:**
- Sidebar collapses to hamburger menu on mobile
- Role-based navigation adapts to available screen space
- Portal-specific dashboards optimized for mobile viewing

**Testing Responsive Layouts:**
- Test list pages on mobile viewport (375px - 414px width)
- Verify DataTable pagination works on small screens
- Check that toolbar buttons are accessible on mobile
- Ensure horizontal scroll works for wide tables
```

### Form Patterns

Forms use:
- React Hook Form with Zod resolvers
- `@/components/ui/form` wrapper components
- Shared components: `Combobox` (user selects), `DatePicker`, `ImageDropzone`
- Toast notifications via `sonner` on success/error

### Language

Codebase uses French for user-facing strings (UI text, error messages, toast notifications) but English for code and comments.

### Role-Based Navigation

Navigation in `AppSidebar` changes based on user role:

**Admin**: Links to `/admin/*` routes (users, managers, settings) + shared dashboard routes
**Manager**: Links to properties, contracts, invoices, expenses, owners, tenants, reports
**Owner**: Read-only access to own properties, related contracts, expenses, invoices received
**Tenant**: Links to `/tenant-portal/*` routes (my-contracts, my-invoices, maintenance, messages)

### Role-Based Redirects

After login, users are redirected to role-specific dashboards using `getRoleRedirectPath()`:

```typescript
// Automatic redirects after login
ADMIN      → /admin
MANAGER    → /manager-portal
OWNER      → /owner-portal
TENANT     → /tenant-portal
```

When `RoleGuard` denies access, it redirects unauthorized users to their appropriate dashboard. This prevents users from accessing routes outside their role权限.

### Currency Formatting

The project uses **F CFA** (West African CFA franc) as the currency format:

```typescript
// Correct currency formatting
{amount.toLocaleString('fr-FR')} F CFA

// Use Wallet icon instead of DollarSign for financial displays
import { Wallet } from "lucide-react";
```

**Do not use:**
- ❌ Euro symbol (€)
- ❌ Dollar sign ($)
- ❌ DollarSign icon from lucide-react

**Always use:**
- ✅ F CFA suffix
- ✅ Wallet icon from lucide-react for financial UI
- ✅ French locale formatting (`fr-FR`)

### Shared Components

The `components/shared/` directory contains reusable components used across the application:

**DataTable Components** (see DataTable section above):
- `DataTable.tsx` - Main table component with all features
- `DataTablePagination.tsx` - Mobile-responsive pagination
- `DataTableToolbar.tsx` - Search, export, and view options
- `DataTableViewOptions.tsx` - Column visibility toggle
- `DataTableEmptyState.tsx` - Reusable empty state component
- `data-table-column-header.tsx` - Sortable column headers
- `data-table-faceted-filter.tsx` - Filter dropdowns

**Form Components:**
- `Combobox.tsx` - Generic select dropdown with search
- `ComboboxUsers.tsx` - User select dropdown with search and avatars
- `DatePicker.tsx` - Date picker component
- `ImageDropzone.tsx` - Single image upload
- `MultiImageDropzone.tsx` - Multiple image upload
- `ModeSwitcher.tsx` - Theme/view mode toggle
- `preset-selector.tsx` - Preset selection component

**Data Visualization:**
- `KPICard.tsx` - KPI/stat card component
- `SmallCard.tsx` - Small info card
- `AppBarChart.tsx` - Bar chart wrapper
- `AppPieChart.tsx` - Pie chart wrapper

**Utility Components:**
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorPage.tsx` - Error page component
- `image-uploader.tsx` - Image upload utility
- `Notifications.tsx` - Notification display

**Usage Pattern:**
```typescript
import { DataTable } from "@/components/shared/DataTable/DataTable";
import { DataTableEmptyState } from "@/components/shared/DataTable/DataTableEmptyState";
import { ComboboxUsers } from "@/components/shared/ComboboxUsers";
import { DatePicker } from "@/components/shared/DatePicker";
```

### Hooks

**Shared Hooks (`src/hooks/`):**
- `use-mobile.ts` - Detect mobile screen size (`isMobile` boolean)
- `use-meta-color.ts` - Dynamic meta/theme color management

**Feature Hooks (`src/features/[feature]/hooks/`):**
Each feature has `use[Feature].hooks.ts` containing TanStack Query hooks:
- Query hooks: `use[Feature]s()`, `use[Feature](id)`
- Mutation hooks: `useCreate[Feature]()`, `useUpdate[Feature]()`, `useDelete[Feature]()`

**Auth Hooks (`src/features/auth/hooks/`):**
- `useAuth.ts` - Main authentication hook (login, logout, user state)
- `usePermissions.ts` - Permission checking hook

**Usage Pattern:**
```typescript
// Feature hook in component
import { usePropertiesWithRelations } from "@/features/properties/hooks/useProperties.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMobile } from "@/hooks/use-mobile";

export function MyComponent() {
  const { data: properties, isLoading } = usePropertiesWithRelations();
  const { user, isAdmin } = useAuth();
  const isMobile = useMobile();

  // ...
}
```

### Error Handling and Notifications

**Toast Notifications (Sonner):**
```typescript
import { toast } from "sonner";

// Success
toast.success("Action réussie !");

// Error
toast.error("Erreur lors de l'opération");

// With description
toast.success("Utilisateur créé", {
  description: "L'utilisateur a été ajouté avec succès."
});

// Promise handling (auto-loading)
toast.promise(createUser(data), {
  loading: "Création en cours...",
  success: "Utilisateur créé !",
  error: "Erreur lors de la création."
});
```

**API Error Handling:**
- Axios interceptor in `lib/api.ts` handles 401 errors automatically
- Token refresh is attempted silently on 401
- If refresh fails, user is redirected to login and auth store is cleared
- Components should wrap API calls in try/catch and show toast notifications

**Component Error Boundaries:**
- Use `<Alert variant="destructive">` for permission errors
- Show empty states with `DataTableEmptyState` when no data
- Use `LoadingSpinner` during data fetching
