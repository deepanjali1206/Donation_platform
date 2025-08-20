import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("circleUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      <Navbar user={user} /> 
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
          <Route path="/donate/:id" element={<DonationForm />} />
      </Routes>
    </>
  );
}

export default App;
