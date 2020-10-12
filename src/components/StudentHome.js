import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../StudentHome.css';
import Spinner from './Spinner';

const StudentHome = () => {
  const [testId, setTestId] = useState('');
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const token = useRef(localStorage.getItem('token'));
  const onLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/student/testId'
          : 'https://spelling-tests-backend.herokuapp.com/api/student/testId',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        setTestId(res.data.test_id);
        setFirstName(res.data.first_name);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  return (
    <div className='background-image'>
      <div className='login-form' style={{}}>
        <form>
          <h2 className='text-center'>Hello {firstName}</h2>
          <div className='form-group'>
            <p className='text-center'>
              {testId === null
                ? "You don't have a test to take right now!"
                : 'You have a test to take!'}
            </p>
            {testId === null ? null : (
              <Link
                type='submit'
                className='btn btn-primary btn-block'
                to={`/student/test?test_id=${testId}`}
              >
                Start Test
              </Link>
            )}

            <Link
              className='btn btn-danger btn-block'
              to='/'
              onClick={onLogOut}
            >
              Log out
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default StudentHome;
