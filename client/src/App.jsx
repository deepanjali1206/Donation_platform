import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DonationForm from './components/DonationForm';
import RequestForm from './components/RequestForm';
import Home from './pages/Home'; 
import MyDonations from './pages/MyDonations';
import MyRequests from "./components/MyRequests";
import ContactPage from './pages/ContactPage';
import CausePage from './pages/CausePage';   
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';   
import AdminRoute from './routes/AdminRoute';
import AdminNavbar from './components/admin/AdminNavbar';  
import CreditsDashboard from "./pages/CreditsDashboard";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("circleUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("circleUser");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Navbar user={user} onLogout={handleLogout} />}
      {isAdminPath && <AdminNavbar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} /> 
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/causes" element={<CausePage />} />  
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/credits" element={<CreditsDashboard />} />
        {/* ✅ Correct route for donating to a specific campaign */}
        <Route path="/donate/:id" element={<DonationForm />} />

        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
