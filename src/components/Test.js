import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Question from './Question';
import test1words from '../test1words.json';
import test2words from '../test2words.json';
import test3words from '../test3words.json';
const Test = ({ first, test }) => {
  const history = useHistory();
  if (first === '' || test === 0) {
    history.push('/');
    return <Fragment />;
  }
  console.log(test);
  return (
    <div>
      <h2>{first.charAt(0).toUpperCase() + first.slice(1)}</h2>
      <br />
      <form>
        {test === 1
          ? test1words.map(word => <Question key={word} word={word} />)
          : test === 2
          ? test2words.map(word => <Question key={word} word={word} />)
          : test === 3
          ? test3words.map(word => <Question key={word} word={word} />)
          : null}
        <button className='btn btn-primary' style={{ width: '100%' }}>
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default Test;
