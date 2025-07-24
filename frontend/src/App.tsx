import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Link는 Header로 이동
import './App.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Login from './pages/Login'
import Regist from './pages/Regist';
import Book from './pages/Book';
import ReviewList from './pages/ReviewList';
import SearchList from './pages/SearchList';
import ReviewDetail from './pages/ReviewDetail';
import WriteReview from './pages/WriteReview';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Routes는 앱 전체에서 한 번만 렌더링되어야 합니다. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/123" element={<Book />} />
        <Route path="/234" element={<ReviewList />} />
        <Route path="/2345" element={<ReviewDetail />} />
        <Route path="/2346" element={<WriteReview />} />
        <Route path="/345" element={<SearchList />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;