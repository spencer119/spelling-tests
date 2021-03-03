import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = useRef(localStorage.getItem('token'));
  useEffect(() => {
    console.log(window.location.pathname);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/auth/admin'
          : 'https://spelling-tests-backend.herokuapp.com/api/auth/admin',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        console.log(res.data);
        setIsAdmin(res.data);
      })
      .catch(() => {
        setIsAdmin(false);
      });
  });
  return (
    <nav className='navbar navbar-dark navbar-expand-lg bg-dark' style={{ marginBottom: '35px' }}>
      <span className='navbar-brand'>{isAdmin ? 'Admin Dashboard' : 'Teacher Dashboard'}</span>
      <div className='collapse navbar-collapse'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-link'>
            <Link
              className={`nav-link ${
                window.location.pathname.includes('/teacher/home') ? 'active' : ''
              }`}
              style={{ cursor: 'pointer' }}
              to='/teacher/home'
            >
              Home
            </Link>
          </li>
          <li
            className={`nav-link ${
              window.location.pathname.includes('/teacher/results') ? 'active' : ''
            }`}
          >
            <Link className='nav-link' style={{ cursor: 'pointer' }} to='/teacher/results'>
              Results
            </Link>
          </li>
          <li
            className={`nav-link ${
              window.location.pathname.includes('/teacher/export') ? 'active' : ''
            }`}
          >
            <Link className='nav-link' style={{ cursor: 'pointer' }} to='/teacher/reports'>
              Reports/Export
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className={`nav-link ${
                window.location.pathname.includes('/teacher/tests') ? 'active' : ''
              }`}
              style={{ cursor: 'pointer' }}
              to='/teacher/tests'
            >
              Tests
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className={`nav-link ${
                window.location.pathname.includes('/teacher/classes') ? 'active' : ''
              }`}
              style={{ cursor: 'pointer' }}
              to='/teacher/classes'
            >
              Classes
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className={`nav-link ${
                window.location.pathname.includes('/teacher/students') ? 'active' : ''
              }`}
              style={{ cursor: 'pointer' }}
              to='/teacher/students'
            >
              Students
            </Link>
          </li>
          <li className='nav-link'>
            <Link
              className={`nav-link ${
                window.location.pathname.includes('/feedback') ? 'active' : ''
              }`}
              style={{ cursor: 'pointer' }}
              to={`/${isAdmin ? 'admin' : 'teacher'}/feedback`}
            >
              Feedback/Support
            </Link>
          </li>
          {isAdmin ? (
            <Fragment>
              <li className='nav-link'>
                <Link
                  className={`nav-link ${
                    window.location.pathname.includes('/admin/teachers') ? 'active' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  to='/admin/teachers'
                >
                  Manage Teachers
                </Link>
              </li>
            </Fragment>
          ) : null}
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
