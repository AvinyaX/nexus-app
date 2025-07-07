import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hardware Store Management" },
    { name: "description", content: "Comprehensive Hardware Store Management System" },
  ];
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <Navigation />
      <Welcome />
      
      <div className="container mx-auto px-4 py-8">
        {/* Authentication Status */}
        {isAuthenticated ? (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Authenticated</h3>
                <div className="mt-1 text-sm text-green-700">
                  Welcome back, <strong>{user?.name || user?.username}</strong>! 
                  You are logged in as <strong>{user?.role?.name || 'User'}</strong>.
                  You can now access all protected features below.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Not Authenticated</h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <Link to="/login" className="font-medium underline">Please login</Link> to access 
                  protected features like IAM Management, Companies, and Products.
                </div>
              </div>
            </div>
          </div>
        )}

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
              className={`block p-6 rounded-lg border shadow-md transition-colors ${
                isAuthenticated 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <h5 className={`mb-2 text-xl font-bold tracking-tight ${
                isAuthenticated ? 'text-blue-900' : 'text-gray-600'
              }`}>
                🏢 Companies {!isAuthenticated && '🔒'}
              </h5>
              <p className={`font-normal ${
                isAuthenticated ? 'text-blue-700' : 'text-gray-500'
              }`}>
                Manage multiple companies, settings, and multi-tenant configurations.
              </p>
              {!isAuthenticated && (
                <p className="text-xs text-red-600 mt-2">Requires authentication</p>
              )}
            </Link>

            <Link
              to="/products"
              className={`block p-6 rounded-lg border shadow-md transition-colors ${
                isAuthenticated 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <h5 className={`mb-2 text-xl font-bold tracking-tight ${
                isAuthenticated ? 'text-green-900' : 'text-gray-600'
              }`}>
                📦 Products {!isAuthenticated && '🔒'}
              </h5>
              <p className={`font-normal ${
                isAuthenticated ? 'text-green-700' : 'text-gray-500'
              }`}>
                Manage product catalog, pricing, categories, and specifications.
              </p>
              {!isAuthenticated && (
                <p className="text-xs text-red-600 mt-2">Requires authentication</p>
              )}
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
              className={`block p-6 rounded-lg border shadow-md transition-colors ${
                isAuthenticated 
                  ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <h5 className={`mb-2 text-xl font-bold tracking-tight ${
                isAuthenticated ? 'text-gray-900' : 'text-gray-600'
              }`}>
                🔐 IAM Management {!isAuthenticated && '🔒'}
              </h5>
              <p className={`font-normal ${
                isAuthenticated ? 'text-gray-700' : 'text-gray-500'
              }`}>
                Users, roles, and permissions management system (Users, Roles, Permissions tabs).
              </p>
              {!isAuthenticated && (
                <p className="text-xs text-red-600 mt-2">Requires authentication</p>
              )}
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
