// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import './App.css'
// import Register from './pages/Register';
// import HomeScreen from './pages/Home';
// import SignIn from './pages/SignIn';
// import AdminDashboard from './pages/AdminDashboard';


// // Create a custom theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <ThemeProvider theme={theme}>
//       {/* CssBaseline helps to provide a consistent baseline for your styles */}
//       <CssBaseline />
//       {/* Your Application Components */}
//       {/* <HomeScreen /> */}
//       {/* <Register/> */}
//       {/* <SignIn/> */}
//       <AdminDashboard/>
//     </ThemeProvider>
//   );
// }
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ServiceList from './pages/ServiceList'; // The list view of services
import ServiceForm from './pages/ServiceForm'; // The form to add/edit a service

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/services" element={<ServiceList />} />
      <Route path="/services/add" element={<ServiceForm />} />
      <Route path="/services/edit/:id" element={<ServiceForm />} />
      {/* Other routes */}
    </Routes>
  );
}

export default App;
