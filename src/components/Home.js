import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import spinner from '../spinner.gif';

const Home = ({ createAlert, first, setFirst, setToken }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setFirst(e.target.value.replace(' ', '').toLowerCase());
  };

  const onClick = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post('https://spelling-tests-backend.herokuapp.com/api/user', {
        name: first.toLowerCase(),
      })
      .then((res) => {
        setLoading(false);
        setToken(res.data.token);
        history.push('/test');
      })
      .catch((err) => {
        setLoading(false);
        createAlert(
          'Please double check you have typed in your name correctly.',
          'danger',
          5000
        );
        console.log(err);
        console.log(err.response);
      });
  };

  return (
    <div className='container'>
      <strong>
        <h1 className='title'>Mrs. Hamilton's Spelling Test</h1>
      </strong>
      <div className='jumbotron'>
        <h1 className='display-4'>Hello students!</h1>
        <p className='lead'>
          Please enter your name in the box below to begin your spelling test
        </p>
        <form>
          <div className='row'>
            <div className='col'>
              <input
                type='text'
                autoComplete='off'
                className='form-control'
                placeholder='Please enter your first name...'
                id='first'
                value={first}
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
            Begin Test
          </button>
        </form>
      </div>
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            fontSize: '50px',
          }}
        >
          Loading
          <img
            src={spinner}
            alt='Loading...'
            style={{
              width: '200px',
              margin: 'auto',
              display: 'block',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
export default Home;
