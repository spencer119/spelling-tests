import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Question from './Question';
import axios from 'axios';
const Test = () => {
  const [answers, setAnswers] = useState([]);
  const [words, setWords] = useState([]);
  const history = useHistory();
  const [testlines, setTestLines] = useState([]);
  const token = useRef(localStorage.getItem('token'));
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const test_id = query.get('test_id');
  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? `/api/student/test?test_id=${test_id}`
          : `https://spelling-tests-backend.herokuapp.com/api/student/test?test_id=${test_id}`,
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        console.log(res.data);
        setTestLines(res.data.testlines);
      })
      .catch((err) => {});
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    // let allAnswered = true;
    // answers.map((ans) => {
    //   if (ans.ans === '') {
    //     allAnswered = false;
    //     return createAlert(
    //       'You must try to answer each question.',
    //       'danger',
    //       8000
    //     );
    //   } else return null;
    // });
    // if (allAnswered) {
    //   gradeTest(answers)
    //     .then(() => {
    //       history.push('/done');
    //     })
    //     .catch((err) =>
    //       createAlert(
    //         'There was an error saving your test. Please try again.',
    //         'danger',
    //         5000
    //       )
    //     );
    // }
  };
  return (
    <div className='container'>
      <strong>
        <h1 className='title'>BRMES Online Spelling Test</h1>
      </strong>
      <h2></h2>
      <br />
      <h1>Instructions</h1>
      <h4>
        Click the speaker button to hear your spelling word. Then, type your
        spelling word in the box. You MUST put a word in every box. When you are
        finished click the All Done button.
      </h4>
      <form>
        {/* {words.map((word) => (
          <Question
            key={word}
            word={word}
            answers={answers}
            setAnswers={setAnswers}
          />
        ))} */}
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
