# Hybrid Architecture Migration Guide

## 📁 New Folder Structure

```
src/app/
├── (public)/                    # Public pages (no auth required)
│   ├── layout.tsx              # ✅ Created
│   ├── page.tsx                # Move landing page here
│   ├── about/
│   └── pricing/
│
├── (auth)/                      # Authentication routes
│   ├── layout.tsx              # ✅ Already exists
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── (dashboard)/                 # SHARED - Manager + Owner + Admin
│   ├── layout.tsx              # ✅ Updated with RoleGuard
│   ├── accueil/                # Dashboard home
│   ├── properties/             # ✅ Already exists - stays here
│   ├── contracts/              # ✅ Already exists - stays here
│   ├── payments/               # ✅ Already exists - stays here
│   ├── expenses/               # ✅ Already exists - stays here
│   ├── owners/                 # ✅ Already exists - stays here
│   ├── tenants/                # ✅ Already exists - stays here
│   └── reports/                # ✅ Already exists - stays here
│
├── (admin-panel)/               # ADMIN-ONLY routes
│   ├── layout.tsx              # ✅ Created
│   ├── page.tsx                # Create: Admin dashboard home
│   ├── users/                  # MOVE from /dashboard/users
│   ├── managers/              # MOVE from /dashboard/managers
│   ├── settings/               # Create: System settings
│   └── system/                 # Create: System management
│
└── (tenant-portal)/             # TENANT-ONLY routes
    ├── layout.tsx              # ✅ Created
    ├── page.tsx                # Create: Tenant dashboard home
    ├── my-contracts/           # Create: Tenant's contracts
    ├── my-payments/            # Create: Tenant's payments
    ├── maintenance/            # Create: Maintenance requests
    ├── messages/               # Create: Messages
    └── documents/              # Create: Documents
```

---

## 🔄 Migration Steps

### Phase 1: Move Landing Page

```bash
# Move current landing page to (public) folder
mv src/app/page.tsx src/app/(public)/page.tsx
```

### Phase 2: Move Admin-Only Pages

```bash
# Move users management to admin-panel (ADMIN ONLY)
mv src/app/\(dashboard\)/users src/app/\(admin-panel\)/users

# Move managers management to admin-panel (ADMIN ONLY)
mv src/app/\(dashboard\)/managers src/app/\(admin-panel\)/managers
```

**Why managers in admin-panel?**
- Only admins can manage managers (HR functions)
- Managers work WITH managers but don't manage them
- Managers are system users managed by admins

### Phase 3: Create Tenant Pages

```bash
# Create new tenant-specific pages
mkdir -p src/app/\(tenant-portal\)/my-contracts
mkdir -p src/app/\(tenant-portal\)/my-payments
mkdir -p src/app/\(tenant-portal\)/maintenance
```

---

## 📄 Page Creation Checklist

### Admin Panel Pages

- [ ] `/admin-panel/page.tsx` - Admin dashboard home
- [ ] `/admin-panel/users/` - User management (MOVED)
- [ ] `/admin-panel/managers/` - Manager management (MOVED)
- [ ] `/admin-panel/settings/` - System settings
- [ ] `/admin-panel/system/` - System status/info

### Dashboard Pages (Shared by Manager + Owner + Admin)

- [x] `/dashboard/accueil` - Dashboard home
- [x] `/dashboard/properties` - Properties management
- [x] `/dashboard/contracts` - Contracts management
- [x] `/dashboard/payments` - Payments tracking
- [x] `/dashboard/expenses` - Expenses tracking
- [x] `/dashboard/owners` - Owners management
- [x] `/dashboard/tenants` - Tenants management
- [x] `/dashboard/reports` - Reports and analytics

### Tenant Portal Pages

- [ ] `/tenant-portal/page.tsx` - Tenant dashboard home
- [ ] `/tenant-portal/my-contracts/` - Show tenant's contracts only
- [ ] `/tenant-portal/my-payments/` - Show tenant's payments only
- [ ] `/tenant-portal/maintenance/` - Maintenance request form
- [ ] `/tenant-portal/messages/` - Messages with landlord
- [ ] `/tenant-portal/documents/` - Contract documents, receipts

---

## 🎯 URL Mapping Table

| Current URL | New URL | Notes |
|-------------|---------|-------|
| `/` (landing) | `/` | Same, just moved to (public) |
| `/login` | `/login` | No change |
| `/dashboard/accueil` | `/accueil` | Dashboard home - shared |
| `/dashboard/users` | `/admin-panel/users` | Admin only |
| `/dashboard/managers` | `/admin-panel/managers` | Admin only |
| `/dashboard/properties` | `/dashboard/properties` | Shared - stays |
| `/dashboard/contracts` | `/dashboard/contracts` | Shared - stays |
| `/dashboard/payments` | `/dashboard/payments` | Shared - stays |
| `/dashboard/expenses` | `/dashboard/expenses` | Shared - stays |
| `/dashboard/reports` | `/dashboard/reports` | Shared - stays |
| `/dashboard/owners` | `/dashboard/owners` | Shared - stays |
| `/dashboard/tenants` | `/dashboard/tenants` | Shared - stays |
| N/A | `/admin-panel/settings` | NEW - Admin settings |
| N/A | `/tenant-portal/my-contracts` | NEW - Tenant contracts |
| N/A | `/tenant-portal/my-payments` | NEW - Tenant payments |

