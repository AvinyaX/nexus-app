import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        name: "users:read",
        description: "Read user information",
        resource: "users",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "users:create",
        description: "Create new users",
        resource: "users",
        action: "create",
      },
    }),
    prisma.permission.create({
      data: {
        name: "users:update",
        description: "Update user information",
        resource: "users",
        action: "update",
      },
    }),
    prisma.permission.create({
      data: {
        name: "users:delete",
        description: "Delete users",
        resource: "users",
        action: "delete",
      },
    }),
    prisma.permission.create({
      data: {
        name: "roles:read",
        description: "Read role information",
        resource: "roles",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "roles:create",
        description: "Create new roles",
        resource: "roles",
        action: "create",
      },
    }),
    prisma.permission.create({
      data: {
        name: "roles:update",
        description: "Update role information",
        resource: "roles",
        action: "update",
      },
    }),
    prisma.permission.create({
      data: {
        name: "roles:delete",
        description: "Delete roles",
        resource: "roles",
        action: "delete",
      },
    }),
    prisma.permission.create({
      data: {
        name: "permissions:read",
        description: "Read permission information",
        resource: "permissions",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "permissions:assign",
        description: "Assign permissions to roles",
        resource: "permissions",
        action: "assign",
      },
    }),
  ]);

  console.log("✅ Permissions created:", permissions.length);

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      description: "Administrator with full access",
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "user",
      description: "Regular user with limited access",
    },
  });

  const moderatorRole = await prisma.role.create({
    data: {
      name: "moderator",
      description: "Moderator with user management access",
    },
  });

  console.log("✅ Roles created:", [
    adminRole.name,
    userRole.name,
    moderatorRole.name,
  ]);

  // Assign permissions to roles
  // Admin gets all permissions
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // User gets basic permissions
  const userPermissions = permissions.filter((p) =>
    ["users:read", "permissions:read"].includes(p.name),
  );
  await Promise.all(
    userPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // Moderator gets user management permissions
  const moderatorPermissions = permissions.filter((p) =>
    ["users:read", "users:update", "roles:read", "permissions:read"].includes(
      p.name,
    ),
  );
  await Promise.all(
    moderatorPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  console.log("✅ Role permissions assigned");

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      username: "admin",
      name: "Admin User",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: "user@example.com",
      username: "user",
      name: "Regular User",
    },
  });

  const moderatorUser = await prisma.user.create({
    data: {
      email: "moderator@example.com",
      username: "moderator",
      name: "Moderator User",
    },
  });

  console.log("✅ Users created:", [
    adminUser.username,
    regularUser.username,
    moderatorUser.username,
  ]);

  // Assign roles to users
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: moderatorUser.id,
      roleId: moderatorRole.id,
    },
  });

  // Assign some direct permissions to users (additional to their roles)
  const userReadPermission = permissions.find((p) => p.name === "users:read");
  if (userReadPermission) {
    await prisma.userPermission.create({
      data: {
        userId: regularUser.id,
        permissionId: userReadPermission.id,
      },
    });
  }

  console.log("✅ User roles and permissions assigned");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
