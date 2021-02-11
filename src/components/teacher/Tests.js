import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Spinner from '../Spinner';
import speaker from '../../speaker.png';
const Tests = ({ createAlert }) => {
  const [tests, setTests] = useState([]);
  const [testlines, setTestlines] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useRef(localStorage.getItem('token'));
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [showArchived, setShowArchived] = useState(false);

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
      if (line.test_id === e.target.parentElement.parentElement.id) viewArr.push(line);
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
        <Modal show={viewModal} onHide={() => setViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View test</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Test Name</label>
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
        <p>To create a new test click the button below and follow the instructions.</p>
        <Link
          className='btn btn-primary'
          style={{ width: '100%', marginBottom: '10px' }}
          to='/teacher/tests/create'
        >
          Create new test
        </Link>
        <button
          className='btn btn-info'
          style={{ width: '100%', marginBottom: '25px' }}
          onClick={() => (showArchived ? setShowArchived(false) : setShowArchived(true))}
        >
          {showArchived ? 'Show active tests' : 'Show archived tests'}
        </button>
        <p>
          Note: Archiving a test does not delete it. In order to delete a test you must archive it,
          then delete it. Deleting a test deletes all student results associated with that test.
        </p>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Test</th>
              <th scope='col'>Edit/View</th>
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
                      <button className='btn btn-secondary' onClick={unArchiveTest}>
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
