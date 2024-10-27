import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TablePagination } from '@mui/material';

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
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Manage All User Here!!!
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold' }}>User Type</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold' }}>User Status</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.userId}>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.userType}</TableCell>
                <TableCell>{row.userStatus}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => console.log(`Suspended user: ${row.userId}`)}>
                    Suspend
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => console.log(`Deleted user: ${row.userId}`)} sx={{ ml: 1 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AllUser;
