import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route,useNavigate, useLocation } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Profile from './profile'
import Sell from './sell'
import Buy from './buy'
import ItemPage from './itemPage'
import Cart from './cart'
import History from './history'
import Delivery from './delivery'

function AppRouter() {

  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    const storeduser = localStorage.getItem('user');
    if(storeduser) {
      const user_found = JSON.parse(storeduser);

      if(location.pathname === '/signup' || location.pathname === '/') {
      navigate('/profile', { state: { user_found } });
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div>
        <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/item/:id" element={<ItemPage />} /> 
          <Route path='/cart' element={<Cart />} />
          <Route path='/history' element={<History />} />
          <Route path='/delivery' element={<Delivery />} />
        </Routes>
        </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  )
}

export default App
