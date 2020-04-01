import React, { useState } from 'react';
import '.././Admin.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const AdminLogin = ({ createAlert, setToken }) => {
  const [password, setPassword] = useState('');
  const history = useHistory();
  const onClick = e => {
    e.preventDefault();
    axios
      .post('/api/auth', { password })
      .then(res => {
        setToken(res.data.token);
        history.push('/admin');
      })
      .catch(err => {
        createAlert(err.response.data.msg, 'danger', 5000);
      });
  };
  return (
    <div className='login-form'>
      <form>
        <h2 className='text-center'>Admin Password</h2>
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
