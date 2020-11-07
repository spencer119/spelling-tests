import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

const Home = ({ createAlert }) => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setUsername(e.target.value);
  };
  useEffect(() => {
    if (localStorage.getItem('loggedIn') === null) return;
    else if (localStorage.getItem('token') === null) return;
    else if (localStorage.getItem('loggedIn') === 'student')
      history.push('/student/home');
    else if (localStorage.getItem('loggedIn') === 'teacher')
      history.push('/teacher/results');
  }, []);
  const onClick = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/auth/student'
          : 'https://spelling-tests-backend.herokuapp.com/api/auth/student',
        {
          username,
        }
      )
      .then((res) => {
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('loggedIn', 'student');
        history.push('/student/home');
      })
      .catch((err) => {
        if (err.response.data.maintenance) {
          return history.push('/maintenance');
        }
        setLoading(false);
        createAlert(
          'Please double check you have typed in your username correctly.',
          'danger',
          5000
        );
        console.log(err);
        console.log(err.response);
      });
  };
  if (loading) return <Spinner />;
  else
    return (
      <div>
        <Link
          className='btn btn-primary'
          style={{ float: 'right', marginRight: '50px' }}
          to='/teacher/login'
        >
          Log in as Teacher
        </Link>
        <div className='container'>
          <strong>
            <h1 className='title'>BRMES Online Spelling Test</h1>
          </strong>
          <div className='jumbotron'>
            <h1 className='display-4'>Hello students!</h1>
            <p className='lead'>
              Please enter your username in the box below and then click Start
              Test.
            </p>
            <form>
              <div className='row'>
                <div className='col'>
                  <input
                    type='text'
                    autoComplete='off'
                    className='form-control'
                    placeholder='Enter your username'
                    id='username'
                    value={username}
                    onChange={onChange}
                  />
                </div>
              </div>
              <button
                style={{ marginTop: '20px', width: '100%' }}
                className='btn btn-primary'
                onClick={onClick}
                type='submit'
              >
                Start Test
              </button>
            </form>
          </div>
        </div>
      </div>
    );
};
export default Home;
