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

interface AllUserProps {
  rows: User[];
}

const AllUser: React.FC<AllUserProps> = ({ rows }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        All Users
      </Typography>
      <Typography variant="body1" paragraph>
        Manage all registered users. You can suspend or delete users as necessary.
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
            {rows.map((row) => (
              <TableRow key={row.userId}>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.userType}</TableCell>
                <TableCell>{row.userStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => console.log(`Suspended user: ${row.userId}`)}
                  >
                    Suspend
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => console.log(`Deleted user: ${row.userId}`)}
                    sx={{ ml: 1 }}
                  >
                    Delete
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

export default AllUser;
