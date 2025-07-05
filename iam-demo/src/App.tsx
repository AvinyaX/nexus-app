import React, { useState } from 'react';
import UsersList from './features/users/UsersList';
import RolesList from './features/acl/RolesList';
import PermissionsList from './features/acl/PermissionsList';
import { Button, Box, Container } from '@mui/material';

function App() {
  const [page, setPage] = useState<'users' | 'roles' | 'permissions'>('users');

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
        <Button
          variant={page === 'users' ? 'contained' : 'outlined'}
          onClick={() => setPage('users')}
        >
          Users
        </Button>
        <Button
          variant={page === 'roles' ? 'contained' : 'outlined'}
          onClick={() => setPage('roles')}
        >
          Roles
        </Button>
        <Button
          variant={page === 'permissions' ? 'contained' : 'outlined'}
          onClick={() => setPage('permissions')}
        >
          Permissions
        </Button>
      </Box>
      {page === 'users' && <UsersList />}
      {page === 'roles' && <RolesList />}
      {page === 'permissions' && <PermissionsList />}
    </Container>
  );
}

export default App;
