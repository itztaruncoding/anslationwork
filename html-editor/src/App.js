import React from "react";

import Home from "./components/Home";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import AIPopup from "./components/aipop";
import "./App.css";

function App() {

  return (
    <div className="App">
      <header className="header">
        <h1>HTML/CSS Editor</h1>

        <nav className="navbar">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>

        </nav>

      </header>
      <Home />
      <Features />
      <FAQ />

      <footer className="footer">
        <p>&copy; 2024 HTML/CSS Editor. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
