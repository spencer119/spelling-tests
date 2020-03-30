import React from 'react';
import speaker from '../speaker.png';
const Question = ({ word }) => {
  const onClick = () => {
    let audio = new Audio(`/audio/${word}.m4a`);
    audio.volume = 0.25;
    audio.play();
  };
  return (
    <div className='input-group'>
      <input className='form-control' placeholder={word} />
      <img src={speaker} className='speaker' onClick={onClick} alt='play' />
    </div>
  );
};

export default Question;
