import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser } from "../../api/users";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Checkbox,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import {
  getRoles,
  assignRole,
  removeRole,
  getPermissions,
  getUserPermissions,
  assignUserPermission,
  removeUserPermission,
} from "../../api/acl";
import SearchIcon from "@mui/icons-material/Search";

interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdAt: Date;
  role: Role;
}

interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  createdAt: Date;
  permission: Permission;
}

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  userRoles: UserRole[];
  userPermissions: UserPermission[];
  role?: Role | null;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", username: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignInitial, setAssignInitial] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userPermissionsInitial, setUserPermissionsInitial] = useState<
    string[]
  >([]);
  const [search, setSearch] = useState("");
  const [searchPermissions, setSearchPermissions] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const fetchUsers = async () => {
    setUsers(await getUsers());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ email: "", username: "", name: "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({
        email: form.email,
        username: form.username,
        name: form.name || undefined,
      });
      handleClose();
      fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOpen = async (user: User) => {
    setAssignOpen(true);
    setSelectedUser(user);
    setAssignLoading(true);
    setActiveTab(0);
    try {
      const [roles, permissions, userPerms] = await Promise.all([
        getRoles(),
        getPermissions(),
        getUserPermissions(user.id),
      ]);
      setAllRoles(roles);
      setAllPermissions(permissions);

      // Extract role IDs from userRoles array
      const assignedRoleIds = user.userRoles.map((ur) => ur.roleId);
      setUserRoles(assignedRoleIds);
      setAssignInitial(assignedRoleIds);

      const userPermissionIds = userPerms.map((p: Permission) => p.id);
      setUserPermissions(userPermissionIds);
      setUserPermissionsInitial(userPermissionIds);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
    setSelectedUser(null);
    setAllRoles([]);
    setUserRoles([]);
    setAssignInitial([]);
    setAllPermissions([]);
    setUserPermissions([]);
    setUserPermissionsInitial([]);
    setSearch("");
    setSearchPermissions("");
    setActiveTab(0);
  };

  const handleRoleToggle = (id: string) => {
    setUserRoles((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const handlePermissionToggle = (id: string) => {
    setUserPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setAssignLoading(true);
    try {
      // Handle role assignments
      const rolesToAdd = userRoles.filter((id) => !assignInitial.includes(id));
      const rolesToRemove = assignInitial.filter(
        (id) => !userRoles.includes(id),
      );

      // Handle permission assignments
      const permissionsToAdd = userPermissions.filter(
        (id) => !userPermissionsInitial.includes(id),
      );
      const permissionsToRemove = userPermissionsInitial.filter(
        (id) => !userPermissions.includes(id),
      );

      await Promise.all([
        ...rolesToAdd.map((rid) =>
          assignRole({ userId: selectedUser.id, roleId: rid }),
        ),
        ...rolesToRemove.map((rid) =>
          removeRole({ userId: selectedUser.id, roleId: rid }),
        ),
        ...permissionsToAdd.map((pid) =>
          assignUserPermission({ userId: selectedUser.id, permissionId: pid }),
        ),
        ...permissionsToRemove.map((pid) =>
          removeUserPermission({ userId: selectedUser.id, permissionId: pid }),
        ),
      ]);
      handleAssignClose();
      fetchUsers();
    } finally {
      setAssignLoading(false);
    }
  };

  const filteredRoles = allRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      (role.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPermissions = allPermissions.filter(
    (perm) =>
      perm.action.toLowerCase().includes(searchPermissions.toLowerCase()) ||
      perm.resource.toLowerCase().includes(searchPermissions.toLowerCase()) ||
      (perm.description || "")
        .toLowerCase()
        .includes(searchPermissions.toLowerCase()),
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add User
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Username"
              name="username"
              fullWidth
              required
              value={form.username}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={assignOpen}
        onClose={handleAssignClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Manage User: {selectedUser?.name || selectedUser?.email}
        </DialogTitle>
        <form onSubmit={handleAssignSubmit}>
          <DialogContent>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Roles" />
              <Tab label="Direct Permissions" />
            </Tabs>

            {activeTab === 0 && (
              <Stack spacing={2}>
                {/* Roles Tab */}
                <div>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Assigned Roles
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {userRoles.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No roles assigned
                      </Typography>
                    )}
                    {allRoles
                      .filter((role) => userRoles.includes(role.id))
                      .map((role) => (
                        <Chip
                          key={role.id}
                          label={role.name}
                          color="primary"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                  </Stack>
                </div>
                <Divider sx={{ my: 1 }} />
                <TextField
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                <div>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    All Roles
                  </Typography>
                  {assignLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : filteredRoles.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No roles found
                    </Typography>
                  ) : (
                    <Stack spacing={0.5}>
                      {filteredRoles.map((role) => (
                        <Box
                          key={role.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            bgcolor: userRoles.includes(role.id)
                              ? assignInitial.includes(role.id)
                                ? "primary.50"
                                : "grey.100"
                              : "background.paper",
                            transition: "background 0.2s",
                          }}
                        >
                          <Checkbox
                            checked={userRoles.includes(role.id)}
                            onChange={() => handleRoleToggle(role.id)}
                            color={
                              assignInitial.includes(role.id)
                                ? "primary"
                                : "default"
                            }
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={
                                assignInitial.includes(role.id) ? 600 : 400
                              }
                            >
                              {role.name}
                            </Typography>
                            {role.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {role.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </div>
              </Stack>
            )}

            {activeTab === 1 && (
              <Stack spacing={2}>
                {/* Permissions Tab */}
                <div>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Assigned Direct Permissions
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {userPermissions.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No direct permissions assigned
                      </Typography>
                    )}
                    {allPermissions
                      .filter((perm) => userPermissions.includes(perm.id))
                      .map((perm) => (
                        <Chip
                          key={perm.id}
                          label={`${perm.action} - ${perm.resource}`}
                          color="secondary"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                  </Stack>
                </div>
                <Divider sx={{ my: 1 }} />
                <TextField
                  placeholder="Search permissions..."
                  value={searchPermissions}
                  onChange={(e) => setSearchPermissions(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                <div>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    All Permissions
                  </Typography>
                  {assignLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : filteredPermissions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No permissions found
                    </Typography>
                  ) : (
                    <Stack spacing={0.5}>
                      {filteredPermissions.map((perm) => (
                        <Box
                          key={perm.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            bgcolor: userPermissions.includes(perm.id)
                              ? userPermissionsInitial.includes(perm.id)
                                ? "secondary.50"
                                : "grey.100"
                              : "background.paper",
                            transition: "background 0.2s",
                          }}
                        >
                          <Checkbox
                            checked={userPermissions.includes(perm.id)}
                            onChange={() => handlePermissionToggle(perm.id)}
                            color={
                              userPermissionsInitial.includes(perm.id)
                                ? "secondary"
                                : "default"
                            }
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={
                                userPermissionsInitial.includes(perm.id)
                                  ? 600
                                  : 400
                              }
                            >
                              {perm.action} - {perm.resource}
                            </Typography>
                            {perm.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {perm.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </div>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAssignClose} disabled={assignLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={assignLoading}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "No name"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {user.userRoles.map((userRole) => (
                      <Chip
                        key={userRole.id}
                        label={userRole.role.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {user.userRoles.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No roles
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleAssignOpen(user)}
                    >
                      Manage
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
