
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DonationForm from './components/DonationForm';
import RequestForm from './components/RequestForm';

import Home from './pages/Home'; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/donate" element={<DonationForm />} />
        <Route path="/request" element={<RequestForm />} />


      </Routes>
    </>
  );
}

export default App;