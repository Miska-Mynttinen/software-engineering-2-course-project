import React from 'react';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import PendingRequest from './PendingRequest'; // Import your renamed table component
import AllUser from './AllUser'; // Import the AllUser table component

const AdminDashboard: React.FC = () => {
  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box mt={8} p={2}>
        <Box mb={2}>
          <Typography 
            variant="h5" 
            style={{ 
              color: 'white', 
              backgroundColor: '#3f51b5', 
              padding: '10px', 
              borderRadius: '5px', 
              textAlign: 'left' // Left align text
            }} 
          >
            Pending Requests
          </Typography>
          <PendingRequest /> {/* Use the PendingRequest component */}
        </Box>
        <Box>
          <Typography 
            variant="h5" 
            style={{ 
              color: 'white', 
              backgroundColor: '#3f51b5', 
              padding: '10px', 
              borderRadius: '5px', 
              textAlign: 'left' // Left align text
            }} 
          >
            All Users
          </Typography>
          <AllUser /> {/* Use the AllUser component */}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
