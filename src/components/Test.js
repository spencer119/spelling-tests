import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Spinner from './Spinner';
import speaker from '../speaker.png';
import axios from 'axios';
const Test = ({ createAlert }) => {
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState([]);
  const history = useHistory();
  const [canPlay, setCanPlay] = useState(true);
  const [testlines, setTestlines] = useState([]);
  const token = useRef(localStorage.getItem('token'));
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const test_id = query.get('test_id');
  useEffect(() => {
    setLoading(true);
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
        setTestlines(res.data.testlines);
        let dataArr = [];
        res.data.testlines.map((line) => {
          dataArr.push({ word: line.word, ans: '' });
        });
        setTestData(dataArr);
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

  const onPlay = (e) => {
    if (canPlay) {
      setCanPlay(false);
      let audio = new Audio(e.target.id);
      audio.volume = 0.25;
      audio.play();
      setTimeout(() => setCanPlay(true), 5000);
    } else return;
  };

  const onChange = (e) => {
    let newData = testData;
    newData.map((d) => {
      if (d.word === e.target.id) d.ans = e.target.value;
    });
    setTestData(newData);
  };

  const onClick = (e) => {
    e.preventDefault();
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/student/test/submit'
          : 'https://spelling-tests-backend.herokuapp.com/api/student/test/submit',
        { testData, test_id },
        { headers: { token: token.current } }
      )
      .then((res) => {
        createAlert('Submitted', 'success', 5000);
        history.push('/student/home');
      })
      .catch((err) => {
        createAlert(
          'Uh oh! There was an error submitting your test. Please try again.'
        );
      });
  };
  if (loading) return <Spinner />;
  else
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
          spelling word in the box. You MUST put a word in every box. When you
          are finished click the All Done button.
        </h4>
        <form>
          {testlines.map((line) => (
            <div className='input-group'>
              <img
                src={speaker}
                style={{ position: 'relative', bottom: '5px' }}
                className='speaker'
                id={line.audio_path}
                onClick={onPlay}
                alt='play'
              />
              <input
                className='form-control'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                id={line.word}
                onChange={onChange}
              />
            </div>
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
