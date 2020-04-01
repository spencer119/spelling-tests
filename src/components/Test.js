import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Question from './Question';
import axios from 'axios';
const Test = ({ first, createAlert, gradeTest, token }) => {
  const [answers, setAnswers] = useState([]);
  const [words, setWords] = useState([]);
  const history = useHistory();
  useEffect(() => {
    axios
      .get('https://spelling-tests-backend.herokuapp.com/api/user/test', {
        headers: { token }
      })
      .then(res => {
        console.log(res.data);
        setWords(res.data.words);
      })
      .catch(err => {
        console.log(err.response);
        history.push('/');
      });
  }, []);

  const onClick = e => {
    e.preventDefault();
    let allAnswered = true;
    answers.map(ans => {
      if (ans.ans === '') {
        allAnswered = false;
        return createAlert(
          'You must try to answer each question.',
          'danger',
          8000
        );
      } else return null;
    });
    if (allAnswered) {
      console.log('test');
      gradeTest(answers);
      history.push('/done');
    }
  };
  return (
    <div className='container'>
      <strong>
        <h1 className='title'>Mrs. Hamilton's Spelling Test</h1>
      </strong>
      <h2>{first.charAt(0).toUpperCase() + first.slice(1)}</h2>
      <br />
      <h4>
        Click the speaker button to hear the word and type your answer in the
        box next to it.
      </h4>
      <form>
        {words.map(word => (
          <Question
            key={word}
            word={word}
            answers={answers}
            setAnswers={setAnswers}
          />
        ))}
        <button
          className='btn btn-primary'
          style={{ width: '100%' }}
          onClick={onClick}
          type='submit'
        >
          Submit Test
        </button>
      </form>
      <footer>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          If you have any issues taking the test, please contact{' '}
          <a href='mailto:khamilton@mdsd.org'>Mrs. Hamilton</a>
        </p>
      </footer>
    </div>
  );
};

export default Test;
