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

/* const rows: User[] = [
  { userId: '1', username: 'JohnDoe', userType: 'USER', userStatus: 'ACTIVE' },
  { userId: '2', username: 'JaneSmith', userType: 'USER', userStatus: 'PENDING' },
  { userId: '3', username: 'AliceJohnson', userType: 'USER', userStatus: 'DEACTIVATED' },
  { userId: '4', username: 'KaneSmith', userType: 'USER', userStatus: 'PENDING' },
  { userId: '5', username: 'BobBrown', userType: 'USER', userStatus: 'SUSPENDED' },
  { userId: '6', username: 'CharlieDavis', userType: 'USER', userStatus: 'ACTIVE' },
  { userId: '7', username: 'DaneSmith', userType: 'USER', userStatus: 'PENDING' },
  { userId: '8', username: 'EveJackson', userType: 'USER', userStatus: 'ACTIVE' },
  { userId: '9', username: 'FrankGreen', userType: 'USER', userStatus: 'SUSPENDED' },
  { userId: '10', username: 'GraceLee', userType: 'USER', userStatus: 'PENDING' },
  { userId: '11', username: 'HankWhite', userType: 'USER', userStatus: 'DEACTIVATED' },
  { userId: '12', username: 'IvyClark', userType: 'USER', userStatus: 'ACTIVE' },
  { userId: '13', username: 'JackWright', userType: 'USER', userStatus: 'ACTIVE' },
  { userId: '14', username: 'KateMartin', userType: 'USER', userStatus: 'PENDING' },
  { userId: '15', username: 'LeoGarcia', userType: 'USER', userStatus: 'ACTIVE' },
]; */

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const [selectedPage, setSelectedPage] = useState('AllUser'); // Track selected page
  const organizations: Organization[] = useAppSelector(getOrganizations)
  const users: User[] = useAppSelector(getUsers)
  const userGroups: UserGroup[] = useAppSelector(getUserGroups)
  const [username, setUsername] = useState(''); // State for username


  const refreshUsers = () => {
    dispatch(userThunk(organizations));
  };

  const refreshUserGroups = () => {
    dispatch(userGroupThunk(organizations));
  };

  useEffect(() => {
    dispatch(organizationThunk())
    dispatch(userThunk(organizations));
    dispatch(userGroupThunk(organizations));
  }, [dispatch]);

  useEffect(() => {
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem('username') || 'Admin';
    setUsername(storedUsername);
  }, []);
  
  const handleLogout = () => {
    // Clear any necessary data, e.g., session tokens
    localStorage.removeItem('username'); // Example: Clear username
    localStorage.removeItem("token");
    navigate('/'); // Redirect to the login page
  };

  // Sidebar menu options
  const menuItems = [
    /*{ text: 'Pending Requests', page: 'PendingRequest' },*/
    { text: 'All Users', page: 'AllUser' },
  ];

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
                border: '1px solid white', // Adds a white border to the button
                borderRadius: '5px', // Optional: Adds rounded corners to the button
                padding: '5px 15px', // Adjust padding for a better look
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
                selected={selectedPage === item.page} // Highlight the selected item
                sx={{
                  backgroundColor: selectedPage === item.page ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Optional hover effect
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {organizations.map((organization) => (
            <>
              <ListItem sx={{ justifyContent: 'center' }} key={organization.id} disablePadding>
                <p style={{marginBlock: '0rem', fontSize: '25px'}}>{organization.name}</p>
              </ListItem>
              <div style={{ display: 'flex', alignItems: 'center', paddingInline: '0.5rem' }}>
              </div>
              <ListItem sx={{ justifyContent: 'center' }}>
                <Box sx={{ width: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <UserUploadButton orgId={organization.id} onUserCreated={refreshUsers} />
                </Box>
              </ListItem>
              <ListItem sx={{ justifyContent: 'center' }}>
                <Box sx={{ width: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <UserGroupUploadButton orgId={organization.id} onUserGroupCreated={refreshUserGroups} />
                </Box>
              </ListItem>
              <>
              <ListItem sx={{ paddingInline: '5px' }}>
                <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>User Groups of {organization.name}</p>
              </ListItem>
              <>
                {userGroups && userGroups.map((userGroup) =>
                  userGroup.organizationId === organization.id ? (
                    <ListItem key={userGroup.name} sx={{ paddingInline: '5px' }}>
                      <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>{userGroup.name}</p>
                    </ListItem>
                  ) : null
                )}
              </>
              </>
            </>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/*selectedPage === 'PendingRequest' && <PendingRequest rows={rows} />*/}
        {selectedPage === 'AllUser' && <AllUser rows={users} userGroups={userGroups} onUserUpdated={refreshUsers}/>}
      </Box>
    </Box>
  );
};

export default AdminDashboard;

/*
<>
              <ListItem sx={{ paddingInline: '5px' }}>
                <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>Users</p>
              </ListItem>
              <>
                {users && users.map((user) =>
                  user.organizationId === organization.id ? (
                    <ListItem key={user.userId} sx={{ paddingInline: '5px' }}>
                      <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>
                        Username: {user.username} {user.userId}
                      </p>
                      <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>
                        UserId: {user.userId}
                      </p>
                      <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>
                        UserGroups:
                        {user.userGroups && user.userGroups.map((group, index) => (
                          <p key={index} style={{ padding: '0', fontSize: '20px', marginBlock: '5px' }}>
                            {group}
                          </p>
                        ))}
                      </p>
                    </ListItem>
                  ) : null
                )}
              </>
            </>
            <>
              <ListItem sx={{ paddingInline: '5px' }}>
                <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>User Groups</p>
              </ListItem>
              <>
                {userGroups && userGroups.map((userGroup) =>
                  userGroup.organizationId === organization.id ? (
                    <ListItem key={userGroup.name} sx={{ paddingInline: '5px' }}>
                      <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>{userGroup.name}</p>
                    </ListItem>
                  ) : null
                )}
              </>
            </>
*/