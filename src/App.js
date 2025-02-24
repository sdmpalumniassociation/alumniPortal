import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
}

export default App;
