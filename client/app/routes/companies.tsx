import { useState, useEffect } from "react";
import type { Route } from "./+types/companies";
import { apiRequest } from "../utils/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Companies Management - Hardware Store" },
    { name: "description", content: "Manage multiple companies and their settings" },
  ];
}

interface Company {
  id: string;
  name: string;
  code: string;
  settings: any;
  subscriptionPlan: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCompanies: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: string;
    isDefault: boolean;
  }>;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    code: "",
    subscriptionPlan: "basic",
    isActive: true,
    settings: {},
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/companies");
      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication required. Please login to access companies.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompany),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdCompany = await response.json();
      setCompanies([...companies, createdCompany]);
      setShowCreateForm(false);
      setNewCompany({
        name: "",
        code: "",
        subscriptionPlan: "basic",
        isActive: true,
        settings: {},
      });
    } catch (err: any) {
      setError(err.message || "Failed to create company");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-600 mt-2">
            Manage multiple companies with independent settings and user access
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Company
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Create Company Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Company</h3>
              <form onSubmit={createCompany}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.code}
                    onChange={(e) => setNewCompany({ ...newCompany, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company code (e.g., ABC)"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Plan
                  </label>
                  <select
                    value={newCompany.subscriptionPlan}
                    onChange={(e) => setNewCompany({ ...newCompany, subscriptionPlan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Create Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-600 font-mono">{company.code}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                company.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {company.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Plan:</span> {company.subscriptionPlan}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Users:</span> {company.userCompanies.length}
              </p>
            </div>

            {company.userCompanies.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Users:</h4>
                <div className="space-y-1">
                  {company.userCompanies.slice(0, 3).map((userCompany, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{userCompany.user.name}</span>
                      <span className="text-gray-500">{userCompany.role}</span>
                    </div>
                  ))}
                  {company.userCompanies.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{company.userCompanies.length - 3} more users
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Created: {new Date(company.createdAt).toLocaleDateString()}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first company.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Company
          </button>
        </div>
      )}
    </div>
  );
}