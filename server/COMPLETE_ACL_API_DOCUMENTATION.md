# Complete ACL API Documentation

This document describes all the ACL-related API endpoints available in the Nexus application, including both the main API structure and compatibility endpoints for the IAM demo frontend.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the APIs are open (no authentication required). In production, you should implement proper authentication middleware.

## API Endpoints

### Main ACL Structure

#### **Roles API (`/acl/roles`)**

- `GET /acl/roles` - Get all roles
- `GET /acl/roles/:id` - Get specific role
- `POST /acl/roles` - Create new role
- `PUT /acl/roles/:id` - Update role
- `DELETE /acl/roles/:id` - Delete role

#### **Role-Permission Management**

- `GET /acl/roles/role-permissions` - Get all roles with their permissions loaded
- `GET /acl/roles/:roleId/permissions` - Get permissions for a specific role
- `POST /acl/roles/permissions/assign` - Assign multiple permissions to a role
- `POST /acl/roles/permissions/remove` - Remove multiple permissions from a role

#### **User-Role Management**

- `GET /acl/roles/user/:userId` - Get roles for a specific user
- `POST /acl/roles/user/assign` - Assign role to user
- `POST /acl/roles/user/remove` - Remove role from user

#### **Permissions API (`/acl/permissions`)**

- `GET /acl/permissions` - Get all permissions
- `GET /acl/permissions/:id` - Get specific permission
- `POST /acl/permissions` - Create new permission
- `PUT /acl/permissions/:id` - Update permission
- `DELETE /acl/permissions/:id` - Delete permission

#### **User-Permission Management**

- `GET /acl/permissions/user/:userId` - Get direct permissions for a user
- `POST /acl/permissions/user/assign` - Assign multiple permissions to user
- `POST /acl/permissions/user/remove` - Remove multiple permissions from user

### IAM Demo Compatibility Endpoints

#### **Single Assignment Endpoints**

- `POST /acl/assign-role` - Assign a single role to a user
- `POST /acl/remove-role` - Remove a single role from a user
- `POST /acl/assign-permission` - Assign a single permission to a role
- `POST /acl/remove-permission` - Remove a single permission from a role

#### **IAM Demo Specific Endpoints**

- `GET /acl/user-roles/:userId` - Get roles for a user (IAM demo format)
- `GET /acl/role-permissions/:roleId` - Get permissions for a role (IAM demo format)
- `POST /acl/permission` - Create a new permission (IAM demo format)

### Users API (`/users`)

- `GET /users` - Get all users with roles and permissions
- `GET /users/:id` - Get specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Request/Response Examples

### Create Role

```http
POST /acl/roles
Content-Type: application/json

{
  "name": "editor",
  "description": "Content editor role"
}
```

### Assign Role to User

```http
POST /acl/assign-role
Content-Type: application/json

{
  "userId": "user_id",
  "roleId": "role_id"
}
```

### Assign Permission to Role

```http
POST /acl/assign-permission
Content-Type: application/json

{
  "roleId": "role_id",
  "permissionId": "permission_id"
}
```

### Get Role Permissions

```http
GET /acl/role-permissions/role_id
```

**Response:**

```json
[
  {
    "id": "permission_id",
    "name": "users:read",
    "description": "Read user information",
    "resource": "users",
    "action": "read",
    "createdAt": "2025-07-05T09:21:45.942Z",
    "updatedAt": "2025-07-05T09:21:45.942Z"
  }
]
```

### Get All Roles with Permissions

```http
GET /acl/roles/role-permissions
```

**Response:**

```json
[
  {
    "id": "role_id",
    "name": "admin",
    "description": "Administrator with full access",
    "createdAt": "2025-07-05T09:21:45.980Z",
    "updatedAt": "2025-07-05T09:21:45.980Z",
    "rolePermissions": [
      {
        "id": "role_permission_id",
        "roleId": "role_id",
        "permissionId": "permission_id",
        "createdAt": "2025-07-05T09:21:45.983Z",
        "permission": {
          "id": "permission_id",
          "name": "users:read",
          "description": "Read user information",
          "resource": "users",
          "action": "read",
          "createdAt": "2025-07-05T09:21:45.942Z",
          "updatedAt": "2025-07-05T09:21:45.942Z"
        }
      }
    ]
  }
]
```

## Frontend Compatibility

### IAM Demo Frontend

The IAM demo frontend expects these specific endpoints:

- `POST /acl/role` → `POST /acl/permission` (implemented)
- `POST /acl/assign-role` → `POST /acl/assign-role` (implemented)
- `POST /acl/remove-role` → `POST /acl/remove-role` (implemented)
- `POST /acl/assign-permission` → `POST /acl/assign-permission` (implemented)
- `POST /acl/remove-permission` → `POST /acl/remove-permission` (implemented)
- `GET /acl/user-roles/:userId` → `GET /acl/user-roles/:userId` (implemented)
- `GET /acl/role-permissions/:roleId` → `GET /acl/role-permissions/:roleId` (implemented)

### Main Client Frontend

The main client frontend expects these endpoints:

- `GET /api/users` → `GET /users` (implemented)
- `GET /api/permissions` → `GET /acl/permissions` (implemented)
- `POST /api/permissions/user/assign` → `POST /acl/permissions/user/assign` (implemented)
- `POST /api/permissions/user/remove` → `POST /acl/permissions/user/remove` (implemented)

## Database Schema

The ACL system uses the following database tables:

- **users**: User accounts with username field
- **roles**: Role definitions
- **permissions**: Permission definitions with resource and action
- **user_roles**: Many-to-many relationship between users and roles
- **role_permissions**: Many-to-many relationship between roles and permissions
- **user_permissions**: Many-to-many relationship between users and direct permissions

## Sample Data

The system comes pre-seeded with:

### Users

- **Admin User**: `admin@example.com` (username: `admin`)
- **Regular User**: `user@example.com` (username: `user`)
- **Moderator User**: `moderator@example.com` (username: `moderator`)

### Roles

- **admin**: Administrator with full access
- **user**: Regular user with limited access
- **moderator**: Moderator with user management access

### Permissions

- **users:read**: Read user information
- **users:create**: Create new users
- **users:update**: Update user information
- **users:delete**: Delete users
- **roles:read**: Read role information
- **roles:create**: Create new roles
- **roles:update**: Update role information
- **roles:delete**: Delete roles
- **permissions:read**: Read permission information
- **permissions:assign**: Assign permissions to roles

## Testing Examples

```bash
# Get all roles with permissions
curl http://localhost:3000/acl/roles/role-permissions

# Get permissions for a specific role
curl http://localhost:3000/acl/role-permissions/ROLE_ID

# Get roles for a specific user
curl http://localhost:3000/acl/user-roles/USER_ID

# Assign a role to a user
curl -X POST http://localhost:3000/acl/assign-role \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_id", "roleId": "role_id"}'

# Assign a permission to a role
curl -X POST http://localhost:3000/acl/assign-permission \
  -H "Content-Type: application/json" \
  -d '{"roleId": "role_id", "permissionId": "permission_id"}'
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

This comprehensive ACL system provides both the main API structure and compatibility endpoints for different frontend implementations.
