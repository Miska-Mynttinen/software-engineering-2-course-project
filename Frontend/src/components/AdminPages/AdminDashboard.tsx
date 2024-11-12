import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, Drawer, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import PendingRequest from './PendingRequest';
import AllUser from './AllUser';
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
  const [selectedPage, setSelectedPage] = useState('AllUser'); // Track selected page
  const [username, setUsername] = useState(''); // State for username
  const organizations: Organization[] = useAppSelector(getOrganizations);
  const users: User[] = useAppSelector(getUsers);
  const userGroups: UserGroup[] = useAppSelector(getUserGroups);

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
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem('username') || 'Guest';
    setUsername(storedUsername);
  }, []);

  const menuItems = [
    { text: 'All Users', page: 'AllUser' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
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
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', ml: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => setSelectedPage(item.page)}
                selected={selectedPage === item.page}
                sx={{
                  backgroundColor: selectedPage === item.page ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedPage === 'AllUser' && (
          <AllUser rows={users} userGroups={userGroups} onUserUpdated={refreshUsers} />
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
