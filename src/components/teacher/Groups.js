import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [tests, setTests] = useState([]);
  const history = useHistory();
  let token = localStorage.getItem('token');
  const getGroups = () => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/groups'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/groups',
        {
          headers: { token },
        }
      )
      .then((res) => {
        setGroups(res.data);
        axios
          .get(
            process.env.NODE_ENV === 'development'
              ? '/api/teacher/tests'
              : 'https://spelling-tests-backend.herokuapp.com/api/teacher/tests',
            { headers: { token } }
          )
          .then((res) => {
            setTests(res.data.tests);
          })
          .catch(() => {
            history.push('/');
          });
      })
      .catch(() => {});
  };
  useEffect(() => {
    getGroups();
  });
  const onClick = (e) => {
    axios
      .put(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/groups'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/groups',
        {
          token,
          group: e.target.parentElement.id,
          newTest: e.target.id,
        }
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
          token,
          group: e.target.parentElement.id,
          newTest: '',
        }
      )
      .then(() => {
        getGroups();
      });
  };
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
            <th scope='col'>Active Test</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.name}>
              <td>{group.name}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                    {group.activeTest === ''
                      ? 'No test selected'
                      : group.activeTest}
                  </Dropdown.Toggle>
                  <Dropdown.Menu id={group.name}>
                    {tests.map((test) => (
                      <Dropdown.Item
                        key={test.name}
                        id={test.name}
                        onClick={onClick}
                      >
                        {test.name}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={noTest}>No test</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Groups;
