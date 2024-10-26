import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

interface Column {
  id: 'count' | 'username' | 'userType' | 'userStatus' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'count', label: 'Count', minWidth: 100 },
  { id: 'username', label: 'Username', minWidth: 170 },
  { id: 'userType', label: 'User Type', minWidth: 100 },
  { id: 'userStatus', label: 'User Status', minWidth: 130 },
  { id: 'actions', label: 'Actions', minWidth: 170 },
];

interface Data {
  userId: string; // Keep userId in Data interface
  username: string;
  userType: string;
  userStatus: string;
}

function createData(
  userId: string,
  username: string,
  userType: string,
  userStatus: string,
): Data {
  return { userId, username, userType, userStatus };
}

// Sample data for the table
const rows = [
  createData('1', 'JohnDoe', 'user', 'active'),
  createData('2', 'JaneSmith', 'admin', 'pending'),
  createData('3', 'AliceJohnson', 'user', 'deactivated'),
  createData('4', 'KaneSmith', 'admin', 'pending'),
  createData('5', 'BobBrown', 'user', 'banned'),
  createData('6', 'CharlieDavis', 'admin', 'active'),
  createData('7', 'DaneSmith', 'admin', 'pending'),
];

const PendingRequest: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAccept = (userId: string) => {
    // Implement accept logic here
    console.log(`Accepted user: ${userId}`);
  };

  const handleReject = (userId: string) => {
    // Implement reject logic here
    console.log(`Rejected user: ${userId}`);
  };

  // Filter rows to show only pending users
  const pendingRows = rows.filter(row => row.userStatus === 'pending');

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.username}>
                    {columns.map((column) => {
                      if (column.id === 'count') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {page * rowsPerPage + index + 1} {/* Sequential count */}
                          </TableCell>
                        );
                      }

                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <div>
                              <Button
                                variant="contained"
                                color="success" // Accept button in green
                                onClick={() => handleAccept(row.userId)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                color="error" // Reject button in red
                                onClick={() => handleReject(row.userId)}
                                style={{ marginLeft: '8px' }}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        );
                      }

                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pendingRows.length} // Updated count to filtered rows
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default PendingRequest;
