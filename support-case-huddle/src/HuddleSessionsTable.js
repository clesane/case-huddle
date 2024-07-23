import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { formatTime } from './utils';

const HuddleSessionsTable = ({ sessions }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Overview</TableCell>
            <TableCell>Next Steps</TableCell>
            <TableCell>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session, index) => (
            <TableRow key={index}>
              <TableCell>{session.date}</TableCell>
              <TableCell>{session.currentStatus}</TableCell>
              <TableCell>{session.caseOverview.substring(0, 50)}...</TableCell>
              <TableCell>{session.nextSteps.substring(0, 50)}...</TableCell>
              <TableCell>{formatTime(session.duration || 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HuddleSessionsTable;
