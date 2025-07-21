// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Link는 Header로 이동
import './App.css';
import Header from './components/Header'; // Header 컴포넌트 임포트
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* Header는 모든 페이지에 표시될 것이므로 Routes 위에 배치합니다. */}
      <Header />

      {/* Routes는 앱 전체에서 한 번만 렌더링되어야 합니다. */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;