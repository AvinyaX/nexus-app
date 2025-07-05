import React, { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  getPermissions,
  getRolePermissions,
  assignPermission,
  removePermission,
} from "../../api/acl";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Checkbox,
  CircularProgress,
  Chip,
  Stack,
  InputAdornment,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
}

export default function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Assign Permissions Dialog State
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]); // permission ids
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignInitial, setAssignInitial] = useState<string[]>([]); // for diffing
  const [search, setSearch] = useState("");
  const [editPermission, setEditPermission] = useState<Permission | null>(null);

  // In Assign Permissions modal, show assigned permissions as chips with delete icon and confirmation dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    permission: Permission | null;
  }>({ open: false, permission: null });

  const fetchRoles = async () => {
    setRoles(await getRoles());
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", description: "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRole({
        name: form.name,
        description: form.description || undefined,
      });
      handleClose();
      fetchRoles();
    } finally {
      setLoading(false);
    }
  };

  // Assign Permissions logic
  const extractPermissionId = (p: unknown): string | undefined => {
    if (typeof p === "object" && p !== null) {
      if ("id" in p && typeof (p as any).id === "string") return (p as any).id;
      if ("permission" in p && typeof (p as any).permission?.id === "string")
        return (p as any).permission.id;
    }
    return undefined;
  };
  const handleAssignOpen = async (role: Role) => {
    setAssignOpen(true);
    setSelectedRole(role);
    setAssignLoading(true);
    try {
      const [perms, assigned] = await Promise.all([
        getPermissions(),
        getRolePermissions(role.id),
      ]);
      setAllPermissions(perms);
      setRolePermissions(
        assigned.map(extractPermissionId).filter(Boolean) as string[]
      );
      setAssignInitial(
        assigned.map(extractPermissionId).filter(Boolean) as string[]
      );
    } finally {
      setAssignLoading(false);
    }
  };
  const handleAssignClose = () => {
    setAssignOpen(false);
    setSelectedRole(null);
    setAllPermissions([]);
    setRolePermissions([]);
    setAssignInitial([]);
  };
  const handlePermissionToggle = (id: string) => {
    setRolePermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setAssignLoading(true);
    try {
      // Find added and removed permissions
      const toAdd = rolePermissions.filter((id) => !assignInitial.includes(id));
      const toRemove = assignInitial.filter(
        (id) => !rolePermissions.includes(id)
      );
      await Promise.all([
        ...toAdd.map((pid) =>
          assignPermission({ roleId: selectedRole.id, permissionId: pid })
        ),
        ...toRemove.map((pid) =>
          removePermission({ roleId: selectedRole.id, permissionId: pid })
        ),
      ]);
      handleAssignClose();
      fetchRoles();
      setAllPermissions(await getPermissions());
    } finally {
      setAssignLoading(false);
    }
  };

  // In the assign modal, only show permissions not already assigned
  const filteredPermissions = allPermissions.filter(
    (perm) =>
      perm.action.toLowerCase().includes(search.toLowerCase()) ||
      perm.resource.toLowerCase().includes(search.toLowerCase()) ||
      (perm.description || "").toLowerCase().includes(search.toLowerCase())
  );

  // In Assign Permissions modal, show assigned permissions as chips with delete icon and confirmation dialog
  const handleConfirmDelete = async () => {
    if (selectedRole && confirmDelete.permission) {
      await removePermission({
        roleId: selectedRole.id,
        permissionId: confirmDelete.permission.id,
      });
      // Refresh assigned permissions and all permissions
      const [perms, assigned] = await Promise.all([
        getPermissions(),
        getRolePermissions(selectedRole.id),
      ]);
      setAllPermissions(perms);
      setRolePermissions(assigned.map((p: Permission) => p.id));
      setAssignInitial(assigned.map((p: Permission) => p.id));
    }
    setConfirmDelete({ open: false, permission: null });
  };
  const handleCancelDelete = () =>
    setConfirmDelete({ open: false, permission: null });

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
          Roles
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Role
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Role</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              required
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              value={form.description}
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
        <DialogTitle>Assign Permissions to {selectedRole?.name}</DialogTitle>
        <form onSubmit={handleAssignSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              {/* Assigned Permissions Section */}
              <div>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Assigned Permissions
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {rolePermissions.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No permissions assigned
                    </Typography>
                  )}
                  {allPermissions
                    .filter((perm) => rolePermissions.includes(perm.id))
                    .map((perm) => (
                      <Chip
                        key={perm.id}
                        label={`${perm.action} - ${perm.resource}`}
                        color="primary"
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                </Stack>
              </div>
              <Divider sx={{ my: 1 }} />
              {/* Search Box */}
              <TextField
                placeholder="Search permissions..."
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
              {/* Permissions List: show all, checked if assigned or selected */}
              <div>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  All Permissions
                </Typography>
                {assignLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
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
                          bgcolor: rolePermissions.includes(perm.id)
                            ? assignInitial.includes(perm.id)
                              ? "primary.50"
                              : "grey.100"
                            : "background.paper",
                          transition: "background 0.2s",
                        }}
                      >
                        <Checkbox
                          checked={rolePermissions.includes(perm.id)}
                          onChange={() => handlePermissionToggle(perm.id)}
                          color={
                            assignInitial.includes(perm.id)
                              ? "primary"
                              : "default"
                          }
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={
                              assignInitial.includes(perm.id) ? 600 : 400
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
      <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
        <DialogTitle>Remove Permission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this permission from the role?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {confirmDelete.permission &&
              `${confirmDelete.permission.action} - ${confirmDelete.permission.resource}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleAssignOpen(r)}
                  >
                    Assign Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* (Optional) Edit Permission Dialog Placeholder */}
      <Dialog open={!!editPermission} onClose={() => setEditPermission(null)}>
        <DialogTitle>Edit Permission</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Edit functionality coming soon.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPermission(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
