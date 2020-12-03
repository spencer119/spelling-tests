import React, { useState } from 'react';
import './Teacher.css';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
const TeacherLogin = ({ createAlert }) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const history = useHistory();
  const onClick = (e) => {
    e.preventDefault();
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/auth/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/auth/teacher',
        {
          username,
          password,
        }
      )
      .then((res) => {
        if (res.data.firstLogin === true) {
          localStorage.setItem('token', res.data.token);
          history.push('/teacher/login/firstlogin');
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('loggedIn', 'teacher');
          history.push('/teacher/home');
        }
      });
  };
  return (
    <div className='login-form'>
      <form>
        <h2 className='text-center'>Teacher Login</h2>
        <div className='form-group'>
          <input
            className='form-control'
            placeholder='Username'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type='password'
            className='form-control'
            placeholder='Password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-primary btn-block' onClick={onClick}>
            Log in
          </button>
          <Link className='btn btn-secondary btn-block' to='/'>
            Back to home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TeacherLogin;
