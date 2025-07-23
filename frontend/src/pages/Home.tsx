// src/pages/Home.tsx
import React from 'react';
import BestReview from '../components/main/BestReview';
import RandomReview from '../components/main/RandomReview';
import Hot10 from '../components/main/Hot10';
import BookList from '../components/BookList';

const Home = () => {
  return (
    <>
      <div>
        <div>
          <BestReview />
          <RandomReview />
        </div>
        <Hot10 />
      </div>
      <BookList />
      {/* <BookList /> */}
    </>
  );
};

export default Home;