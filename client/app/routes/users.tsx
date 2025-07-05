import { useState, useEffect } from "react";
import { Link } from "react-router";

interface Permission {
  id: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
}

interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  createdAt: Date;
  permission: Permission;
}

interface Role {
  id: string;
  name: string;
  description?: string | null;
}

interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: Role | null;
  userPermissions: UserPermission[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/permissions");
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const openPermissionModal = (user: User) => {
    setSelectedUser(user);
    setSelectedPermissions(user.userPermissions.map((up) => up.permissionId));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedPermissions([]);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const savePermissions = async () => {
    if (!selectedUser) return;

    try {
      // Remove permissions that are no longer selected
      const permissionsToRemove = selectedUser.userPermissions
        .filter((up) => !selectedPermissions.includes(up.permissionId))
        .map((up) => up.permissionId);

      if (permissionsToRemove.length > 0) {
        await fetch("/api/permissions/user/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedUser.id,
            permissionIds: permissionsToRemove,
          }),
        });
      }

      // Add new permissions
      const permissionsToAdd = selectedPermissions.filter(
        (permissionId) =>
          !selectedUser.userPermissions.some(
            (up) => up.permissionId === permissionId,
          ),
      );

      if (permissionsToAdd.length > 0) {
        await fetch("/api/permissions/user/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedUser.id,
            permissionIds: permissionsToAdd,
          }),
        });
      }

      // Refresh users data
      await fetchUsers();
      closeModal();
    } catch (error) {
      console.error("Error saving permissions:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Direct Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || "No name"}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role?.name || "No role"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.userPermissions.map((userPermission) => (
                      <span
                        key={userPermission.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {userPermission.permission.name}
                      </span>
                    ))}
                    {user.userPermissions.length === 0 && (
                      <span className="text-sm text-gray-500">
                        No direct permissions
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openPermissionModal(user)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Manage Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Manage Permissions for {selectedUser.name || selectedUser.email}
              </h3>

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

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={savePermissions}
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
  );
}
