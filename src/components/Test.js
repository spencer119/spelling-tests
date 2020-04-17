import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Question from './Question';
import axios from 'axios';
const Test = ({ first, createAlert, gradeTest, token, setTestName }) => {
  const [answers, setAnswers] = useState([]);
  const [words, setWords] = useState([]);
  const history = useHistory();
  useEffect(() => {
    axios
      .get('https://spelling-tests-backend.herokuapp.com/api/user/test', {
        headers: { token },
      })
      .then((res) => {
        setTestName(res.data.testName);
        setWords(res.data.test.words);
        res.data.test.words.map((word) => {
          setAnswers((answers) => [...answers, { word, ans: '' }]);
        });
      })
      .catch((err) => {
        console.log(err.response);
        history.push('/');
      });
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    let allAnswered = true;
    answers.map((ans) => {
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
      gradeTest(answers)
        .then(() => {
          history.push('/done');
        })
        .catch((err) =>
          createAlert(
            'There was an error saving your test. Please try again.',
            'danger',
            5000
          )
        );
    }
  };
  return (
    <div className='container'>
      <strong>
        <h1 className='title'>Mrs. Hamilton's Spelling Test</h1>
      </strong>
      <h2>{first.charAt(0).toUpperCase() + first.slice(1)}</h2>
      <br />
      <h1>Instructions</h1>
      <h4>
        Click the speaker button to hear your spelling word. Then, type your
        spelling word in the box. You MUST put a word in every box. When you are
        finished click the All Done button.
      </h4>
      <form>
        {words.map((word) => (
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
          All Done
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
