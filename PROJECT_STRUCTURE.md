# Project Structure - Organizations & Branches

## Directory Tree

```
src/
├── organizations/
│   ├── entities/
│   │   └── organization.entity.ts
│   ├── organizations.controller.ts
│   ├── organizations.service.ts
│   ├── organizations.module.ts
│   └── organizations.dto.ts
├── branchs/
│   ├── entities/
│   │   └── branch.entity.ts
│   ├── branchs.controller.ts
│   ├── branchs.service.ts
│   ├── branchs.module.ts
│   └── branchs.dto.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts (UPDATED - added org/branch relationships)
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── users.dto.ts
├── app.module.ts (UPDATED - added modules)
└── entities/
    └── index.ts (UPDATED - added Organization, Branch)

database/
└── migrations/
    ├── 1734567890129-CreateOrganizationsAndBranchsTables.ts (NEW)
    └── 1734567890130-AddOrganizationAndBranchColumnsToUsers.ts (NEW)
```

## Database Schema Relationships

```
┌─────────────────────────────┐
│     organizations           │
├─────────────────────────────┤
│ id (PK)                     │
│ name                        │
│ email (UNIQUE)              │
│ descriptions                │
│ phone                       │
│ address                     │
│ city                        │
│ country                     │
│ manager_user_id (FK->users) │
│ created_at                  │
│ updated_at                  │
└──────────────┬──────────────┘
               │
               │ 1:N
               │
┌──────────────▼──────────────┐
│         branchs             │
├─────────────────────────────┤
│ id (PK)                     │
│ name                        │
│ organization_id (FK)◄───────┼─── belongs to Organization
│ descriptions                │
│ phone                       │
│ address                     │
│ city                        │
│ country                     │
│ manager_user_id (FK->users) │
│ created_at                  │
│ updated_at                  │
└──────────────┬──────────────┘
               │
               │ 1:N
               │
┌──────────────▼──────────────┐
│         users               │
├─────────────────────────────┤
│ id (PK)                     │
│ name                        │
│ email (UNIQUE)              │
│ password                    │
│ otp                         │
│ otp_expiry                  │
│ role (enum)                 │
│ organization_id (FK)◄───────┼─── nullable, user can belong to org
│ branch_id (FK)◄─────────────┼─── nullable, user can belong to branch
│ profile                     │
│ is_verified                 │
│ is_active                   │
│ last_login                  │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
```

## Service Layer Architecture

```
OrganizationsController
        │
        ▼
OrganizationsService ─────┐
        │                  │ creates
        │                  ▼
    Repository         UsersService
    (TypeORM)              │
        │              creates User with
        ▼           ORGANIZATION_ADMIN role
   organizations    (auto-generated email & password)
       table


BranchsController
        │
        ▼
BranchsService ────────────┐
        │                   │ creates
        │                   ▼
    Repository          UsersService
    (TypeORM)              │
        │              creates User with
        ▼           BRANCH_ADMIN role
     branchs       (auto-generated email & password)
      table
```

## API Flow Example

### Organization Creation Flow

```
1. POST /organizations
   {
     "name": "ACME Corp",
     "email": "acme@company.com",
     "phone": "+1234567890",
     "address": "123 Main St",
     "city": "New York",
     "country": "USA",
     "descriptions": "Main organization"
   }

2. OrganizationsService.create()
   ├─ Create Organization entity
   ├─ Save to database (get ID)
   ├─ Generate random password (16 hex chars)
   ├─ Call UsersService.create()
   │  └─ Create manager user with:
   │     - name: "ACME Corp Manager"
   │     - email: "manager-org-1-1704890789@organization.local"
   │     - password: hashed(random)
   │     - role: ORGANIZATION_ADMIN
   ├─ Update Organization with manager_user_id
   └─ Return Organization with manager info

3. Response 200 OK
   {
     "success": true,
     "message": "Organization created successfully with default manager user",
     "data": {
       "id": 1,
       "name": "ACME Corp",
       "email": "acme@company.com",
       "manager_user_id": 5,
       ...
     }
   }
```

### Branch Creation Flow

```
1. POST /branchs
   {
     "name": "New York Branch",
     "organization_id": 1,
     "phone": "+1234567800",
     "address": "456 Oak St",
     "city": "New York",
     "country": "USA"
   }

2. BranchsService.create()
   ├─ Create Branch entity
   ├─ Save to database (get ID)
   ├─ Generate random password (16 hex chars)
   ├─ Call UsersService.create()
   │  └─ Create manager user with:
   │     - name: "New York Branch Manager"
   │     - email: "manager-branch-1-1704890789@branch.local"
   │     - password: hashed(random)
   │     - role: BRANCH_ADMIN
   ├─ Update Branch with manager_user_id
   └─ Return Branch with manager info

3. Response 200 OK
   {
     "success": true,
     "message": "Branch created successfully with default manager user",
     "data": {
       "id": 1,
       "name": "New York Branch",
       "organization_id": 1,
       "manager_user_id": 6,
       ...
     }
   }
```

## Module Dependencies

```
app.module.ts
    │
    ├──┬─ OrganizationsModule
    │  │   └── imports: UsersModule
    │  │            TypeOrmModule.forFeature([Organization])
    │
    └──┬─ BranchsModule
       │   └── imports: UsersModule
       │            TypeOrmModule.forFeature([Branch])

UsersModule
    └── provides: UsersService (used by both Org & Branch modules)
```
