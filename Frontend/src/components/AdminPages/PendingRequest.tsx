import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from '@mui/material';

interface User {
  userId: string;
  username: string;
  userType: string;
  userStatus: string;
}

interface PendingRequestProps {
  rows: User[];
}

const PendingRequest: React.FC<PendingRequestProps> = ({ rows }) => {
  const pendingRows = rows.filter((row) => row.userStatus === 'pending');

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Pending Requests
      </Typography>
      <Typography variant="body1" paragraph>
        View and manage pending user requests. You can approve or reject these requests as necessary.
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>User Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRows.map((row) => (
              <TableRow key={row.userId}>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.userType}</TableCell>
                <TableCell>{row.userStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => console.log(`Accepted user: ${row.userId}`)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => console.log(`Rejected user: ${row.userId}`)}
                    sx={{ ml: 1 }}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PendingRequest;
