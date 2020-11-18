import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../StudentHome.css';
import Spinner from './Spinner';

const StudentHome = () => {
  const [testId, setTestId] = useState('');
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [attempts, setAttempts] = useState(0)
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
        setAttempts(res.data.attempts)
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  if (loading) return <Spinner />
  else
  return (
    <div className=''>
      <div className='login-form' style={{}}>
        <form>
          <h2 className='text-center'>Hello {firstName}</h2>
          <div className='form-group'>
            <p className='text-center'>
              {testId === null
                ? "You don't have a test to take right now!"
                : attempts === 0 ? 'You have a test to take!' : attempts === 1 ? 'You have already taken the test but you may retake it if you want.' : 'You have reached the maximum amount of attempts for this test.'}
            </p>
            {testId === null || attempts === 2 ? null : (
              <Link
                type='submit'
                className='btn btn-primary btn-block'
                to={`/student/test?test_id=${testId}`}
              >
                Start Test
              </Link>
            )}
            <Link style={{width: '100%', marginTop: '5px'}} className='btn btn-success' to={`/student/scores`}>See Scores</Link>
            <Link
              className='btn btn-danger btn-block'
              to='/'
              onClick={onLogOut}
              style={{width: '100%', marginTop: '5px'}}
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
