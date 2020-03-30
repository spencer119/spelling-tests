import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Question from './Question';
import test1words from '../test1words.json';
import test2words from '../test2words.json';
import test3words from '../test3words.json';
const Test = ({ first, test, createAlert, gradeTest }) => {
  const [answers, setAnswers] = useState([]);
  useEffect(() => {
    if (test === 1) {
      test1words.map(word =>
        setAnswers(answers => [...answers, { word, ans: '' }])
      );
    } else if (test === 2) {
      test2words.map(word =>
        setAnswers(answers => [...answers, { word, ans: '' }])
      );
    } else if (test === 3) {
      test3words.map(word =>
        setAnswers(answers => [...answers, { word, ans: '' }])
      );
    }
  }, [test]);
  const history = useHistory();
  if (first === '' || test === 0) {
    history.push('/');
    return <Fragment />;
  }
  const onClick = e => {
    e.preventDefault();
    let allAnswered = false;
    answers.map(ans => {
      if (ans.ans === '')
        return createAlert(
          'You must try to answer each question.',
          'danger',
          8000
        );
      else return (allAnswered = true);
    });
    if (allAnswered) {
      gradeTest(answers);
    }
  };
  return (
    <div>
      <h2>{first.charAt(0).toUpperCase() + first.slice(1)}</h2>
      <br />
      <form>
        {test === 1
          ? test1words.map(word => (
              <Question
                key={word}
                word={word}
                answers={answers}
                setAnswers={setAnswers}
              />
            ))
          : test === 2
          ? test2words.map(word => (
              <Question
                key={word}
                word={word}
                answers={answers}
                setAnswers={setAnswers}
              />
            ))
          : test === 3
          ? test3words.map(word => (
              <Question
                key={word}
                word={word}
                answers={answers}
                setAnswers={setAnswers}
              />
            ))
          : null}
        <button
          className='btn btn-primary'
          style={{ width: '100%' }}
          onClick={onClick}
          type='submit'
        >
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default Test;
