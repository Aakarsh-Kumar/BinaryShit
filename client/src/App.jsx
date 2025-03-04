import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShitpostGenerator from "./pages/Cards.jsx";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<ShitpostGenerator />} />
      </Routes>
    </Router>
  );
};

export default App;
