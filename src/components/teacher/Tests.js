import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Spinner from '../Spinner';
import speaker from '../../speaker.png';
const Tests = ({ createAlert }) => {
  const [tests, setTests] = useState([]);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestWords, setNewTestWords] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [testlines, setTestlines] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filetype, setFiletype] = useState('m4a');
  const token = useRef(localStorage.getItem('token'));
  const [disable, setDisable] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [showArchived, setShowArchived] = useState(false);

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
        setTests(res.data.tests);
        setTestlines(res.data.testlines);
        setLoading(false);
      })
      .catch(() => {});
  };
  const onClick = () => {
    setDisable(true);
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
    data.append('filetype', filetype);
    data.append('words', words);
    data.append('attempts', attempts);
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
        getTests();
        createAlert('Test created successfully.', 'success', 5000);
        setDisable(false);
      })
      .catch((err) => {
        setDisable(false);
        alert(err.response.data.msg);
      });
  };
  const archiveTest = (e) => {
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
            archive: true,
            test: e.target.parentElement.parentElement.id,
          },
        }
      )
      .then(() => {
        createAlert('Test archived successfully!', 'success', 5000);
        getTests();
      })
      .catch(() => {
        createAlert('An error has occured.', 'danger', 5000);
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
            archive: false,
          },
        }
      )
      .then(() => {
        createAlert('Test deleted successfully!', 'success', 5000);
        getTests();
      })
      .catch(() => {
        createAlert('An error has occured.', 'danger', 5000);
      });
  };
  const unArchiveTest = (e) => {
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/test/unarchive'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/test/unarchive',
        { test: e.target.parentElement.parentElement.id },
        { headers: { token: token.current } }
      )
      .then((res) => {
        getTests();
        createAlert('Test unarchived!', 'success', 5000);
      });
  };
  const viewTest = (e) => {
    console.log(e.target.id);
    setEditId(e.target.id);
    setEditName(e.target.getAttribute('testName'));
    let viewArr = [];
    testlines.map((line) => {
      if (line.test_id === e.target.parentElement.parentElement.id)
        viewArr.push(line);
    });
    setViewModal(true);
    return setViewInfo(viewArr);
  };
  const onPlay = (e) => {
    let audio = new Audio(e.target.id);
    audio.volume = 0.25;
    audio.play();
  };
  const onTestEdit = (e) => {
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/test/edit'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/test/edit',
        { new_test_name: editName, test_id: editId },
        {
          headers: {
            token: token.current,
          },
        }
      )
      .then((res) => {
        getTests();
        setViewModal(false);
        createAlert('Test updated!', 'success', 5000);
      });
  };
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
                word by pressing enter and creating a new line. Make sure you
                don't create an extra enter at the end. <br />
                Next, upload a audio file for each word at the bottom.
              </label>
              <textarea
                className='form-control'
                rows='15'
                value={newTestWords}
                onChange={onWordChange}
              ></textarea>
              <p>
                {newTestWords === '' ? '0' : newTestWords.split('\n').length}{' '}
                words
              </p>
              <br />
              <label for='formControlRange'>
                {attempts} Attempt{attempts > 1 ? 's' : null}
              </label>
              <input
                type='range'
                min='1'
                value={attempts}
                max='10'
                onChange={(e) => setAttempts(e.target.value)}
                className='form-control-range'
                id='formControlRange'
              ></input>
              <br />
              <p>
                <strong>
                  **All audio files must be in an .mp3 or .m4a format, select
                  your format below, and the name of the file must be the same
                  as the word**
                </strong>{' '}
                <br />
                For example, the word cat would be uploaded with "cat.mp3"
              </p>
              <input
                type='file'
                onChange={(e) => setFiles(e.target.files)}
                multiple
              />
              <ul
                className='list-group list-group-horizontal'
                style={{ marginTop: '10px' }}
              >
                <li
                  className={
                    filetype === 'mp3'
                      ? 'list-group-item active'
                      : 'list-group-item'
                  }
                  onClick={() => setFiletype('mp3')}
                  style={{ cursor: 'pointer' }}
                >
                  .mp3
                </li>
                <li
                  className={
                    filetype === 'm4a'
                      ? 'list-group-item active'
                      : 'list-group-item'
                  }
                  onClick={() => setFiletype('m4a')}
                  style={{ cursor: 'pointer' }}
                >
                  .m4a
                </li>
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
            <button
              className='btn btn-success'
              onClick={onClick}
              disabled={
                files.length !== newTestWords.split('\n').length || disable
                  ? true
                  : false
              }
            >
              Create test
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={viewModal} onHide={() => setViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View test</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              className='form-control'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder='Test name'
            />
            {viewInfo.map((word) => (
              <p>
                {word.word}{' '}
                <img
                  src={speaker}
                  id={word.audio_path}
                  style={{ position: 'relative' }}
                  className='speaker'
                  onClick={onPlay}
                  alt='play'
                />
              </p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-success' onClick={onTestEdit}>
              Save Changes
            </button>
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
          style={{ width: '100%', marginBottom: '10px' }}
          onClick={() => setShowModal(true)}
        >
          Create new test
        </button>
        <button
          className='btn btn-info'
          style={{ width: '100%', marginBottom: '25px' }}
          onClick={() =>
            showArchived ? setShowArchived(false) : setShowArchived(true)
          }
        >
          {showArchived ? 'Show active tests' : 'Show archived tests'}
        </button>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Test</th>
              <th scope='col'>Edit</th>
              {showArchived ? <th scope='col'>Unarchive</th> : null}
              <th scope='col'>{showArchived ? 'Delete' : 'Archive'}</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => {
              if (!showArchived && test.archived) return null;
              if (showArchived && !test.archived) return null;
              if (showArchived) {
                return (
                  <tr key={test.test_name} id={test.test_id}>
                    <td>{test.test_name}</td>
                    <td>
                      <button
                        className='btn btn-info'
                        id={test.test_id}
                        testName={test.test_name}
                        onClick={viewTest}
                      >
                        Edit/View
                      </button>
                    </td>
                    <td>
                      <button
                        className='btn btn-secondary'
                        onClick={unArchiveTest}
                      >
                        Unarchive
                      </button>
                    </td>
                    <td>
                      <button className='btn btn-danger' onClick={deleteTest}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={test.test_name} id={test.test_id}>
                    <td>{test.test_name}</td>
                    <td>
                      <button
                        className='btn btn-info'
                        id={test.test_id}
                        testName={test.test_name}
                        onClick={viewTest}
                      >
                        Edit/View
                      </button>
                    </td>
                    <td>
                      <button className='btn btn-danger' onClick={archiveTest}>
                        Archive
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Tests;
