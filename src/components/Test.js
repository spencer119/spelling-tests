import React from 'react';
import speaker from '../speaker.png';
const Test = () => {
  const onClick = () => {
    let audio = new Audio('/audio.mp3');
    audio.play();
  };
  return (
    <div>
      <form>
        <div className='input-group'>
          <input
            className='form-control'
            placeholder='Type in the word here...'
          />
          <img src={speaker} height='50' width='50' onClick={onClick} />
        </div>
      </form>
    </div>
  );
};

export default Test;
