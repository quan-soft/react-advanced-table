import { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { DataTable } from './components/DataTable';
import { loadOrGenerateData, clearStoredData, generateUsers } from './utils/dataGenerator';

// Create MUI theme with custom colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8b9ef7',
      dark: '#4c5ed4',
    },
    secondary: {
      main: '#764ba2',
      light: '#9568bd',
      dark: '#5a3780',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load or generate data on mount
    const loadData = () => {
      try {
        const userData = loadOrGenerateData(500);
        setData(userData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRegenerateData = () => {
    clearStoredData();
    const newData = generateUsers(500);
    localStorage.setItem('tableData', JSON.stringify(newData));
    setData(newData);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" color="white">
            Loading data...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pb: 4,
        }}
      >
        {/* App Bar Header */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ py: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 0.5
                }}
              >
                React Data Table Assessment
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                High-Performance Table with 500+ Records
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRegenerateData}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.95)',
                  boxShadow: 6,
                },
              }}
            >
              Regenerate Data
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          <DataTable rawData={data} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

