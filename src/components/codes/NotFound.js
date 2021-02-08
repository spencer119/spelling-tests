import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <div className='container text-center'>
      <h2 style={{ color: 'red' }}>404 Not Found</h2>
      <h2>The page you are looking for does not exist.</h2>
      <Link style={{ fontSize: '20px' }} to='/'>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