---

## 🎨 Role-Based Navigation

### Admin Navigation
- Tableau de bord → `/admin-panel`
- Utilisateurs → `/admin-panel/users`
- Employés → `/admin-panel/managers`
- Paramètres → `/admin-panel/settings`
- Système → `/admin-panel/system`
- Rapports → `/dashboard/reports`
- Biens → `/dashboard/properties` (can view all)
- Contrats → `/dashboard/contracts` (can view all)

### Manager Navigation
- Tableau de bord → `/accueil`
- Propriétaires → `/dashboard/owners`
- Locataires → `/dashboard/tenants`
- Biens → `/dashboard/properties` (sees only assigned)
- Contrats → `/dashboard/contracts`
- Paiements → `/dashboard/payments`
- Dépenses → `/dashboard/expenses`
- Rapports → `/dashboard/reports`

### Tenant Navigation
- Tableau de bord → `/tenant-portal`
- Mes Contrats → `/tenant-portal/my-contracts`
- Mes Paiements → `/tenant-portal/my-payments`
- Maintenance → `/tenant-portal/maintenance`
- Messages → `/tenant-portal/messages`
- Documents → `/tenant-portal/documents`

---

## 🔐 Permission Examples

### Example 1: Properties List Page (Manager/Admin)

**File:** `src/app/(dashboard)/properties/page.tsx`

```tsx
"use client";

import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
import { PropertyList } from "@/features/properties/components/PropertyList";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties();
  const { canManageProperty, isManager, isAdmin } = usePermissions();

  // Backend already filtered data:
  // - Admin sees all properties
  // - Manager sees only properties where managerId = their userId
  // - Owner sees only properties where ownerId = their userId

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Biens Immobiliers</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Tous les biens" : isManager ? "Biens que vous gérez" : "Vos biens"}
          </p>
        </div>

        {/* Show create button only for managers/admins */}
        <RoleGuard
          allowedRoles={["ADMIN", "MANAGER"]}
          fallback={<></>}
        >
          <Button asChild>
            <Link href="/dashboard/properties/new">
              Nouveau Bien
            </Link>
          </Button>
        </RoleGuard>
      </div>

      <PropertyList
        properties={properties || []}
        isLoading={isLoading}
        canEdit={canManageProperty}
      />
    </div>
  );
}
```

### Example 2: Admin Managers Page

**File:** `src/app/(admin-panel)/managers/page.tsx`

```tsx
"use client";

import { useManagers } from "@/features/managers/hooks/useManagers.hooks";
import { ManagerList } from "@/features/managers/components/ManagerList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminManagersPage() {
  const { data: managers, isLoading } = useManagers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employés</h1>
          <p className="text-muted-foreground">
            Gérer les employés de l'entreprise
          </p>
        </div>

        <Button asChild>
          <Link href="/admin-panel/managers/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Employé
          </Link>
        </Button>
      </div>

      <ManagerList managers={managers || []} isLoading={isLoading} />
    </div>
  );
}
```

### Example 3: Tenant My-Contracts Page

**File:** `src/app/(tenant-portal)/my-contracts/page.tsx`

```tsx
"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useContracts } from "@/features/contracts/hooks/useContracts.hooks";
import { ContractList } from "@/features/contracts/components/ContractList";

export default function MyContractsPage() {
  const { user } = useAuth();

  // Fetch contracts (backend filters by tenantId = user.id)
  const { data: contracts, isLoading } = useContracts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Contrats</h1>
        <p className="text-muted-foreground">
          Vos contrats de location actifs
        </p>
      </div>

      <ContractList
        contracts={contracts || []}
        isLoading={isLoading}
        showActions={false} // Tenants can view but not edit
      />
    </div>
  );
}
```

---

## 🔑 Key Points to Remember

### 1. Backend Filtering is KEY
The backend MUST filter data based on the authenticated user:
- **Admin**: Gets all data (users, managers, properties, contracts, payments, expenses)
- **Manager**: Gets data where `managerId = userId` (properties, contracts they manage)
- **Tenant**: Gets data where `tenantId = userId` (contracts, payments)
- **Owner**: Gets data where `ownerId = userId` (their properties)

### 2. Frontend Guards are UX Helpers
RoleGuard and PermissionGuard are for UX, NOT security:
- Hide/disable buttons user can't use
- Show appropriate empty states
- Customize text based on role

### 3. Admin-Only Routes in (admin-panel)
Only admins can access:
- `/admin-panel/users` - User management
- `/admin-panel/managers` - Manager/HR management
- `/admin-panel/settings` - System settings
- `/admin-panel/system` - System administration

### 4. Shared Routes in (dashboard)
Features accessed by multiple roles stay in `(dashboard)/`:
- Properties (Manager + Owner + Admin views)
- Contracts (Manager + Admin manage, Tenants view their own)
- Payments (Manager + Admin manage, Tenants view their own)
- Expenses (Manager + Admin)
- Reports (All roles have different views)
- Owners (Manager + Admin manage)
- Tenants (Manager + Admin manage)

