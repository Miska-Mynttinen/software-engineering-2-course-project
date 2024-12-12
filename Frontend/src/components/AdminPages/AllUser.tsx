import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TablePagination } from '@mui/material';
import { User, UserGroup } from '../../redux/states/apiState';
import UserUpdateButton from '../OverviewPage/Buttons/UserUpdateButton';

interface AllUserProps {
  rows: User[]; // User rows for the table
  userGroups: UserGroup[]; // User groups to be shown for each user
  onUserUpdated: () => void; // Callback when a user is updated
}

const AllUser: React.FC<AllUserProps> = ({ rows = [], userGroups, onUserUpdated }) => {
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
      <Typography variant="h6" sx={{ marginBottom: 2, color: 'white' }}>
        Manage All Users
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: '#292929' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>User Id</TableCell>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>User Type</TableCell>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>User Groups</TableCell>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>Update User Groups</TableCell>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>User Status</TableCell>
              <TableCell sx={{ backgroundColor: '#292929', color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Mapping over rows with pagination */}
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.userId} sx={{ backgroundColor: '#333333' }}>
                <TableCell sx={{ color: 'white' }}>{row.username}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.userId}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.userType}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {/* Displaying user groups */}
                  {row.userGroups && row.userGroups.map((userGroup) => (
                    <p style={{ padding: '0', fontSize: '15px', marginBlock: '5px' }} key={userGroup}>
                      {userGroup}
                    </p>
                  ))}
                </TableCell>
                <TableCell>
                  <UserUpdateButton orgId={row.organizationId} userId={row.userId} userGroups={userGroups} onUserUpdated={onUserUpdated} />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{row.userStatus}</TableCell>
                <TableCell>
                  {/* Suspend user button */}
                  <Button variant="contained" color="secondary" onClick={() => console.log(`Suspended user: ${row.userId}`)}>
                    Suspend
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Table Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: 'white' }} // Make pagination text white
      />
    </Box>
  );
};

export default AllUser;
