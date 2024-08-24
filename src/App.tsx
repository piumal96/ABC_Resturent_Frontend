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
import ReservationDetail from './pages/Admin/ReservationDetail';
import QueryList from './pages/Admin/QueryList';
import QueryDetail from './pages/Admin/QueryDetail';
import PaymentList from './pages/Admin/PaymentList';
import PaymentDetail from './pages/Admin/PaymentDetail';
import ReportGenerator from './pages/Admin/ReportGenerator';
import ReportView from './pages/Admin/ReportView';
import UserList from './pages/Admin/UserList';
import UserRoleForm from './pages/Admin/UserRoleForm';

import SignIn from './pages/Auth/SignIn';
import Register from './pages/Auth/Register';

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

function App() {
  const navigate = useNavigate();

  const handleGallerySubmit = (data: { url: string; caption: string; location: string }) => {
    console.log('Gallery data submitted:', data);
    navigate('/gallery');
  };

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} /> 
      <Route path="/login" element={<SignIn />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/register" element={<Register/>} />

      {/* Admin routes */}
      <Route path="/services" element={<ServiceList />} />
      <Route path="/services/add" element={<ServiceForm />} />
      <Route path="/services/edit/:id" element={<ServiceForm />} />
      <Route path="/offers" element={<OfferList />} />
      <Route path="/offers/add" element={<OfferForm />} />
      <Route path="/offers/edit/:id" element={<OfferForm />} />
      <Route path="/facilities" element={<FacilityList />} />
      <Route path="/facilities/edit/:id" element={<FacilityForm />} />
      <Route path="/reservations" element={<ReservationList />} />
      <Route path="/reservations/:id" element={<ReservationDetail />} />
      <Route path="/queries" element={<QueryList />} />
      <Route path="/queries/:id" element={<QueryDetail />} />
      <Route path="/payments" element={<PaymentList />} />
      <Route path="/payments/:id" element={<PaymentDetail />} />
      <Route path="/reports" element={<ReportGenerator />} />
      <Route path="/reports/:reportType" element={<ReportView />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id/edit-role" element={<UserRoleForm />} />

      {/* Gallery management routes */}
      <Route path="/gallery" element={<GalleryList />} />
      <Route path="/gallery/add" element={<GalleryForm onSubmit={handleGallerySubmit} />} />
      <Route path="/gallery/edit/:id" element={<GalleryForm onSubmit={handleGallerySubmit} />} />

      {/* Staff dashboard routes */}
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
      <Route path="/staff/reservations" element={<StaffReservationList />} />
      <Route path="/staff/reservations/:id" element={<StaffReservationDetail />} />
      <Route path="/staff/queries" element={<StaffQueryList />} />
      <Route path="/staff/queries/:id" element={<StaffQueryDetail />} />
      <Route path="/staff/payments" element={<StaffPaymentList />} />
      <Route path="/staff/payments/:id" element={<StaffPaymentDetail />} />

      {/* Other routes */}
    </Routes>
  );
}

export default App;
