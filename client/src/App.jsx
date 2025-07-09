import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DonationForm from './components/DonationForm';
import RequestForm from './components/RequestForm';
import Home from './pages/Home'; 

function App() {
  const [user, setUser] = useState(null);

  // Simulate fetching user from backend/localStorage (you can replace this)
  useEffect(() => {
    // You can replace this with real authentication logic
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
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* Pass setUser */}
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/request" element={<RequestForm />} />
      </Routes>
    </>
  );
}

export default App;
