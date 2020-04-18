import React, { useState } from 'react';
import './Teacher.css';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
const TeacherLogin = ({ createAlert, setToken }) => {
  const [password, setPassword] = useState('');
  const history = useHistory();
  const onClick = (e) => {
    e.preventDefault();
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/auth'
          : 'https://spelling-tests-backend.herokuapp.com/api/auth',
        {
          password,
        }
      )
      .then((res) => {
        setToken(res.data.token);
        history.push('/teacher');
      })
      .catch((err) => {
        createAlert(err.response.data.msg, 'danger', 5000);
      });
  };
  return (
    <div className='login-form'>
      <form>
        <h2 className='text-center'>Teacher Password</h2>
        <div className='form-group'>
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
          <button
            type='submit'
            className='btn btn-primary btn-block'
            onClick={onClick}
          >
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
