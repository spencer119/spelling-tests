import axios from 'axios';
import React, { Fragment, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import Spinner from '../../Spinner';
const CreateTest = ({ createAlert }) => {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [testName, setTestName] = useState('');
  const [record, setRecord] = useState(false);
  const [audio, setAudio] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [files, setFiles] = useState([]);
  const history = useHistory();
  const token = useRef(localStorage.getItem('token'));
  const {
    startRecording,
    stopRecording,
    clearBlobUrl,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: false,
  });
  const onWordCountChange = (e) => {
    let newWordArr = [];
    for (let i = 0; i < e.target.value; i++) {
      newWordArr.push({ number: i + 1, word: '', audio: '' });
    }
    setWordCount(e.target.value);
    setWords(newWordArr);
  };
  const onWordChange = (e) => {
    let found = words.find((word) => word.number === parseInt(e.target.id));
    found.word = e.target.value;
    let newArr = words.filter((word) => word.number !== parseInt(e.target.id));
    newArr.push(found);
    newArr.sort((a, b) => {
      return a.number - b.number;
    });
    setWords(newArr);
  };
  const onRecord = (e) => {
    if (record) {
      // Stop recording
      setRecord(false);
      stopRecording();
    } else {
      // start recording
      setRecord(true);
      startRecording();
    }
  };
  const confirmAudio = (e) => {
    if (mediaBlobUrl === null)
      return alert(
        'You must record audio to save first. Click the microphone icon below.'
      );
    let newValue = words.find((word) => word.number.toString() === e.target.id);
    newValue.audio = mediaBlobUrl;
    let wordArr = words.filter(
      (word) => word.number.toString() !== e.target.id
    );
    wordArr.push(newValue);
    wordArr.sort((a, b) => {
      return a.number - b.number;
    });
    setWords(wordArr);
    console.log(mediaBlobUrl);
    clearBlobUrl();
  };
  const createTest = async (e) => {
    // Check that all info is entered
    let notDone = false;
    if (testName === '')
      return createAlert('Your test needs a name!', 'danger', 5000);
    if (attempts === 0)
      return createAlert(
        'Please specify a number of attempts. You can always change this later.',
        'danger',
        5000
      );
    words.forEach((w) => {
      if (w.word === '') {
        notDone = true;
        createAlert('One or more word entries is missing.', 'danger', 5000);
      } else if (w.audio === '') {
        notDone = true;
        createAlert('One or more word is missing audio.', 'danger', 5000);
      }
    });
    if (notDone) return;
    else {
      setLoading(true);
      let data = new FormData();
      let wordArr = [];
      words.map((word) => {
        wordArr.push(word.word);
      });
      data.append('words', wordArr);
      data.append('testName', testName);
      data.append('attempts', attempts);
      const files = await Promise.all(
        words.map((word) => {
          return fetch(word.audio)
            .then((res) => res.blob())
            .then((blob) => new File([blob], `${word.word}.wav`));
        })
      );
      files.forEach((file) => data.append('file', file));

      axios
        .post(
          process.env.NODE_ENV === 'development'
            ? '/api/v2/teacher/tests/create'
            : 'https://spelling-tests-backend.herokuapp.com/api/v2/teacher/tests/create',
          data,
          { headers: { token: token.current, words } }
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          history.push('/teacher/tests');
          createAlert('Test created successfully!', 'success', 5000);
        })
        .catch((err) => {
          setLoading(false);
          createAlert(
            'An error has occured, please try again.',
            'danger',
            5000
          );
        });
    }
  };
  const deleteAudio = (e) => {
    let newValue = words.find((word) => word.number.toString() === e.target.id);
    newValue.audio = '';
    let wordArr = words.filter(
      (word) => word.number.toString() !== e.target.id
    );
    wordArr.push(newValue);
    wordArr.sort((a, b) => {
      return a.number - b.number;
    });
    setWords(wordArr);
  };
  if (loading) return <Spinner />;
  else
    return (
      <div className='container'>
        <div className='text-center'>
          <Link
            to='/teacher/tests'
            style={{ marginBottom: '10px' }}
            className='btn btn-primary'
          >
            Go back
          </Link>
          <br />
          {/* <Link className='text-center' to='/teachers/tests/create/tutorial'>
            Click here to see a tutorial on how to create a test.
          </Link>*/}
        </div>
        <h3>How to Create a Test:</h3>
        <ul>
          <li>
            Give the test a name, amount of words, and amount of attempts.
          </li>
          <li>
            Type the words out in the boxes provided. (Words are case sensitive)
          </li>
          <li>
            Click the microphone button to start recording. Click it again to
            stop.
          </li>
          <li>
            After recording your word, click the "Save Audio" button next to the
            corresponding word.
          </li>
          <li>After all audio is recorded, click "Create Test"</li>
        </ul>
        <div className='row'>
          <div className='col-10'>
            <label>Enter a test name</label>
            <input
              type='text'
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder='Test name'
              className='form-control'
            />
          </div>
          <div className='col-2'>
            <label>How many words?</label>
            <input
              value={wordCount}
              onChange={onWordCountChange}
              type='number'
              placeholder='# of words'
              className='form-control'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-10'></div>
          <div className='col-2'>
            <label>How many attempts?</label>
            <input
              value={attempts}
              onChange={(e) => setAttempts(e.target.value)}
              type='number'
              placeholder='# of attempts'
              className={``}
            />
          </div>
        </div>
        {wordCount === 0 ? null : (
          <div className='text-center word-margin'>
            {mediaBlobUrl === null ? (
              <i
                className='fas fa-microphone fa-5x text-center'
                style={{ margin: '10px', cursor: 'pointer' }}
                onClick={onRecord}
              ></i>
            ) : (
              <Fragment>
                <audio src={mediaBlobUrl} controls></audio>
                <br />
                <button
                  className='btn btn-danger'
                  onClick={() => clearBlobUrl()}
                >
                  Discard
                </button>
              </Fragment>
            )}

            {record ? (
              <Fragment>
                <p>Recording...</p>
                <p>Click again to stop.</p>
              </Fragment>
            ) : mediaBlobUrl !== null ? (
              <p>Audio ready to save.</p>
            ) : (
              <p>Click to start a new recording.</p>
            )}
          </div>
        )}

        {words.map((word) => (
          <div key={word.number} id={word.number} className='row word-margin'>
            <div className='col-6'>
              <input
                type='text'
                id={word.number}
                className='form-control'
                onChange={onWordChange}
                placeholder={audio[word.number]}
              />
            </div>
            <div className='col-6'>
              <div className='row'>
                {words.find((w) => w.number === word.number).audio === '' ? (
                  <Fragment>
                    <div className='col'>
                      <button
                        id={word.number}
                        onClick={confirmAudio}
                        className='btn btn-success'
                      >
                        Save Audio
                      </button>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className='col'>
                      <audio src={word.audio} controls></audio>
                    </div>
                    <div className='col'>
                      <button
                        className='btn btn-danger'
                        id={word.number}
                        onClick={deleteAudio}
                      >
                        Delete
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        ))}
        {wordCount !== 0 ? (
          <div className='row word-margin'>
            <button
              style={{ width: '100%' }}
              onClick={createTest}
              className='btn btn-success'
            >
              Create Test
            </button>
          </div>
        ) : null}
      </div>
    );
};

export default CreateTest;
