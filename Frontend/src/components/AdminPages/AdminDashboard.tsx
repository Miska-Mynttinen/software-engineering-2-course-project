import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, Drawer, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import PendingRequest from './PendingRequest';
import AllUser from './AllUser';

interface User {
  userId: string;
  username: string;
  userType: string;
  userStatus: string;
}

const drawerWidth = 240;

const rows: User[] = [
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
];

const AdminDashboard: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('PendingRequest'); // Track selected page

  // Sidebar menu options
  const menuItems = [
    { text: 'Pending Requests', page: 'PendingRequest' },
    { text: 'All Users', page: 'AllUser' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Button
            color="inherit"
            sx={{
              marginLeft: 'auto',
              border: '1px solid white', // Adds a white border to the button
              borderRadius: '5px', // Optional: Adds rounded corners to the button
              padding: '5px 15px', // Adjust padding for a better look
            }}
          >
            Logout
          </Button>
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
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedPage === 'PendingRequest' && <PendingRequest rows={rows} />}
        {selectedPage === 'AllUser' && <AllUser rows={rows} />}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
