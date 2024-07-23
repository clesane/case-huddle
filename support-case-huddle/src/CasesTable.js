import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
  Button,
  TextField
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { formatTime } from './utils';

const CasesTable = ({ cases = [], onDeleteCase, onAddSession, onViewDetails }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('caseNumber');
  const [filterText, setFilterText] = useState('');

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedCases = useMemo(() => {
    return [...cases]
      .filter(caseItem => 
        Object.values(caseItem).some(value => 
          value.toString().toLowerCase().includes(filterText.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
          return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [cases, orderBy, order, filterText]);

  return (
    <>
      <TextField
        fullWidth
        margin="normal"
        label="Filter cases"
        variant="outlined"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['caseNumber', 'customer', 'supportEngineer', 'dateOpened', 'productServiceArea', 'issueType', 'labels', 'huddleSessionsCount', 'totalHuddleDuration'].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleSortRequest(column)}
                  >
                    {column === 'huddleSessionsCount' ? 'Huddle Sessions' :
                     column === 'totalHuddleDuration' ? 'Total Duration' :
                     column.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + column.replace(/([A-Z])/g, ' $1').slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedCases.map((caseItem, index) => (
              <TableRow key={index}>
                <TableCell>{caseItem.caseNumber}</TableCell>
                <TableCell>{caseItem.customer}</TableCell>
                <TableCell>{caseItem.supportEngineer}</TableCell>
                <TableCell>{caseItem.dateOpened}</TableCell>
                <TableCell>{caseItem.productServiceArea}</TableCell>
                <TableCell>{caseItem.issueType}</TableCell>
                <TableCell>{caseItem.labels}</TableCell>
                <TableCell>{caseItem.huddleSessions.length}</TableCell>
                <TableCell>{formatTime(caseItem.huddleSessions.reduce((total, session) => total + (session.duration || 0), 0))}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onDeleteCase(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button onClick={() => onAddSession(index)} startIcon={<AddIcon />}>
                    Add Session
                  </Button>
                  <Button onClick={() => onViewDetails(index)} startIcon={<VisibilityIcon />}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

CasesTable.defaultProps = {
  cases: []
};

export default CasesTable;