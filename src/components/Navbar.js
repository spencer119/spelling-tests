import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ active, setActive }) => {
  const onClick = (e) => {
    setActive(e.target.id);
  };
  return (
    <nav
      className='navbar navbar-dark navbar-expand-lg bg-dark'
      style={{ marginBottom: '35px' }}
    >
      <span className='navbar-brand'>Teacher Dashboard</span>
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
          <li className={`nav-link ${active === 'groups' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='groups'
              onClick={onClick}
            >
              Manage Groups
            </span>
          </li>
          <li className={`nav-link ${active === 'upload' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='upload'
              onClick={onClick}
            >
              Upload Audio Files
            </span>
          </li>
          <li className={`nav-link ${active === 'classes' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='classes'
              onClick={onClick}
            >
              Classes
            </span>
          </li>
          <li className={`nav-link ${active === 'students' ? 'active' : ''}`}>
            <span
              className='nav-link'
              style={{ cursor: 'pointer' }}
              id='students'
              onClick={onClick}
            >
              Students
            </span>
          </li>
        </ul>
        <ul className='nav justify-content-end'>
          <Link to='/' className='btn btn-danger'>
            Sign Out
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
