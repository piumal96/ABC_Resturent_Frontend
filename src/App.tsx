import { Route, Routes, useNavigate } from 'react-router-dom';
import HomeScreen from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ServiceList from './pages/Admin/ServiceList'; 
import ServiceForm from './pages/Admin/ServiceForm'; 
import OfferList from './pages/Admin/OfferList';
import OfferForm from './pages/Admin/OfferForm';
import FacilityList from './pages/Admin/FacilityList';
import FacilityForm from './pages/Admin/FacilityForm';
import ReservationList from './pages/Admin/ReservationList';
import QueryList from './pages/Admin/QueryList';
import QueryDetail from './pages/Admin/QueryDetail';
import PaymentList from './pages/Admin/PaymentList';
import PaymentDetail from './pages/Admin/PaymentDetail';
import UserList from './pages/Admin/UserList'; // Make sure this import exists
import UserRoleForm from './pages/Admin/UserRoleForm'; // Make sure this import exists

import SignIn from './pages/Auth/SignIn';
import Register from './pages/Auth/Register'; // Fix: Moved to import above and use it

// Import the gallery components
import GalleryList from './pages/Admin/GalleryList'; 
import GalleryForm from './pages/Admin/GalleryForm'; 

// Import the staff dashboard and components
import StaffDashboard from './pages/StaffDashboard';
import StaffReservationList from './pages/staff/ReservationList';
import StaffReservationDetail from './pages/staff/ReservationDetail';
import StaffQueryList from './pages/staff/QueryList';
import StaffQueryDetail from './pages/staff/QueryDetail';
import StaffPaymentList from './pages/staff/PaymentList';
import StaffPaymentDetail from './pages/staff/PaymentDetail';
import ReservationForm from './pages/client/ReservationForm';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext';

// Import ReservationProvider
import { ReservationProvider } from './context/ReservationContext';

// Import ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute';
import ReportDashboard from './pages/Admin/ReportGenerator'; // Make sure this component exists
import CartManagement from './pages/client/Cart';
import MenuPage from './pages/client/MenuPage';
import DishList from './pages/Admin/MenuList';
import OrderList from './pages/Admin/OrderManage';
import UserOrderTracking from './pages/client/OrderTracking';
import OrderManage from './pages/staff/OrderManage';

function App() {
  const navigate = useNavigate();

  const handleGallerySubmit = (data: { url: string; caption: string; location: string }) => {
    console.log('Gallery data submitted:', data);
    navigate('/gallery');
  };

  return (
    <AuthProvider>
      <ReservationProvider> {/* Ensure ReservationProvider wraps the Routes */}
        <Routes>
          <Route path="/" element={<HomeScreen />} /> 
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><ServiceList /></ProtectedRoute>} />
          <Route path="/services/add" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
          <Route path="/services/edit/:id" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
          <Route path="/offers" element={<ProtectedRoute><OfferList /></ProtectedRoute>} />
          <Route path="/offers/add" element={<ProtectedRoute><OfferForm /></ProtectedRoute>} />
          <Route path="/offers/edit/:id" element={<ProtectedRoute><OfferForm /></ProtectedRoute>} />
          <Route path="/facilities" element={<ProtectedRoute><FacilityList /></ProtectedRoute>} />
          <Route path="/facilities/edit/:id" element={<ProtectedRoute><FacilityForm /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartManagement /></ProtectedRoute>} />
          
          <Route path="/queries" element={<ProtectedRoute><QueryList /></ProtectedRoute>} />
          <Route path="/queries/:id" element={<ProtectedRoute><QueryDetail /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentList /></ProtectedRoute>} />
          <Route path="/payments/:id" element={<ProtectedRoute><PaymentDetail /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportDashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/users/:id/edit-role" element={<ProtectedRoute><UserRoleForm /></ProtectedRoute>} />
          <Route path="/dish" element={<ProtectedRoute><DishList /></ProtectedRoute>} />
          <Route path="/track" element={<ProtectedRoute><UserOrderTracking /></ProtectedRoute>} />
          <Route path="/ordermanage" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          {/* Gallery management routes */}
          <Route path="/gallery" element={<ProtectedRoute><GalleryList /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
          <Route path="/gallery/add" element={<ProtectedRoute><GalleryForm onSubmit={handleGallerySubmit} /></ProtectedRoute>} />
          <Route path="/gallery/edit/:id" element={<ProtectedRoute><GalleryForm onSubmit={handleGallerySubmit} /></ProtectedRoute>} />

          {/* Staff dashboard routes */}
          <Route path="/staff/dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
          <Route path="/staff/reservations" element={<ProtectedRoute><StaffReservationList /></ProtectedRoute>} />
          <Route path="/staff/reservations/:id" element={<ProtectedRoute><StaffReservationDetail /></ProtectedRoute>} />
          <Route path="/staff/queries" element={<ProtectedRoute><StaffQueryList /></ProtectedRoute>} />
          <Route path="/staff/queries/:id" element={<ProtectedRoute><StaffQueryDetail /></ProtectedRoute>} />
          <Route path="/staff/payments" element={<ProtectedRoute><StaffPaymentList /></ProtectedRoute>} />
          <Route path="/staff/payments/:id" element={<ProtectedRoute><StaffPaymentDetail /></ProtectedRoute>} />
          <Route path="/staff/ordermanage" element={<ProtectedRoute><OrderManage /></ProtectedRoute>} />

          {/* Customer reservation form */}
          <Route path="/customer/reservation" element={<ProtectedRoute><ReservationForm /></ProtectedRoute>} />
        </Routes>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
