import React from 'react';
import { Link } from 'react-router-dom';

const StudentHome = () => {
  return (
    <div className='container'>
      <Link
        className='btn btn-danger'
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('loggedIn');
        }}
        to='/'
      >
        Sign Out
      </Link>
      Student Home page
      <br />
      token: {localStorage.getItem('token')}
    </div>
  );
};
export default StudentHome;
