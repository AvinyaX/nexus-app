import React, { useEffect, useState } from "react";
import { getPermissions, createPermission } from "../../api/acl";
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
} from "@mui/material";

interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
}

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    action: "",
    resource: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setPermissions(await getPermissions());
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ action: "", resource: "", description: "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPermission({
        action: form.action,
        resource: form.resource,
        description: form.description || undefined,
      });
      handleClose();
      fetchPermissions();
    } finally {
      setLoading(false);
    }
  };

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
          Permissions
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Permission
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Permission</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Action"
              name="action"
              fullWidth
              required
              value={form.action}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Resource"
              name="resource"
              fullWidth
              required
              value={form.resource}
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.action}</TableCell>
                <TableCell>{p.resource}</TableCell>
                <TableCell>{p.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
