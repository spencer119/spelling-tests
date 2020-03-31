import React, { useState } from 'react';
import '.././Admin.css';
import axios from 'axios';
const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onClick = e => {
    e.preventDefault();
    axios.post('/api/auth', { username, password }).then(res => {
      console.log(res);
    });
  };
  return (
    <div className='login-form'>
      <form>
        <h2 className='text-center'>Admin Log in</h2>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Username'
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Password'
            value={password}
            onChange={e => {
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
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
