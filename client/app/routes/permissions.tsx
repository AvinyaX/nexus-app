import { useState, useEffect } from "react";
import type { Route } from "./+types/permissions";
import { Link } from "react-router";
import { apiRequest } from "../utils/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Permissions Management - Hardware Store" },
    { name: "description", content: "Manage system permissions and access control" },
  ];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResource, setFilterResource] = useState<string>("all");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setError(null);
      const response = await apiRequest("/api/acl/permissions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPermissions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      setError("Failed to load permissions. Please check your authentication.");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterResource === "all" || permission.resource === filterResource;
    
    return matchesSearch && matchesFilter;
  });

  const resources = Array.from(new Set(permissions.map(p => p.resource))).sort();

  const getResourceColor = (resource: string) => {
    const colors = {
      users: 'bg-blue-100 text-blue-800',
      roles: 'bg-green-100 text-green-800',
      permissions: 'bg-purple-100 text-purple-800',
      companies: 'bg-indigo-100 text-indigo-800',
      products: 'bg-yellow-100 text-yellow-800',
      customers: 'bg-pink-100 text-pink-800',
      inventory: 'bg-orange-100 text-orange-800',
      sales: 'bg-red-100 text-red-800',
      invoices: 'bg-teal-100 text-teal-800',
    };
    return colors[resource as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Permissions</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">IAM Management</h1>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <Link
            to="/users"
            className="flex-1 py-2 px-4 text-center font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            Users
          </Link>
          <Link
            to="/roles"
            className="flex-1 py-2 px-4 text-center font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            Roles
          </Link>
          <Link
            to="/permissions"
            className="flex-1 py-2 px-4 text-center font-medium rounded-md bg-white text-blue-600 shadow-sm border border-gray-200"
          >
            Permissions
          </Link>
        </nav>
      </div>

      {/* Permissions Management Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Permissions Management</h2>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search permissions by name, description, or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Resources</option>
              {resources.map(resource => (
                <option key={resource} value={resource}>
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPermissions.map((permission) => (
            <div key={permission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm">{permission.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResourceColor(permission.resource)}`}>
                  {permission.resource}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{permission.description}</p>
              
              <div className="text-xs text-gray-500">
                <span className="font-medium">Action:</span> {permission.action}
              </div>
              <div className="text-xs text-gray-400">
                Created: {new Date(permission.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {filteredPermissions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
            <p className="text-gray-500">
              {searchTerm || filterResource !== "all" 
                ? "No permissions match your search criteria." 
                : "No permissions available."}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        {permissions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{permissions.length}</div>
              <div className="text-sm text-gray-600">Total Permissions</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{filteredPermissions.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}