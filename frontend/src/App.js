// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './screens/signup';
import LoginPage from './screens/login';
import HomePage from './screens/home';
import ListedPage from './screens/listedpage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/listedPage" element={<ListedPage />} />
      </Routes>
    </Router>
  );
};

export default App;
