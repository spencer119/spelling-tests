import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Home = ({ createAlert, first, setFirst, setToken }) => {
  const history = useHistory();
  const onChange = e => {
    setFirst(e.target.value);
  };

  const onClick = e => {
    e.preventDefault();
    axios
      .post('https://spelling-tests-backend.herokuapp.com/api/user', {
        name: first
      })
      .then(res => {
        setToken(res.data.token);
        history.push('/test');
      })
      .catch(err => {
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
    </div>
  );
};
export default Home;
