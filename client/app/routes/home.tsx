import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hardware Store Management" },
    { name: "description", content: "Comprehensive Hardware Store Management System" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hardware Store Management</h2>
          <p className="text-lg text-gray-600">
            A comprehensive system for managing your hardware store operations with multi-company support, 
            inventory tracking, sales management, and customer relationship tools.
          </p>
        </div>

        {/* Core Management Modules */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/companies"
              className="block p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-md hover:bg-blue-100 transition-colors"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-blue-900">
                🏢 Companies
              </h5>
              <p className="font-normal text-blue-700">
                Manage multiple companies, settings, and multi-tenant configurations.
              </p>
            </Link>

            <Link
              to="/products"
              className="block p-6 bg-green-50 rounded-lg border border-green-200 shadow-md hover:bg-green-100 transition-colors"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-green-900">
                📦 Products
              </h5>
              <p className="font-normal text-green-700">
                Manage product catalog, pricing, categories, and specifications.
              </p>
            </Link>

            <Link
              to="/inventory"
              className="block p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-md hover:bg-yellow-100 transition-colors"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-yellow-900">
                📊 Inventory
              </h5>
              <p className="font-normal text-yellow-700">
                Track stock levels, manage multiple locations, and monitor reorder points.
              </p>
            </Link>

            <Link
              to="/customers"
              className="block p-6 bg-purple-50 rounded-lg border border-purple-200 shadow-md hover:bg-purple-100 transition-colors"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-purple-900">
                👥 Customers
              </h5>
              <p className="font-normal text-purple-700">
                Manage customer information, history, and agent relationships.
              </p>
            </Link>

            <Link
              to="/users"
              className="block p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                🔐 Users & Permissions
              </h5>
              <p className="font-normal text-gray-700">
                Manage users, roles, and direct permissions assignment.
              </p>
            </Link>

            <Link
              to="/about"
              className="block p-6 bg-indigo-50 rounded-lg border border-indigo-200 shadow-md hover:bg-indigo-100 transition-colors"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-indigo-900">
                ℹ️ About
              </h5>
              <p className="font-normal text-indigo-700">
                Learn more about this hardware store management system.
              </p>
            </Link>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "💰", name: "Sales & Quotations", desc: "Create quotes and track sales" },
              { icon: "📋", name: "Invoicing", desc: "Generate and manage invoices" },
              { icon: "🤝", name: "Agent Management", desc: "Manage agent commissions" },
              { icon: "📱", name: "WhatsApp Integration", desc: "Automated customer communication" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg border border-gray-200 opacity-75"
              >
                <h5 className="mb-1 text-lg font-semibold text-gray-600">
                  {feature.icon} {feature.name}
                </h5>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
