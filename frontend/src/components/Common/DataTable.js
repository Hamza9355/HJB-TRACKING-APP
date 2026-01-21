import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box } from '@mui/material';

const DataTable = ({ columns, data, loading = false, onRowClick }) => {
  if (loading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Chargement...</Box>;
  }

  if (data.length === 0) {
    return <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>Aucune donnée disponible</Box>;
  }

  const getStatusColor = (status) => {
    const statusMap = {
      'ACTIF': 'success',
      'MAINTENANCE': 'warning',
      'HORS_SERVICE': 'error',
      'OK': 'success',
      'EN_COURS': 'info',
      'WARNING_LOAD': 'warning',
      'WARNING_THEFT': 'error',
    };
    return statusMap[status] || 'default';
  };

  return (
    <TableContainer component={Paper} sx={{ background: 'rgba(26, 35, 126, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' },
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => {
                const value = row[column.id];
                const isStatus = ['status', 'alert_status'].includes(column.id);

                return (
                  <TableCell key={column.id}>
                    {isStatus ? (
                      <Chip
                        label={value}
                        color={getStatusColor(value)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
