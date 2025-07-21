// src/pages/Home.tsx
import React from 'react';
import OnlyMain from '../components/OnlyMain';
import BookList from '../components/BookList';

const Home = () => {
  return (
    <>
      <OnlyMain />
      <BookList slides={[]} />
      <BookList slides={[]} />
    </>
  );
};

export default Home;