### 5. Tenant-Only Routes in (tenant-portal)
- `/tenant-portal/my-contracts` - Their contracts only
- `/tenant-portal/my-payments` - Their payments only
- `/tenant-portal/maintenance` - Submit maintenance requests
- `/tenant-portal/messages` - Communication with landlord

---

## 🧪 Testing Checklist

After migration, test each role:

### Admin (admin@test.com)
- [ ] Can access `/admin-panel/users` ✅
- [ ] Can access `/admin-panel/managers` ✅
- [ ] Can access `/dashboard/properties` (sees all properties) ✅
- [ ] Can access `/dashboard/contracts` (sees all contracts) ✅
- [ ] Can access `/admin-panel/settings` ✅
- [ ] CANNOT access `/tenant-portal/*` (redirects to admin-panel) ✅
- [ ] CANNOT access `/dashboard/managers` (moved to admin-panel) ✅

### Manager (manager@test.com)
- [ ] Can access `/dashboard/properties` (sees only assigned properties) ✅
- [ ] Can access `/dashboard/contracts` (manages contracts) ✅
- [ ] Can access `/dashboard/payments` ✅
- [ ] Can access `/dashboard/expenses` ✅
- [ ] CANNOT access `/admin-panel/users` (redirects to dashboard) ✅
- [ ] CANNOT access `/admin-panel/managers` (redirects to dashboard) ✅
- [ ] CANNOT access `/tenant-portal/*` (redirects to dashboard) ✅

### Tenant (tenant@test.com)
- [ ] Can access `/tenant-portal/my-contracts` (sees only own contracts) ✅
- [ ] Can access `/tenant-portal/my-payments` (sees only own payments) ✅
- [ ] Can access `/tenant-portal/maintenance` ✅
- [ ] CANNOT access `/dashboard/properties` (redirects to tenant-portal) ✅
- [ ] CANNOT access `/admin-panel/*` (redirects to tenant-portal) ✅
- [ ] CANNOT access `/dashboard/managers` (doesn't exist anymore) ✅

---

## 📚 Next Steps

1. ✅ RoleGuard component created
2. ✅ Permission hook created
3. ✅ Guard components created
4. ✅ Layouts created
5. ✅ AppSidebar updated with role-based navigation
6. ⏳ **Move pages to new folders**
   - Move `/dashboard/users` → `/admin-panel/users`
   - Move `/dashboard/managers` → `/admin-panel/managers`
   - Move `/page.tsx` → `(public)/page.tsx`
7. ⏳ Update imports/links in moved pages
8. ⏳ Create tenant portal pages
9. ⏳ Test all role flows
10. ⏳ Update CLAUDE.md with new structure

---

## 💡 Tips

- Use `usePermissions()` hook for component-level permission checks
- Use `<RoleGuard>` for showing/hiding UI elements based on roles
- Backend MUST implement row-level filtering for security
- Test with real user accounts for each role
- Check browser console for redirect loops during testing
- Update all internal links when moving pages (use find & replace)
- Clear your browser cache/cookied after structural changes

---

## 🚀 Quick Migration Commands

```bash
# 1. Move landing page
git mv src/app/page.tsx "src/app/(public)/page.tsx"

# 2. Move admin-only pages
git mv "src/app/(dashboard)/users" "src/app/(admin-panel)/users"
git mv "src/app/(dashboard)/managers" "src/app/(admin-panel)/managers"

# 3. Update imports in moved files
# Find: from "@/features/users/hooks/useUsers.hooks"
# Replace: (no change needed, paths remain the same)

# 4. Update sidebar navigation (already done in AppSidebar.tsx)

# 5. Test with different roles
# Login as admin, manager, and tenant to verify redirects work
```

---

## 📊 Permission Matrix

| Feature | Admin | Manager | Owner | Tenant |
|---------|-------|---------|-------|--------|
| **Users Management** | ✅ All | ❌ | ❌ | ❌ |
| **Managers Management** | ✅ All | ❌ | ❌ | ❌ |
| **Properties** | ✅ View All | ✅ View Assigned | ✅ View Own | ❌ |
| **Create Property** | ✅ | ✅ | ❌ | ❌ |
| **Edit Property** | ✅ All | ✅ Assigned Only | ❌ | ❌ |
| **Delete Property** | ✅ | ❌ | ❌ | ❌ |
| **Contracts** | ✅ View All | ✅ View All | ❌ | ✅ View Own |
| **Create Contract** | ✅ | ✅ | ❌ | ❌ |
| **Payments** | ✅ View All | ✅ View All | ❌ | ✅ View Own |
| **Process Payment** | ✅ | ✅ | ❌ | ❌ |
| **Expenses** | ✅ View All | ✅ View Assigned | ❌ | ❌ |
| **Create Expense** | ✅ | ✅ | ❌ | ❌ |
| **Reports** | ✅ All Data | ✅ Managed Data | ✅ Own Data | ✅ Own Data |
