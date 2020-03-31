import React, { useState } from 'react';
import speaker from '../speaker.png';
const Question = ({ word, answers, setAnswers }) => {
  const [value, setValue] = useState('');
  const onClick = () => {
    let audio = new Audio(`/audio/${word}.m4a`);
    audio.volume = 0.25;
    audio.play();
  };
  const onChange = e => {
    setValue(e.target.value);
    let newAnswers = answers;
    newAnswers.map(ans => {
      if (ans.word === word) {
        return (ans.ans = e.target.value);
      } else return null;
    });
    setAnswers(newAnswers);
  };
  return (
    <div className='input-group'>
      <img src={speaker} style={{position: 'relative', bottom: '5px'}} className='speaker' onClick={onClick} alt='play' />
      <input className='form-control' value={value} onChange={onChange} />
    </div>
  );
};

export default Question;
