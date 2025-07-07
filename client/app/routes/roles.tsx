import { useState, useEffect } from "react";
import type { Route } from "./+types/roles";
import { Link } from "react-router";
import { apiRequest } from "../utils/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roles Management - Hardware Store" },
    { name: "description", content: "Manage user roles and role permissions" },
  ];
}

interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: Array<{
    id: string;
    permission: {
      id: string;
      name: string;
      description: string;
      resource: string;
      action: string;
    };
  }>;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      setError(null);
      const response = await fetch("/api/roles");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      setError("Failed to load roles. This might be because authentication is required.");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/acl/permissions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPermissions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      setPermissions([]);
    }
  };

  const openPermissionModal = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(
      role.rolePermissions?.map((rp) => rp.permission.id) || []
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Roles Management</h1>
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
              <h3 className="text-sm font-medium text-red-800">Error Loading Roles</h3>
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
            className="flex-1 py-2 px-4 text-center font-medium rounded-md bg-white text-blue-600 shadow-sm border border-gray-200"
          >
            Roles
          </Link>
          <Link
            to="/permissions"
            className="flex-1 py-2 px-4 text-center font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            Permissions
          </Link>
        </nav>
      </div>

      {/* Roles Management Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Roles Management</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {role.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {new Date(role.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{role.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {role.rolePermissions && role.rolePermissions.length > 0 ? (
                          role.rolePermissions.slice(0, 3).map((rolePermission) => (
                            <span
                              key={rolePermission.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {rolePermission.permission.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No permissions</span>
                        )}
                        {role.rolePermissions && role.rolePermissions.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{role.rolePermissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openPermissionModal(role)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Manage Permissions
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Permission Assignment Modal */}
        {isModalOpen && selectedRole && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 text-center">
                  Manage Permissions for "{selectedRole.name}"
                </h3>
                <div className="mt-4">
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-900">
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-gray-500">
                              {permission.resource}:{permission.action}
                            </div>
                            {permission.description && (
                              <div className="text-gray-400 text-xs">
                                {permission.description}
                              </div>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement role permission save
                      console.log("Save role permissions:", selectedPermissions);
                      closeModal();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}