import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create permissions (keeping existing IAM permissions)
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
    // Hardware store permissions
    prisma.permission.create({
      data: {
        name: "companies:manage",
        description: "Manage companies",
        resource: "companies",
        action: "manage",
      },
    }),
    prisma.permission.create({
      data: {
        name: "products:read",
        description: "Read products",
        resource: "products",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "products:create",
        description: "Create products",
        resource: "products",
        action: "create",
      },
    }),
    prisma.permission.create({
      data: {
        name: "products:update",
        description: "Update products",
        resource: "products",
        action: "update",
      },
    }),
    prisma.permission.create({
      data: {
        name: "products:delete",
        description: "Delete products",
        resource: "products",
        action: "delete",
      },
    }),
    prisma.permission.create({
      data: {
        name: "customers:read",
        description: "Read customers",
        resource: "customers",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "customers:create",
        description: "Create customers",
        resource: "customers",
        action: "create",
      },
    }),
    prisma.permission.create({
      data: {
        name: "customers:update",
        description: "Update customers",
        resource: "customers",
        action: "update",
      },
    }),
    prisma.permission.create({
      data: {
        name: "customers:delete",
        description: "Delete customers",
        resource: "customers",
        action: "delete",
      },
    }),
    prisma.permission.create({
      data: {
        name: "inventory:read",
        description: "Read inventory",
        resource: "inventory",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "inventory:update",
        description: "Update inventory",
        resource: "inventory",
        action: "update",
      },
    }),
    prisma.permission.create({
      data: {
        name: "sales:read",
        description: "Read sales data",
        resource: "sales",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "sales:create",
        description: "Create sales/quotations",
        resource: "sales",
        action: "create",
      },
    }),
    prisma.permission.create({
      data: {
        name: "invoices:read",
        description: "Read invoices",
        resource: "invoices",
        action: "read",
      },
    }),
    prisma.permission.create({
      data: {
        name: "invoices:create",
        description: "Create invoices",
        resource: "invoices",
        action: "create",
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

  // Hardware store specific roles
  const salesRole = await prisma.role.create({
    data: {
      name: "sales",
      description: "Sales team member",
    },
  });

  const inventoryRole = await prisma.role.create({
    data: {
      name: "inventory_manager",
      description: "Inventory management role",
    },
  });

  console.log("✅ Roles created:", [
    adminRole.name,
    userRole.name,
    moderatorRole.name,
    salesRole.name,
    inventoryRole.name,
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

  // Sales role permissions
  const salesPermissions = permissions.filter((p) =>
    ["users:read", "customers:read", "customers:create", "customers:update", 
     "products:read", "sales:read", "sales:create", "invoices:read", "invoices:create"].includes(p.name),
  );
  await Promise.all(
    salesPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: salesRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // Inventory role permissions
  const inventoryPermissions = permissions.filter((p) =>
    ["products:read", "products:create", "products:update", "inventory:read", "inventory:update"].includes(p.name),
  );
  await Promise.all(
    inventoryPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: inventoryRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  console.log("✅ Role permissions assigned");

  // Create sample companies
  const company1 = await prisma.company.create({
    data: {
      name: "ABC Hardware Store",
      code: "ABC",
      settings: {
        currency: "INR",
        taxRate: 18,
        invoicePrefix: "ABC-INV",
        quotationPrefix: "ABC-QUO",
      },
      subscriptionPlan: "premium",
      isActive: true,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "XYZ Building Materials",
      code: "XYZ",
      settings: {
        currency: "INR",
        taxRate: 18,
        invoicePrefix: "XYZ-INV",
        quotationPrefix: "XYZ-QUO",
      },
      subscriptionPlan: "basic",
      isActive: true,
    },
  });

  console.log("✅ Companies created:", [company1.name, company2.name]);

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      username: "admin",
      name: "System Admin",
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: "sales@abc.com",
      username: "sales_abc",
      name: "Sales Manager ABC",
    },
  });

  const inventoryUser = await prisma.user.create({
    data: {
      email: "inventory@abc.com",
      username: "inventory_abc",
      name: "Inventory Manager ABC",
    },
  });

  console.log("✅ Users created:", [
    adminUser.username,
    salesUser.username,
    inventoryUser.username,
  ]);

  // Assign roles to users
  await Promise.all([
    prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: salesUser.id,
        roleId: salesRole.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: inventoryUser.id,
        roleId: inventoryRole.id,
      },
    }),
  ]);

  // Assign users to companies
  await Promise.all([
    // Admin has access to both companies
    prisma.userCompany.create({
      data: {
        userId: adminUser.id,
        companyId: company1.id,
        role: "admin",
        isDefault: true,
      },
    }),
    prisma.userCompany.create({
      data: {
        userId: adminUser.id,
        companyId: company2.id,
        role: "admin",
        isDefault: false,
      },
    }),
    // Sales user only for ABC company
    prisma.userCompany.create({
      data: {
        userId: salesUser.id,
        companyId: company1.id,
        role: "sales",
        isDefault: true,
      },
    }),
    // Inventory user only for ABC company
    prisma.userCompany.create({
      data: {
        userId: inventoryUser.id,
        companyId: company1.id,
        role: "inventory_manager",
        isDefault: true,
      },
    }),
  ]);

  // Create sample categories and products for company1
  const electronicsCategory = await prisma.category.create({
    data: {
      companyId: company1.id,
      name: "Electronics",
      description: "Electronic hardware items",
    },
  });

  const toolsCategory = await prisma.category.create({
    data: {
      companyId: company1.id,
      name: "Tools",
      description: "Hand and power tools",
    },
  });

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      companyId: company1.id,
      categoryId: electronicsCategory.id,
      name: "LED Bulb 9W",
      description: "Energy efficient LED bulb",
      sku: "LED-9W-001",
      hsnCode: "85395000",
      price: 150.00,
      costPrice: 100.00,
      unit: "piece",
      isActive: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      companyId: company1.id,
      categoryId: toolsCategory.id,
      name: "Hammer 500g",
      description: "Steel hammer with wooden handle",
      sku: "HAM-500G-001",
      hsnCode: "82051100",
      price: 250.00,
      costPrice: 180.00,
      unit: "piece",
      isActive: true,
    },
  });

  // Create inventory for products
  await Promise.all([
    prisma.inventoryItem.create({
      data: {
        companyId: company1.id,
        productId: product1.id,
        location: "main",
        quantity: 100,
        reservedQty: 0,
        reorderLevel: 20,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        companyId: company1.id,
        productId: product2.id,
        location: "main",
        quantity: 50,
        reservedQty: 0,
        reorderLevel: 10,
      },
    }),
  ]);

  console.log("✅ Sample data created for company1");
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
