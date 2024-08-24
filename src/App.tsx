import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css'
import Register from './pages/Register';
import HomeScreen from './pages/Home';
import SignIn from './pages/SignIn';


// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline helps to provide a consistent baseline for your styles */}
      <CssBaseline />
      {/* Your Application Components */}
      {/* <HomeScreen /> */}
      {/* <Register/> */}
      <SignIn/>
    </ThemeProvider>
  );
}

export default App;
