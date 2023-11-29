import React from "react";
import { AuthProvider } from "./utils/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateHunt from "./pages/CreateHunt";


const App: React.FC = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-hunt" element={<CreateHunt />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
