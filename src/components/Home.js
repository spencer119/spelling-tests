import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home = ({ createAlert, first, last, setFirst, setLast }) => {
  const history = useHistory();
  const onChange = e => {
    if (e.target.id === 'first') {
      setFirst(e.target.value);
    } else {
      setLast(e.target.value);
    }
  };

  const onClick = e => {
    e.preventDefault();
    if (first === '' || last === '')
      return createAlert(
        'You must enter a first and last name.',
        'danger',
        5000
      );
    history.push('/test');
  };

  return (
    <div className='jumbotron'>
      <h1 className='display-4'>Hello students!</h1>
      <p className='lead'>
        Please enter your first and last name in the boxes below to begin your
        spelling test
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
          <div className='col'>
            <input
              type='text'
              autoComplete='off'
              className='form-control'
              placeholder='Please enter your last name...'
              id='last'
              value={last}
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
  );
};
export default Home;
