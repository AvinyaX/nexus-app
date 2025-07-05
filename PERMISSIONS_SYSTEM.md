# Permission System Implementation

This document describes the implementation of a flexible permission system that allows both role-based and direct permission assignment to users.

## 🏗️ Architecture Overview

The permission system consists of four main entities:

1. **Users** - The main entity that can have roles and direct permissions
2. **Roles** - Collections of permissions that can be assigned to users
3. **Permissions** - Individual permissions with resource and action
4. **UserPermissions** - Direct permission assignments to users

## 📊 Database Schema

### Core Models

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Role relationship (existing)
  roleId    String?
  role      Role?    @relation(fields: [roleId], references: [id])

  // Direct permissions relationship (new)
  userPermissions UserPermission[]

  @@map("users")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Users with this role
  users User[]

  // Role permissions
  rolePermissions RolePermission[]

  @@map("roles")
}

model Permission {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  resource    String   // e.g., "users", "posts", "comments"
  action      String   // e.g., "create", "read", "update", "delete"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Role permissions
  rolePermissions RolePermission[]

  // User permissions (direct assignment)
  userPermissions UserPermission[]

  @@map("permissions")
}

model RolePermission {
  id           String     @id @default(cuid())
  roleId       String
  permissionId String
  createdAt    DateTime   @default(now())

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}

model UserPermission {
  id           String     @id @default(cuid())
  userId       String
  permissionId String
  createdAt    DateTime   @default(now())

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([userId, permissionId])
  @@map("user_permissions")
}
```

## 🔧 Backend Implementation

### API Endpoints

#### Permissions Management

- `GET /api/permissions` - Get all permissions
- `GET /api/permissions/:id` - Get specific permission
- `POST /api/permissions` - Create new permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

#### User Permission Management

- `GET /api/permissions/user/:userId` - Get user's direct permissions
- `GET /api/permissions/user/:userId/available` - Get available permissions for user
- `POST /api/permissions/user/assign` - Assign permissions to user
- `POST /api/permissions/user/remove` - Remove permissions from user

### Key Features

1. **Flexible Permission Assignment**: Users can have both role-based and direct permissions
2. **Permission Inheritance**: Users inherit permissions from their roles
3. **Direct Override**: Direct permissions can override or supplement role permissions
4. **Bulk Operations**: Assign/remove multiple permissions at once
5. **Conflict Prevention**: Unique constraints prevent duplicate assignments

## 🎨 Frontend Implementation

### Users Management Page

The frontend provides a comprehensive user management interface:

1. **User Table**: Displays all users with their roles and direct permissions
2. **Permission Modal**: Allows assigning/removing permissions for specific users
3. **Real-time Updates**: Changes are reflected immediately in the UI

### Key Components

- **User List**: Shows users with role and permission information
- **Permission Modal**: Checkbox-based permission management
- **Permission Tags**: Visual indicators for assigned permissions

## 🚀 Setup Instructions

### 1. Database Setup

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Seed the database with sample data
pnpm db:seed
```

### 2. Backend Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start:dev
```

### 3. Frontend Setup

```bash
cd ../client
pnpm install
pnpm dev
```

## 📋 Sample Data

The seed script creates:

### Permissions

- `users:read` - Read user information
- `users:create` - Create new users
- `users:update` - Update user information
- `users:delete` - Delete users
- `permissions:manage` - Manage user permissions
- `roles:manage` - Manage roles

### Roles

- **Admin**: Has all permissions
- **User**: Has basic read permissions

### Users

- **admin@example.com**: Admin role with all permissions
- **user@example.com**: User role with direct permission management access

## 🔍 Usage Examples

### Assigning Permissions to a User

```typescript
// Backend API call
const response = await fetch("/api/permissions/user/assign", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: "user-id",
    permissionIds: ["permission-1", "permission-2"],
  }),
});
```

### Getting User Permissions

```typescript
// Get user with permissions
const user = await prisma.user.findUnique({
  where: { id: "user-id" },
  include: {
    role: {
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    },
    userPermissions: {
      include: {
        permission: true,
      },
    },
  },
});
```

## 🛡️ Security Considerations

1. **Permission Validation**: Always validate permissions on the backend
2. **Role-based Access Control**: Use roles for common permission sets
3. **Direct Permission Override**: Allow fine-grained control when needed
4. **Audit Trail**: Track permission changes for compliance

## 🔄 Migration Strategy

1. **Phase 1**: Add new tables (roles, permissions, etc.)
2. **Phase 2**: Migrate existing role data
3. **Phase 3**: Enable direct permission assignment
4. **Phase 4**: Update frontend to support new features

## 📈 Future Enhancements

1. **Permission Groups**: Group related permissions
2. **Temporary Permissions**: Time-limited permission assignments
3. **Permission Inheritance**: Hierarchical permission structures
4. **Audit Logging**: Track all permission changes
5. **Bulk Operations**: Manage permissions for multiple users

## 🐛 Troubleshooting

### Common Issues

1. **Prisma Client Errors**: Run `pnpm db:generate` after schema changes
2. **Migration Failures**: Check database connection and credentials
3. **Permission Conflicts**: Ensure unique constraints are respected
4. **Frontend API Errors**: Verify backend server is running

### Debug Commands

```bash
# Reset database
pnpm db:reset

# View database in Prisma Studio
pnpm db:studio

# Check migration status
npx prisma migrate status
```

---

This permission system provides a flexible and scalable solution for managing user access control in your application.
