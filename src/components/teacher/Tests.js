import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
const Tests = () => {
  const history = useHistory();
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestWords, setNewTestWords] = useState('');
  const [missing, setMissing] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  let token = localStorage.getItem('token')
  const onNameChange = (e) => {
    setNewTestName(e.target.value);
  };
  const onWordChange = (e) => {
    setNewTestWords(e.target.value.replace(' ', '').toLowerCase());
  };
  const getTests = () => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/tests'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
        {
          headers: { token },
        }
      )
      .then((res) => {
        setTests(res.data.tests);
        setMissing(res.data.missing);
      })
      .catch(() => history.push('/teacher/login'));
  };
  const onClick = () => {
    let words = newTestWords.split('\n');
    if (words.includes('')) {
      let index = words.indexOf('');
      words.splice(index, 1);
    }
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/tests'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
        {
          token,
          name: newTestName,
          words,
        }
      )
      .then((res) => {
        console.log(res);
        setShowModal(false);
        getTests();
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
            token,
          },
          data: {
            test: e.target.parentElement.parentElement.id,
          },
        }
      )
      .then(() => {
        getTests();
      });
  };
  const viewTest = (e) => {
    tests.map((test) => {
      if (test.name === e.target.parentElement.parentElement.id) {
        return setViewInfo(test.words);
      } else return null;
    });
    setViewModal(true);
  };
  const mouseOver = (e) => {
    alert('This test is missing audio files.');
  };
  useEffect(() => getTests(), []);
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
              Enter the words for the test in the box below. Seperate each word
              by pressing enter and creating a new line.
            </label>
            <textarea
              className='form-control'
              rows='15'
              value={newTestWords}
              onChange={onWordChange}
            ></textarea>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-danger'
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className='btn btn-success' onClick={onClick}>
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
            <p>{word}</p>
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
        To create a new test click the button below and follow the instructions.
        Do not forget to upload the audio files via the Upload tab.
      </p>
      <button
        className='btn btn-primary'
        style={{ width: '100%', marginBottom: '25px' }}
        onClick={() => setShowModal(true)}
      >
        Create new test
      </button>
      <i className='fas fa-info-circle' style={{ color: 'red' }}></i>
      <span> = The test is missing audio files</span>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Test</th>
            <th scope='col'>View</th>
            <th scope='col'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => {
            let isMissing = false;
            test.words.map((word) => {
              if (missing.includes(word)) {
                return (isMissing = true);
              } else return null;
            });
            return (
              <tr key={test.name} id={test.name}>
                <td>{test.name}</td>
                <td>
                  <button className='btn btn-info' onClick={viewTest}>
                    View
                  </button>
                </td>
                <td>
                  <button className='btn btn-danger' onClick={deleteTest}>
                    Delete
                  </button>
                  {isMissing ? (
                    <i
                      className='fas fa-info-circle'
                      style={{ marginLeft: '25px', color: 'red' }}
                      onMouseOver={mouseOver}
                    ></i>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Tests;
