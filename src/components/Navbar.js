import React, {useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const token = useRef(localStorage.getItem('token'))
  useEffect(() => {
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
      console.log(res.data)
      setIsAdmin(res.data)
    })
    .catch(() => {
      setIsAdmin(false)
    });
  })
  return (
    <nav
      className='navbar navbar-dark navbar-expand-lg bg-dark'
      style={{ marginBottom: '35px' }}
    >
      <span className='navbar-brand'>{isAdmin ? 'Admin Dashboard': "Teacher Dashboard"}</span>
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
          {isAdmin ? (<li className='nav-link'>
            <Link
              className='nav-link'
              style={{ cursor: 'pointer' }}
              to='/admin/teacher/create'
            >
              Add Teacher
            </Link>
          </li>) : null }
          
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
