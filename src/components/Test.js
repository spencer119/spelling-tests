import React, { Fragment } from 'react';
import speaker from '../speaker.png';
import { useHistory } from 'react-router-dom';
const Test = ({ first, last }) => {
  const history = useHistory();
  if (first === '' || last === '') {
    history.push('/');
    return <Fragment />;
  }
  const onClick = () => {
    let audio = new Audio('/audio.mp3');
    audio.play();
  };
  return (
    <div>
      <h2>
        Current Test Session: {first} {last}
      </h2>
      <br />
      <form>
        <div className='input-group'>
          <input
            className='form-control'
            placeholder='Type in the word here...'
          />
          <img src={speaker} className='speaker' onClick={onClick} />
        </div>
        <div className='input-group'>
          <input className='form-control' />
          <img src={speaker} className='speaker' onClick={onClick} />
        </div>
        <button className='btn btn-primary' style={{ width: '100%' }}>
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default Test;
