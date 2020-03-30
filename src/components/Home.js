import React from 'react';
import { useHistory } from 'react-router-dom';
import test1 from '../test1.json';
import test2 from '../test2.json';
import test3 from '../test3.json';

const Home = ({ createAlert, first, setFirst, setTest }) => {
  const history = useHistory();
  const onChange = e => {
    setFirst(e.target.value);
  };

  const onClick = e => {
    e.preventDefault();
    if (first === '')
      return createAlert('You must enter your name', 'danger', 5000);
    if (test1.includes(first.toLowerCase())) {
      setTest(1);
      history.push('/test');
    } else if (test2.includes(first.toLowerCase())) {
      setTest(2);
      history.push('/test');
    } else if (test3.includes(first.toLowerCase())) {
      setTest(3);
      history.push('/test');
    } else {
      return createAlert(
        'Please double check you have entered your name correctly and try again.',
        'danger',
        5000
      );
    }
  };

  return (
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
  );
};
export default Home;
