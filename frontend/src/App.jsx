import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken}/>} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
