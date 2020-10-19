import React, {useState, useRef} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const FirstLogin = ({createAlert}) => {
  const token = useRef(localStorage.getItem('token'))
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const history = useHistory();
    const onClick = e => {
      e.preventDefault();
      if (password !== confirmPassword) {
        return createAlert('Your passwords do not match.', 'danger', 5000)
      } else if (password.length < 6) return createAlert('Your password must be atleast 6 characters.')
      else {
        axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/auth/teacher/change/password'
          : 'https://spelling-tests-backend.herokuapp.com/api/auth/teacher/change/password',
        {
          password
        }, {headers: {token: token.current}}
      )
      .then((res) => {
        history.push('/teacher/login');
        localStorage.removeItem('token')
        createAlert('Password created! Please log in again.', 'success', 5000)

      })
      .catch((err) => {
        createAlert(err.response.data.msg, 'danger', 5000)
      });
      }
    }
    return (
        <div className='login-form'>
      <form autoComplete='off'>
        <h2 className='text-center'>Create your password</h2>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            placeholder='New Password'
            value={password}
            autoComplete='new-password'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type='password'
            className='form-control'
            placeholder='Confirm Password'
            value={confirmPassword}
            autoComplete='new-password'
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <button
            type='submit'
            className='btn btn-primary btn-block'
            onClick={onClick}
          >
            Create Password
          </button>
        </div>
      </form>
    </div>
    )
}

export default FirstLogin
