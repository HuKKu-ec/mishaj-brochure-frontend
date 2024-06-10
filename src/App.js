import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './Components/HomeScreen';

import NavbarHead from './Components/NavbarHead';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminScreen from './Components/AdminScreen';
import EditScreen from './Components/EditScreen';
import AdminLogin from './Components/AdminLogin';
import { useContext } from 'react';
import { AdminContext } from './Context/AdminContextProvider';
import { ToastContainer } from 'react-toastify';
import ProductDisplay from './Components/ProductDisplay';

function App() {
  const { admin } = useContext(AdminContext);
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <NavbarHead />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductDisplay />} />
          <Route
            path="/admin"
            element={admin ? <AdminScreen /> : <AdminLogin />}
          />
          <Route
            path="/login"
            element={!admin ? <AdminLogin /> : <AdminScreen />}
          />
          <Route path="/admin/edit/:id" element={<EditScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
