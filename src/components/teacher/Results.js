import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import axios from 'axios';
import Spinner from '../Spinner'

const Results = ({createAlert}) => {
  const [searchType, setSearchType] = useState('student');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [groups, setGroups] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState([])
  const [sorted, setSorted] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState([]);
  const token = useRef(localStorage.getItem('token'))
  const getClassName = (class_id) => {
    let classObj = classes.find((c) => c.class_id === class_id);
    return classObj.class_name;
  }
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
    return studentObj.first_name;
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
        setResults(res.data.results)
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
  }, []);
  
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
  if (loading) return <Spinner />
  else
  return (
    <div className='container'>
      {/* <div className='input-group mb-3'>
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
      </div> */}
      <table className='table'>
        <thead>
          <tr>
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
                <tr key={result.result_id} id={result.result_id}>
                  <td>
                    {getStudentName(result.student_id)}
                  </td>
                  <td>{getTestName(result.test_id)}</td>
                  <td>{getGroupName(result.group_id)}</td>
                  <td>
            {result.correct}/{result.total} | {result.score * 100}%
                  </td>
                  <td>
                    <Link to={`/teacher/result?result_id=${result.result_id}`} className='btn btn-primary'>
                      See More
                    </Link>
                  </td>
                </tr>
              ))
            : sorted.map((result) => (
                <tr key={result.result_id} id={result.result_id}>
                  <td>
                    {result.name.charAt(0).toUpperCase() + result.name.slice(1)}
                  </td>
                  <td>{result.test}</td>
                  <td>{result.group}</td>
                  <td>
                    {result.score}% ({result.correct} / {result.total})
                  </td>
                  <td>
                    <Link to={`/teacher/result?result_id=${result.result_id}`} className='btn btn-primary'>
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
