import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Spinner from '../Spinner';
import speaker from '../../speaker.png'
const Tests = ({ createAlert }) => {
  const [tests, setTests] = useState([]);
  const [files, setFiles] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestWords, setNewTestWords] = useState('');
  const [newTestArr, setNewTestArr] = useState([])
  const [attempts, setAttempts] = useState(1)
  const [testlines, setTestlines] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filetype, setFiletype] = useState('m4a')
  const token = useRef(localStorage.getItem('token'));
  const [disable, setDisable] = useState(false)
  const onNameChange = (e) => {
    setNewTestName(e.target.value);
  };
  const onWordChange = (e) => {
    setNewTestWords(e.target.value.replace(' ', '').toLowerCase());
  };
  const getTests = () => {
    setLoading(true);
    let userToken = token.current;
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/tests'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
        {
          headers: { token: userToken },
        }
      )
      .then((res) => {
        let notArchived = [];
        res.data.tests.map(t => t.archived ? null : notArchived.push(t))
        setTests(notArchived);
        setTestlines(res.data.testlines);
        setLoading(false);
      })
      .catch(() => {});
  };
  const onClick = () => {
    setDisable(true)
    let words = newTestWords.split('\n');
    if (words.includes('')) {
      let index = words.indexOf('');
      words.splice(index, 1);
    }
    let data = new FormData();
    for (var x = 0; x < files.length; x++) {
      data.append('file', files[x]);
    }
    data.append('name', newTestName);
    data.append('filetype', filetype)
    data.append('words', words)
    data.append('attempts', attempts)
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/tests'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
        data,
        { headers: { token: token.current } }
      )
      .then((res) => {
        setShowModal(false);
        getTests()
        createAlert('Test created successfully.', 'success', 5000);
        setDisable(false)
      }).catch(err => {
        setDisable(false)
        alert(err.response.data.msg)
      });
  };
  const deleteTest = (e) => {
    axios
      .delete(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/tests'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
        {
          headers: {
            token: token.current,
          },
          data: {
            test: e.target.parentElement.parentElement.id,
          },
        }
      )
      .then(() => {
        createAlert('Test deleted successfully!', 'success', 5000)
        getTests();
      }).catch(() => {
        createAlert('An error has occured.', 'danger', 5000)
      });
  };
  const viewTest = (e) => {
    console.log(e.target.parentElement.parentElement.id)
    let viewArr = [];
    testlines.map(line => {
      if (line.test_id === e.target.parentElement.parentElement.id) viewArr.push(line)
    })
    setViewModal(true)
    return setViewInfo(viewArr)
  };
  const onPlay = (e) => {
    let audio = new Audio(e.target.id);
    audio.volume = 0.25;
    audio.play();
  }
  useEffect(() => {
    getTests();
  }, []);
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='container'>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create new test</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label>Enter a test name:</label>
              <input
                className='form-control'
                value={newTestName}
                onChange={onNameChange}
              />
              <label>
                Enter the words for the test in the box below. Seperate each
                word by pressing enter and creating a new line. Make sure you don't create an extra enter at the end. <br />Next, upload a audio file for each word at the bottom.
              </label>
              <input onChange={onWordChange} className='form-control' />
              {/* <textarea
                className='form-control'
                rows='15'
                value={newTestWords}
                onChange={onWordChange}
              ></textarea> */}
              <p>{newTestWords === '' ? '0' : newTestWords.split('\n').length} words</p>
              <br />
    <label for="formControlRange">{attempts} Attempt{attempts > 1 ? 's' : null}</label>
    <input type="range" min='1' value={attempts} max='10' onChange={(e) => setAttempts(e.target.value)} className="form-control-range" id="formControlRange"></input>
              <br />
              <p><strong>**All audio files must be in an .mp3 or .m4a format, select your format below, and the name of the file must be the same as the word**</strong> <br />For example, the word cat would be uploaded with "cat.mp3"</p>
              <input type='file' onChange={(e) => setFiles(e.target.files)} multiple />
              <ul className="list-group list-group-horizontal" style={{marginTop: '10px'}}>
  <li className={filetype === 'mp3' ? 'list-group-item active' : 'list-group-item'} onClick={() => setFiletype('mp3')} style={{cursor: 'pointer'}}>.mp3</li>
  <li className={filetype === 'm4a' ? 'list-group-item active' : 'list-group-item'} onClick={() => setFiletype('m4a')} style={{cursor: 'pointer'}}>.m4a</li>
</ul>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              className='btn btn-danger'
              onClick={() => setShowModal(false)}
              disabled={disable ? true : false}
            >
              Cancel
            </button>
            <button className='btn btn-success' onClick={onClick} disabled={files.length !== newTestWords.split('\n').length || disable ? true : false}>
              Create test
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={viewModal} onHide={() => setViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View test</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewInfo.map((word) => (
              <p>{word.word}       <img
              src={speaker}
              id={word.audio_path}
              style={{ position: 'relative' }}
              className='speaker'
              onClick={onPlay}
              alt='play'
            /></p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <button
              className='btn btn-danger'
              onClick={() => {
                setViewModal(false);
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <p>
          To create a new test click the button below and follow the
          instructions.
        </p>
        <button
          className='btn btn-primary'
          style={{ width: '100%', marginBottom: '25px' }}
          onClick={() => setShowModal(true)}
        >
          Create new test
        </button>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Test</th>
              <th scope='col'>Edit</th>
              <th scope='col'>Archive</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => {
              return (
                <tr key={test.test_name} id={test.test_id}>
                  <td>{test.test_name}</td>
                  <td>
                    <button className='btn btn-info' onClick={viewTest}>
                      View
                    </button>
                  </td>
                  <td>
                    <button className='btn btn-danger' onClick={deleteTest}>
                      Archive
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Tests;
