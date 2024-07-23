import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, PlayArrow as PlayIcon, Stop as StopIcon } from '@mui/icons-material';

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const HuddleSession = ({ session, index, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedSession, setEditedSession] = useState(session);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(session.duration || 0);
  const timerRef = useRef(null);

  useEffect(() => {
    setEditedSession(session);
    setTime(session.duration || 0);
  }, [session]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedSession(prevSession => ({
      ...prevSession,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdate(index, { ...editedSession, duration: time });
    setEditMode(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardHeader
        title={`Huddle Session ${index + 1}`}
        action={
          <>
            <IconButton onClick={toggleTimer}>
              {isRunning ? <StopIcon /> : <PlayIcon />}
            </IconButton>
            <IconButton onClick={() => onDelete(index)}>
              <DeleteIcon />
            </IconButton>
            {editMode ? (
              <IconButton onClick={handleSave}>
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setEditMode(true)}>
                <EditIcon />
              </IconButton>
            )}
          </>
        }
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Duration: {formatTime(time)}
        </Typography>
        {editMode ? (
          <Box component="form">
            <TextField
              label="Date"
              name="date"
              type="date"
              value={editedSession.date || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Current Status</InputLabel>
              <Select
                name="currentStatus"
                value={editedSession.currentStatus || ''}
                onChange={handleInputChange}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Pending Customer">Pending Customer</MenuItem>
                <MenuItem value="Pending Development">Pending Development</MenuItem>
                <MenuItem value="Pending QA">Pending QA</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Case Overview"
              name="caseOverview"
              value={editedSession.caseOverview || ''}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Steps Taken"
              name="stepsTaken"
              value={editedSession.stepsTaken || ''}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Challenges"
              name="challenges"
              value={editedSession.challenges || ''}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Next Steps"
              name="nextSteps"
              value={editedSession.nextSteps || ''}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography><strong>Date:</strong> {session.date}</Typography>
            <Typography><strong>Current Status:</strong> {session.currentStatus}</Typography>
            <Typography><strong>Case Overview:</strong> {session.caseOverview}</Typography>
            <Typography><strong>Steps Taken:</strong> {session.stepsTaken}</Typography>
            <Typography><strong>Challenges:</strong> {session.challenges}</Typography>
            <Typography><strong>Next Steps:</strong> {session.nextSteps}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(HuddleSession);