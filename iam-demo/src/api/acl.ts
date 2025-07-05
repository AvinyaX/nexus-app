import api from "./axios";

// Roles
export const getRoles = async () => (await api.get("/acl/roles")).data;
export const createRole = async (data: {
  name: string;
  description?: string;
}) => (await api.post("/acl/role", data)).data;

// Permissions
export const getPermissions = async () =>
  (await api.get("/acl/permissions")).data;
export const createPermission = async (data: {
  action: string;
  resource: string;
  description?: string;
}) => (await api.post("/acl/permission", data)).data;

// Assignments
export const assignRole = async (data: { userId: string; roleId: string }) => {
  const response = await api.post("/acl/assign-role", data);
  return response.status === 204 ? null : response.data;
};
export const removeRole = async (data: { userId: string; roleId: string }) => {
  const response = await api.post("/acl/remove-role", data);
  return response.status === 204 ? null : response.data;
};
export const assignPermission = async (data: {
  roleId: string;
  permissionId: string;
}) => {
  const response = await api.post("/acl/assign-permission", data);
  return response.status === 204 ? null : response.data;
};
export const removePermission = async (data: {
  roleId: string;
  permissionId: string;
}) => {
  const response = await api.post("/acl/remove-permission", data);
  return response.status === 204 ? null : response.data;
};

// User Permission Management
export const getUserPermissions = async (userId: string) =>
  (await api.get(`/acl/user-permissions/${userId}`)).data;
export const assignUserPermission = async (data: {
  userId: string;
  permissionId: string;
}) => {
  const response = await api.post("/acl/assign-user-permission", data);
  return response.status === 204 ? null : response.data;
};
export const removeUserPermission = async (data: {
  userId: string;
  permissionId: string;
}) => {
  const response = await api.post("/acl/remove-user-permission", data);
  return response.status === 204 ? null : response.data;
};

// Lists
export const getUserRoles = async (userId: string) =>
  (await api.get(`/acl/user-roles/${userId}`)).data;
export const getRolePermissions = async (roleId: string) =>
  (await api.get(`/acl/role-permissions/${roleId}`)).data;
