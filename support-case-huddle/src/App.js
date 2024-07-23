import React, { useState, useCallback, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CasesTable from './CasesTable';
import HuddleSession from './HuddleSession';
import ErrorBoundary from './ErrorBoundary';

const theme = createTheme();

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const App = () => {
  const [cases, setCases] = useState(() => loadFromLocalStorage('cases') || []);
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    customer: '',
    supportEngineer: '',
    dateOpened: '',
    productServiceArea: '',
    issueType: '',
    labels: '',
    huddleSessions: []
  });
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [products, setProducts] = useState(() => loadFromLocalStorage('products') || []);
  const [openLabelDialog, setOpenLabelDialog] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [labels, setLabels] = useState(() => loadFromLocalStorage('labels') || []);
  const [openHuddleSession, setOpenHuddleSession] = useState(null);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    saveToLocalStorage('cases', cases);
  }, [cases]);

  useEffect(() => {
    saveToLocalStorage('products', products);
  }, [products]);

  useEffect(() => {
    saveToLocalStorage('labels', labels);
  }, [labels]);

  const handleAddCase = (event) => {
    event.preventDefault();
    setCases([...cases, { ...newCase, huddleSessions: [] }]);
    setNewCase({
      caseNumber: '',
      customer: '',
      supportEngineer: '',
      dateOpened: '',
      productServiceArea: '',
      issueType: '',
      labels: '',
    });
  };

  const handleCaseInputChange = (event) => {
    const { name, value } = event.target;
    setNewCase({ ...newCase, [name]: value });
  };

  const handleAddProduct = () => {
    setProducts([...products, newProduct]);
    setNewProduct('');
    setOpenProductDialog(false);
  };

  const handleAddLabel = () => {
    setLabels([...labels, newLabel]);
    setNewLabel('');
    setOpenLabelDialog(false);
  };

  const handleDeleteCase = useCallback((index) => {
    setCases(cases => cases.filter((_, i) => i !== index));
  }, []);

  const handleAddSession = useCallback((caseIndex) => {
    setCases(prevCases => prevCases.map((caseItem, idx) => 
      idx === caseIndex
        ? {
            ...caseItem,
            huddleSessions: [
              ...caseItem.huddleSessions,
              {
                date: new Date().toISOString().split('T')[0],
                currentStatus: 'Open',
                caseOverview: '',
                stepsTaken: '',
                challenges: '',
                nextSteps: '',
                duration: 0
              }
            ]
          }
        : caseItem
    ));
    setOpenHuddleSession(caseIndex);
  }, []);

  const handleViewDetails = (index) => {
    setOpenHuddleSession(index);
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const parsedCases = results.data.map((row) => ({
            ...row,
            huddleSessions: row.huddleSessions ? JSON.parse(row.huddleSessions) : []
          }));
          setCases(parsedCases);
          saveToLocalStorage('cases', parsedCases);
        }
      });
    }
  };

  const handleSessionUpdate = useCallback((caseIndex, sessionIndex, updatedSession) => {
    setCases(prevCases => prevCases.map((caseItem, idx) => 
      idx === caseIndex
        ? {
            ...caseItem,
            huddleSessions: caseItem.huddleSessions.map((session, sIdx) => 
              sIdx === sessionIndex ? updatedSession : session
            )
          }
        : caseItem
    ));
  }, []);

  const handleSessionDelete = useCallback((caseIndex, sessionIndex) => {
    setCases(prevCases => prevCases.map((caseItem, idx) => 
      idx === caseIndex
        ? {
            ...caseItem,
            huddleSessions: caseItem.huddleSessions.filter((_, sIdx) => sIdx !== sessionIndex)
          }
        : caseItem
    ));
  }, []);

  const clearAllData = () => {
    // Clear state
    setCases([]);
    setProducts([]);
    setLabels([]);

    // Clear localStorage
    localStorage.removeItem('cases');
    localStorage.removeItem('products');
    localStorage.removeItem('labels');

    // Reset other state variables
    setNewCase({
      caseNumber: '',
      customer: '',
      supportEngineer: '',
      dateOpened: '',
      productServiceArea: '',
      issueType: '',
      labels: '',
      huddleSessions: []
    });
    setOpenHuddleSession(null);

    // Show success message
    setSnackbar({ open: true, message: 'All data has been cleared successfully', severity: 'success' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Support Case Huddle
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => setOpenClearDialog(true)} 
          sx={{ mb: 2 }}
        >
          Clear All Data
        </Button>
        <Box component="form" onSubmit={handleAddCase} sx={{ mb: 2 }}>
          <Card>
            <CardHeader title="Add New Case" />
            <CardContent>
              <TextField
                label="Case Number"
                name="caseNumber"
                value={newCase.caseNumber}
                onChange={handleCaseInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Customer"
                name="customer"
                value={newCase.customer}
                onChange={handleCaseInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Support Engineer"
                name="supportEngineer"
                value={newCase.supportEngineer}
                onChange={handleCaseInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date Opened"
                name="dateOpened"
                type="date"
                value={newCase.dateOpened}
                onChange={handleCaseInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Product/Service Area</InputLabel>
                <Select
                  name="productServiceArea"
                  value={newCase.productServiceArea}
                  onChange={handleCaseInputChange}
                >
                  {products.map((product, index) => (
                    <MenuItem key={index} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                  <MenuItem value="" onClick={() => setOpenProductDialog(true)}>
                    <AddIcon /> Add New Product/Service Area
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Issue Type</InputLabel>
                <Select
                  name="issueType"
                  value={newCase.issueType}
                  onChange={handleCaseInputChange}
                >
                  <MenuItem value="Bug">Bug</MenuItem>
                  <MenuItem value="Feature Request">Feature Request</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Labels</InputLabel>
                <Select
                  name="labels"
                  value={newCase.labels}
                  onChange={handleCaseInputChange}
                >
                  {labels.map((label, index) => (
                    <MenuItem key={index} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                  <MenuItem value="" onClick={() => setOpenLabelDialog(true)}>
                    <AddIcon /> Add New Label
                  </MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Case
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload CSV
            <input type="file" hidden onChange={handleCsvUpload} />
          </Button>
        </Box>
        <ErrorBoundary>
          <CasesTable
            cases={cases}
            onDeleteCase={handleDeleteCase}
            onAddSession={handleAddSession}
            onViewDetails={handleViewDetails}
          />
        </ErrorBoundary>
        <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
          <DialogTitle>Add New Product/Service Area</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Product/Service Area"
              fullWidth
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProductDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddProduct} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openLabelDialog} onClose={() => setOpenLabelDialog(false)}>
          <DialogTitle>Add New Label</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Label"
              fullWidth
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLabelDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddLabel} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        {openHuddleSession !== null && (
          <Dialog
            open={openHuddleSession !== null}
            onClose={() => setOpenHuddleSession(null)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Huddle Sessions</DialogTitle>
            <DialogContent>
              {cases[openHuddleSession].huddleSessions.map((session, sessionIndex) => (
                <HuddleSession
                  key={sessionIndex}
                  session={session}
                  index={sessionIndex}
                  onUpdate={(updatedSession) => handleSessionUpdate(openHuddleSession, sessionIndex, updatedSession)}
                  onDelete={() => handleSessionDelete(openHuddleSession, sessionIndex)}
                />
              ))}
              <Button 
                onClick={() => handleAddSession(openHuddleSession)} 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
              >
                Add New Huddle Session
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenHuddleSession(null)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Dialog
          open={openClearDialog}
          onClose={() => setOpenClearDialog(false)}
        >
          <DialogTitle>Clear All Data</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to clear all data? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenClearDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              clearAllData();
              setOpenClearDialog(false);
            }} color="secondary">
              Clear All Data
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <MuiAlert 
            elevation={6} 
            variant="filled" 
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;