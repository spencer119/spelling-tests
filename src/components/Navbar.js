import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      className='navbar navbar-dark navbar-expand-lg bg-dark'
      style={{ marginBottom: '35px' }}
    >
      <span className='navbar-brand'>Teacher Dashboard</span>
      <div className='collapse navbar-collapse'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-link'>
            <Link
              className='nav-link'
              style={{ cursor: 'pointer' }}
              to='/teacher/results'
            >
              Results
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className='nav-link'
              style={{ cursor: 'pointer' }}
              to='/teacher/tests'
            >
              Tests
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className='nav-link'
              style={{ cursor: 'pointer' }}
              to='/teacher/groups'
            >
              Groups
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className='nav-link'
              style={{ cursor: 'pointer' }}
              to='/teacher/classes'
            >
              Classes
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className='nav-link'
              style={{ cursor: 'pointer' }}
              to='/teacher/students'
            >
              Students
            </Link>
          </li>
        </ul>
        <ul className='nav justify-content-end'>
          <Link
            to='/'
            className='btn btn-danger'
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('loggedIn');
            }}
          >
            Sign Out
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
