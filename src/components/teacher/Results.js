import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

const Results = ({ createAlert }) => {
  const [searchType, setSearchType] = useState('student');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = useRef(localStorage.getItem('token'));
  const getTestName = (test_id) => {
    let testObj = tests.find((test) => test.test_id === test_id);
    return testObj.test_name;
  };
  const getGroupName = (group_id) => {
    let groupObj = groups.find((g) => g.group_id === group_id);
    return groupObj.group_name;
  };
  const getStudentName = (student_id) => {
    let studentObj = students.find((s) => s.student_id === student_id);
    return studentObj.first_name + ' ' + studentObj.last_name;
  };
  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        setClasses(res.data.classes);
        setResults(res.data.results);
        setTests(res.data.tests);
        setGroups(res.data.groups);
        setStudents(res.data.students);
        setLoading(false);
      })
      .catch(() => {
        createAlert(
          'There was an error fetching your student groups.',
          'danger',
          5000
        );
      });
  }, [createAlert]);

  const filterResults = (newSearch, newSearchType) => {
    if (newSearch === undefined || newSearchType === undefined) {
      newSearch = search;
      newSearchType = searchType;
    }
    switch (newSearchType) {
      case 'student':
        let newArr = [];
        results.map((result) => {
          if (
            getStudentName(result.student_id)
              .toLowerCase()
              .includes(newSearch.toLowerCase())
          ) {
            return newArr.push(result);
          } else return null;
        });
        setSorted(newArr);
        break;
      case 'test':
        let newTestArr = [];
        results.map((result) => {
          if (
            getTestName(result.test_id)
              .toLowerCase()
              .includes(newSearch.toLowerCase())
          ) {
            return newTestArr.push(result);
          } else return null;
        });
        setSorted(newTestArr);
        break;
      case 'group':
        let newGroupArr = [];
        results.map((result) => {
          if (
            getGroupName(result.group_id)
              .toLowerCase()
              .includes(newSearch.toLowerCase())
          ) {
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
  if (loading) return <Spinner />;
  else
    return (
      <div className='container'>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop='static'
          size='lg'
        >
          <Modal.Header closeButton>
            <Modal.Title>Export Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' placeholder='' className='form-control' />
          </Modal.Body>
          <Modal.Footer>
            <button
              className='btn btn-danger'
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button className='btn btn-success'>Export</button>
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
        <button
          className='btn btn-primary form-control'
          onClick={() => setShowModal(true)}
        >
          Export Results
        </button>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Test</th>
              <th scope='col'>Group</th>
              <th scope='col'>Attempt</th>
              <th scope='col'>Score</th>
              <th scope='col'>See More</th>
            </tr>
          </thead>
          <tbody>
            {search === ''
              ? results.map((result) => (
                  <tr key={result.result_id} id={result.result_id}>
                    <td>{getStudentName(result.student_id)}</td>
                    <td>{getTestName(result.test_id)}</td>
                    <td>{getGroupName(result.group_id)}</td>
                    <td>{result.attempt}</td>
                    <td>
                      {result.correct}/{result.total} | {result.score * 100}%
                    </td>
                    <td>
                      <Link
                        to={`/teacher/result?result_id=${result.result_id}`}
                        className='btn btn-primary'
                      >
                        See More
                      </Link>
                    </td>
                  </tr>
                ))
              : sorted.map((result) => (
                  <tr key={result.result_id} id={result.result_id}>
                    <td>{getStudentName(result.student_id)}</td>
                    <td>{getTestName(result.test_id)}</td>
                    <td>{getGroupName(result.group_id)}</td>
                    <td>{result.attempt}</td>
                    <td>
                      {result.correct}/{result.total} | {result.score * 100}%
                    </td>
                    <td>
                      <Link
                        to={`/teacher/result?result_id=${result.result_id}`}
                        className='btn btn-primary'
                      >
                        See More
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    );
};

export default Results;
