import React, { useState, useEffect } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';

const Results = ({ token }) => {
  const [searchType, setSearchType] = useState('student');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState([]);
  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/results'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/results',
        { headers: { token } }
      )
      .then((res) => {
        setResults(
          res.data.results
            .sort((a, b) => {
              return b.time - a.time;
            })
            .reverse()
        );
      })
      .catch((err) => {
        console.log(err.response);
      });
  });
  const onModal = (e) => {
    setShowModal(true);
    results.map((result) => {
      if (result._id === e.target.parentElement.parentElement.id) {
        return setModalInfo(result.data);
      } else return null;
    });
  };
  const filterResults = (newSearch, newSearchType) => {
    if (newSearch === undefined || newSearchType === undefined) {
      newSearch = search;
      newSearchType = searchType;
    }
    switch (newSearchType) {
      case 'student':
        let newArr = [];
        results.map((result) => {
          if (result.name.toLowerCase().includes(newSearch.toLowerCase())) {
            return newArr.push(result);
          } else return null;
        });
        setSorted(newArr);
        break;
      case 'test':
        let newTestArr = [];
        results.map((result) => {
          if (result.test.toLowerCase().includes(newSearch.toLowerCase())) {
            return newTestArr.push(result);
          } else return null;
        });
        setSorted(newTestArr);
        break;
      case 'group':
        let newGroupArr = [];
        results.map((result) => {
          if (result.group.toLowerCase().includes(newSearch.toLowerCase())) {
            return newGroupArr.push(result);
          } else return null;
        });
        setSorted(newGroupArr);
        break;
      default:
        break;
    }
  };
  const onChange = (e) => {
    setSearch(e.target.value);
    filterResults(e.target.value, searchType);
  };
  const onClick = (e) => {
    setSearchType(e.target.id);
    filterResults(search, e.target.id);
  };
  return (
    <div className='container'>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Student Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol>
            {modalInfo.map((q) => {
              if (q.word.toLowerCase() === q.ans.toLowerCase()) {
                return (
                  <li key={q.word} style={{ color: 'green' }}>
                    Word: {q.word}
                    <br />
                    Answer: {q.ans}
                  </li>
                );
              } else {
                return (
                  <li key={q.word} style={{ color: 'red' }}>
                    Word: {q.word}
                    <br />
                    Answer: {q.ans}
                  </li>
                );
              }
            })}
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-secondary'
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <div className='input-group mb-3'>
        <div className='input-group-prepend'>
          <Dropdown>
            <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
              {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item id='student' onClick={onClick}>
                Student
              </Dropdown.Item>
              <Dropdown.Item id='test' onClick={onClick}>
                Test
              </Dropdown.Item>
              <Dropdown.Item id='group' onClick={onClick}>
                Group
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <input
          className='form-control'
          placeholder={`Search by ${searchType}...`}
          value={search}
          onChange={onChange}
        />
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Date (MST)</th>
            <th scope='col'>Name</th>
            <th scope='col'>Test</th>
            <th scope='col'>Group</th>
            <th scope='col'>Score</th>
            <th scope='col'>See More</th>
          </tr>
        </thead>
        <tbody>
          {search === ''
            ? results.map((result) => (
                <tr key={result._id} id={result._id}>
                  <td>
                    {new Date(result.time).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timezone: 'MST',
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    {result.name.charAt(0).toUpperCase() + result.name.slice(1)}
                  </td>
                  <td>{result.test}</td>
                  <td>{result.group}</td>
                  <td>
                    {result.score}% ({result.correct} / {result.total})
                  </td>
                  <td>
                    <button className='btn btn-primary' onClick={onModal}>
                      See More
                    </button>
                  </td>
                </tr>
              ))
            : sorted.map((result) => (
                <tr key={result._id} id={result._id}>
                  <td>
                    {new Date(result.time).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timezone: 'MST',
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    {result.name.charAt(0).toUpperCase() + result.name.slice(1)}
                  </td>
                  <td>{result.test}</td>
                  <td>{result.group}</td>
                  <td>
                    {result.score}% ({result.correct} / {result.total})
                  </td>
                  <td>
                    <button className='btn btn-primary' onClick={onModal}>
                      See More
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
