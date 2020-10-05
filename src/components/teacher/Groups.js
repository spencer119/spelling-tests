import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

const Groups = ({ createAlert }) => {
  const [groups, setGroups] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  let token = useRef(localStorage.getItem('token'));
  const getTestName = (test_id) => {
    let testObj = tests.find((test) => test.test_id === test_id);
    console.log(testObj);
    return testObj.test_name;
  };
  const getGroups = () => {
    setLoading(true);
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
        setGroups(res.data.groups);
        setClasses(res.data.classes);
        setStudents(res.data.students);
        setTests(res.data.tests);
        setLoading(false);
      })
      .catch(() => {
        createAlert(
          'There was an error fetching your student groups.',
          'danger',
          5000
        );
      });
  };
  useEffect(() => {
    setLoading(true);
    getGroups();
  }, []);
  const onClick = (e) => {
    axios
      .put(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/groups'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/groups',
        {
          group_id: e.target.parentElement.id,
          new_test: e.target.id,
        },
        { headers: { token: token.current } }
      )
      .then(() => {
        getGroups();
      });
  };
  const noTest = (e) => {
    axios
      .put(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/groups'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/groups',
        {
          group_id: e.target.parentElement.id,
          new_test: '',
        },
        { headers: { token: token.current } }
      )
      .then(() => {
        getGroups();
      });
  };
  const getClassName = (id) => {
    let className = classes.find((x) => x.class_id === id);
    if (className === undefined) return 'None';
    else return className.class_name;
  };
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='container'>
        <p>
          To change the current active test. Select a new test from the dropdown
          menu that corresponds to the correct group.
          <Link
            to='/teacher/groups/create'
            className='btn btn-primary'
            style={{ marginLeft: '75px' }}
          >
            Create New Group
          </Link>
        </p>

        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Group</th>
              <th scope='col'>Class</th>
              <th scope='col'>Active Test</th>
              <th scope='col'>Edit</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.group_name}>
                <td>{group.group_name}</td>
                <td>{getClassName(group.class_id)}</td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                      {group.active_test === null
                        ? 'No test selected'
                        : getTestName(group.active_test)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu id={group.group_id}>
                      {tests.map((test) => (
                        <Dropdown.Item
                          key={test.test_name}
                          id={test.test_id}
                          onClick={onClick}
                        >
                          {test.test_name}
                        </Dropdown.Item>
                      ))}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={noTest}>No test</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <button className='btn btn-secondary' id={group.group_id}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Groups;
