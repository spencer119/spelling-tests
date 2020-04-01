import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ active, setActive }) => {
  const onClick = e => {
    setActive(e.target.id);
  };
  return (
    <nav
      className='navbar navbar-dark navbar-expand-lg bg-dark'
      style={{ marginBottom: '35px' }}
    >
      <span className='navbar-brand'>Admin Dashboard</span>
      <div className='collapse navbar-collapse'>
        <ul className='navbar-nav mr-auto'>
          <li className={`nav-link ${active === 'results' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='results'
              onClick={onClick}
            >
              Results
            </span>
          </li>
          <li className={`nav-link ${active === 'tests' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='tests'
              onClick={onClick}
            >
              Manage Tests
            </span>
          </li>
          <li className={`nav-link ${active === 'students' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='students'
              onClick={onClick}
            >
              Manage Students
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
