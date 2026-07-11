import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './admin/AdminLayout';
import { RequireAdmin } from './routes/ProtectedRoute';

import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Offers from './pages/Offers';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import NotFound from './pages/NotFound';

import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import PackagesManage from './admin/PackagesManage';
import OffersManage from './admin/OffersManage';
import BookingsManage from './admin/BookingsManage';
import ContactsManage from './admin/ContactsManage';
import UsersManage from './admin/UsersManage';
import Profile from './admin/Profile';

export default function App() {
  return (
    <Routes>
      {/* Admin auth (outside admin layout, full-screen) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin dashboard (protected) */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="packages" element={<PackagesManage />} />
        <Route path="offers" element={<OffersManage />} />
        <Route path="bookings" element={<BookingsManage />} />
        <Route path="contacts" element={<ContactsManage />} />
        <Route path="users" element={<UsersManage />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Public site */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:id" element={<PackageDetails />} />
        <Route path="offers" element={<Offers />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking/confirmation" element={<BookingConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
