// src/pages/Home.tsx
import React from 'react';
import BestReview from '../components/main/BestReview';
import RandomReview from '../components/main/RandomReview';
import Hot10 from '../components/main/Hot10';
import BookList from '../components/BookList';

const Home = () => {
  return (
    <div className='flex flex-col gap-12 md:gap-24'>
      <div className='flex flex-col gap-4 lg:flex-row'>
        <BestReview />
        <RandomReview />
      </div>
      <Hot10 />
      <BookList />
      <BookList />
    </div>
  );
};

export default Home;