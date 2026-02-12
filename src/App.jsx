import {BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Loginpage";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Admin from './components/Admin';
import AdminLogin from "./components/Adminlogin";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminlogin" element={<AdminLogin />}/>
      </Routes>
    </BrowserRouter>
  );
}