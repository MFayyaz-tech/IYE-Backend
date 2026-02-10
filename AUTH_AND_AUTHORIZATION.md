# Authentication & Authorization Implementation

## Guards Created

### 1. **JwtAuthGuard** (`src/auth/guards/jwt-auth.guard.ts`)
- Validates JWT token from Authorization header
- Extracts user from database
- Attaches user to request object
- Applied to all protected routes

### 2. **SuperAdminGuard** (`src/auth/guards/super-admin.guard.ts`)
- Checks if user role is `SUPER_ADMIN`
- Throws `ForbiddenException` if not authorized

### 3. **OrganizationAdminGuard** (`src/auth/guards/organization-admin.guard.ts`)
- `SUPER_ADMIN` can access all organizations
- `ORGANIZATION_ADMIN` can only access their own organization (by `organizationId` param)
- Throws `ForbiddenException` otherwise

### 4. **ShopAdminGuard** (`src/auth/guards/shop-admin.guard.ts`)
- `SUPER_ADMIN` can access all shops
- `ORGANIZATION_ADMIN` can access shops in their organization
- `SHOP_ADMIN` can only access their own shop (by `shopId` param)
- Throws `ForbiddenException` otherwise

---

## API Endpoints & Permissions

### Organizations

| Endpoint | Method | Guards | Permission | Role |
|----------|--------|--------|-----------|------|
| `/organizations` | GET | JwtAuthGuard, SuperAdminGuard | List all organizations | SUPER_ADMIN |
| `/organizations/:organizationId` | GET | JwtAuthGuard, OrganizationAdminGuard | Get organization details | SUPER_ADMIN, ORGANIZATION_ADMIN (own) |
| `/organizations` | POST | JwtAuthGuard, SuperAdminGuard | Create organization | SUPER_ADMIN |
| `/organizations/:organizationId` | PUT | JwtAuthGuard, OrganizationAdminGuard | Update organization | SUPER_ADMIN, ORGANIZATION_ADMIN (own) |
| `/organizations/:organizationId` | DELETE | JwtAuthGuard, OrganizationAdminGuard | Delete organization | SUPER_ADMIN, ORGANIZATION_ADMIN (own) |

### Shops

| Endpoint | Method | Guards | Permission | Role |
|----------|--------|--------|-----------|------|
| `/shops` | GET | JwtAuthGuard, SuperAdminGuard | List all shops | SUPER_ADMIN |
| `/shops/:shopId` | GET | JwtAuthGuard | Get shop details | SUPER_ADMIN, ORGANIZATION_ADMIN, SHOP_ADMIN (own) |
| `/shops/organization/:organizationId` | GET | JwtAuthGuard, OrganizationAdminGuard | List shops in org | SUPER_ADMIN, ORGANIZATION_ADMIN (own) |
| `/shops` | POST | JwtAuthGuard | Create shop | SUPER_ADMIN, ORGANIZATION_ADMIN (their org) |
| `/shops/:shopId` | PUT | JwtAuthGuard | Update shop | SUPER_ADMIN, ORGANIZATION_ADMIN (their org), SHOP_ADMIN (own) |
| `/shops/:shopId` | DELETE | JwtAuthGuard | Delete shop | SUPER_ADMIN, ORGANIZATION_ADMIN (their org), SHOP_ADMIN (own) |

---

## Usage Example

### 1. Login to get JWT Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Use Token in Subsequent Requests
```bash
curl -X GET http://localhost:3000/organizations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 3. Create Shop (ORGANIZATION_ADMIN)
```bash
curl -X POST http://localhost:3000/shops \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Coffee Shop",
    "organization_id": 1,
    "email": "shop@example.com",
    "phone": "+1-234-567-8900",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA"
  }'
```

### 4. Delete Shop (ORGANIZATION_ADMIN or SHOP_ADMIN)
```bash
curl -X DELETE http://localhost:3000/shops/1 \
  -H "Authorization: Bearer <token>"
```

---

## Error Responses

### Missing Token
```json
{
  "statusCode": 401,
  "message": "Missing authorization header"
}
```

### Invalid Token
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### Insufficient Permissions
```json
{
  "statusCode": 403,
  "message": "Only Super Admin can perform this action"
}
```

```json
{
  "statusCode": 403,
  "message": "You can only manage your own organization"
}
```

```json
{
  "statusCode": 403,
  "message": "You cannot delete this shop"
}
```

---

## Notes

- All protected endpoints require `Authorization: Bearer <jwt_token>` header
- Token is validated using the configured JWT secret
- User information is fetched from database on each request
- Role-based access is enforced at controller level
- Parameter names in routes MUST match guard expectations (e.g., `:organizationId`, `:shopId`)
