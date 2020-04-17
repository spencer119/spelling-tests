import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
const Tests = ({ token }) => {
  const history = useHistory();
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestWords, setNewTestWords] = useState('');
  const [missing, setMissing] = useState([]);
  const onNameChange = (e) => {
    setNewTestName(e.target.value);
  };
  const onWordChange = (e) => {
    setNewTestWords(e.target.value);
  };
  const getTests = () => {
    axios
      .get('https://spelling-tests-backend.herokuapp.com/api/teacher/tests', {
        headers: { token },
      })
      .then((res) => {
        setTests(res.data.tests);
        setMissing(res.data.missing);
      })
      .catch(() => history.push('/teacher/login'));
  };
  const onClick = () => {
    let words = newTestWords.split('\n');
    axios
      .post('https://spelling-tests-backend.herokuapp.com/api/teacher/tests', {
        token,
        name: newTestName,
        words,
      })
      .then((res) => {
        console.log(res);
        setShowModal(false);
        getTests();
      });
  };
  const deleteTest = (e) => {
    axios
      .delete(
        'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
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
      <button
        className='btn btn-primary'
        style={{ width: '100%', marginBottom: '25px' }}
        onClick={() => setShowModal(true)}
      >
        Create new test
      </button>
      <i className='fas fa-info-circle' style={{ color: 'red' }}></i>
      <span> = Missing Files</span>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Test</th>
            <th scope='col'>Modify</th>
            <th scope='col'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => {
            let isMissing = false;
            test.words.map((word) => {
              if (missing.includes(word)) {
                isMissing = true;
              }
            });
            return (
              <tr key={test.name} id={test.name}>
                <td>{test.name}</td>
                <td>
                  <button className='btn btn-info'>Modify</button>
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