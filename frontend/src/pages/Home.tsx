// src/pages/Home.tsx
import React from 'react';
import BestReview from '../components/main/BestReview';
import RandomReview from '../components/main/RandomReview';
import Hot10 from '../components/main/Hot10';
import BookList from '../components/BookList';

const Home = () => {
  return (
    <>
      <div className='flex'>
        <BestReview />
        <RandomReview />
      </div>
      <Hot10 />
      <BookList />
      <BookList />
    </>
  );
};

export default Home;