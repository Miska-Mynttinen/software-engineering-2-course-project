import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, Drawer, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import PendingRequest from './PendingRequest';
import AllUser from './AllUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrganizations, getUsers, getUserGroups } from '../../redux/selectors/apiSelector';
import { organizationThunk, userThunk, userGroupThunk } from '../../redux/slices/apiSlice';
import { Organization, User, UserGroup } from '../../redux/states/apiState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import UserUploadButton from '../OverviewPage/Buttons/UserUploadButton';
import UserGroupUploadButton from '../OverviewPage/Buttons/UserGroupUploadButton';

const drawerWidth = 240;

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedPage, setSelectedPage] = useState('AllUser');
  const organizations: Organization[] = useAppSelector(getOrganizations);
  const users: User[] = useAppSelector(getUsers);
  const userGroups: UserGroup[] = useAppSelector(getUserGroups);
  const [username, setUsername] = useState('');

  const refreshUsers = () => {
    dispatch(userThunk(organizations));
  };

  const refreshUserGroups = () => {
    dispatch(userGroupThunk(organizations));
  };

  useEffect(() => {
    dispatch(organizationThunk());
    dispatch(userThunk(organizations));
    dispatch(userGroupThunk(organizations));
  }, [dispatch]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Admin';
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          {/* Display Username */}
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', gap: '8px', top: '10px', right: '10px' }}>
            <Typography variant="body1" style={{ marginRight: '16px' }}>
              Username: {username}
            </Typography>
            <Button
              color="inherit"
              sx={{
                marginLeft: 'auto',
                border: '1px solid white',
                borderRadius: '5px',
                padding: '5px 15px',
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#292929' }, // Set sidebar background color
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ overflow: 'auto' }}>
          {organizations.map((organization) => (
            <React.Fragment key={organization.id}>
              {/* Organization Name */}
              <Box sx={{ textAlign: 'center', padding: '16px 0' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {organization.name}
                </Typography>
              </Box>

              {/* Title: Admin Dashboard */}
              <Divider sx={{ backgroundColor: 'white' }} />
              <List>
                <ListItem>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', textAlign: 'center', width: '100%', color: 'white' }}
                  >
                    Admin Dashboard
                  </Typography>
                </ListItem>

                {/* All Users Tab */}
                <ListItem
                  button
                  onClick={() => setSelectedPage('AllUser')}
                  selected={selectedPage === 'AllUser'}
                  sx={{
                    backgroundColor: selectedPage === 'AllUser' ? '#444444' : 'transparent', // Darker shade for selected page
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                  }}
                >
                  <ListItemText primary="All Users" sx={{ color: 'white' }} />
                </ListItem>

                {/* Add User Button */}
                <ListItem>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <UserUploadButton orgId={organization.id} onUserCreated={refreshUsers} />
                  </Box>
                </ListItem>

                {/* Add User Group Button */}
                <ListItem>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <UserGroupUploadButton orgId={organization.id} onUserGroupCreated={refreshUserGroups} />
                  </Box>
                </ListItem>

                {/* List of User Groups */}
                <ListItem>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', textAlign: 'left', width: '100%', color: 'white' }}
                  >
                    User Groups:
                  </Typography>
                </ListItem>
                {userGroups
                  .filter((userGroup) => userGroup.organizationId === organization.id)
                  .map((userGroup) => (
                    <ListItem key={userGroup.name} sx={{ paddingLeft: '16px' }}>
                      <ListItemText primary={userGroup.name} sx={{ color: 'white' }} />
                    </ListItem>
                  ))}
              </List>
            </React.Fragment>
          ))}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedPage === 'AllUser' && <AllUser rows={users} userGroups={userGroups} onUserUpdated={refreshUsers} />}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
