import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import Spinner from '../Spinner';
import '../../Misc.css';

const Classes = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [classHover, setClassHover] = useState('');
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState([]);

  const loadPage = () => {
    setLoading(true);
    let userToken = token.current;
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher',
        {
          headers: { token: userToken },
        }
      )
      .then((res) => {
        let slist = [];
        res.data.classes.map((c) => {
          // gets class count for badges
          let counter = 0;
          res.data.students.map((s) => {
            if (s.class_id === c.class_id) counter++;
          });
          slist.push({
            class_id: c.class_id,
            class_name: c.class_name,
            count: counter,
          });
        });
        setStudentCount(slist);
        setClasses(res.data.classes);
        setTests(res.data.tests.filter((t) => !t.archived));
        setGroups(res.data.groups);
        setStudents(res.data.students);
        setLoading(false);
      })
      .catch(() => {
        createAlert('There was an error fetching your student groups.', 'danger', 5000);
      });
  };
  useEffect(() => {
    loadPage();
  }, []);
  const onButton = (e) => {
    switch (e.target.id) {
      case 'delete':
        alert('delete');
        break;
      case 'add':
        alert('add');
        break;
      case 'change':
        alert('change');
        break;
      case 'group':
        alert('group');
        break;
      default:
        break;
    }
  };
  const getTestName = (test_id) => {
    console.log(tests);
    let testObj = tests.find((test) => test.test_id === test_id);
    if (testObj === undefined) return null;
    return testObj.test_name;
  };
  const getGroupName = (group_id) => {
    let groupObj = groups.find((g) => g.group_id === group_id);
    return groupObj.group_name;
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
        loadPage();
      });
  };
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
        loadPage();
      });
  };
  const getClassDetails = () => {
    let classStudents = [];
    students.map((student) => {
      if (student.class_id === selectedClass) {
        classStudents.push(student);
      }
    });
    return (
      <Fragment>
        {classStudents.map((s) => (
          <tr key={s.student_id}>
            <td>{s.first_name}</td>
            <td>{s.last_name}</td>
            <td>{s.username}</td>
            <td>{getGroupName(s.group_id)}</td>
          </tr>
        ))}
      </Fragment>
    );
  };
  const getClassGroups = () => {
    let classGroups = [];
    groups.map((student) => {
      if (student.class_id === selectedClass) {
        classGroups.push(student);
      }
    });
    return (
      <Fragment>
        {classGroups.map((group) => (
          <tr key={group.group_id}>
            <td>{group.group_name}</td>
            <td>
              <Dropdown>
                <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                  {tests.length === 0
                    ? 'No test selected'
                    : group.active_test === null
                    ? 'No test selected'
                    : getTestName(group.active_test)}
                </Dropdown.Toggle>
                <Dropdown.Menu id={group.group_id}>
                  {tests.map((test) => (
                    <Dropdown.Item key={test.test_name} id={test.test_id} onClick={onClick}>
                      {test.test_name}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={noTest}>No test</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
            {/* <td scope='row'>
              <button className='btn btn-danger'>Delete</button>
            </td> */}
          </tr>
        ))}
      </Fragment>
    );
  };
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='container'>
        <h2 className='text-center' style={{ marginBottom: '20px' }}>
          Classes
        </h2>
        <div className='row'>
          <div className='col'>
            <ul className='list-group'>
              {classes.map((x) => (
                <li
                  key={x.class_id}
                  style={{ cursor: 'pointer', width: '100%' }}
                  className={
                    selectedClass === x.class_id
                      ? 'list-group-item d-flex justify-content-between align-items-center active'
                      : classHover === x.class_id
                      ? 'list-group-item d-flex justify-content-between align-items-center list-group-hover'
                      : 'list-group-item d-flex justify-content-between align-items-center'
                  }
                  id={x.class_id}
                  onClick={(e) => setSelectedClass(e.target.id)}
                  onMouseEnter={(e) => setClassHover(e.target.id)}
                  onMouseLeave={() => setClassHover('')}
                >
                  {x.class_name}
                  <span className='badge badge-primary badge-pill'>
                    {studentCount.find((sc) => sc.class_id === x.class_id).count} students
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className='col'>
            <Link
              to='/teacher/classes/create'
              className='btn btn-success'
              style={{ width: '100%' }}
            >
              Create New Class
            </Link>
            {/* <button
              className='btn btn-danger'
              style={{ width: '100%', marginTop: '10px' }}
              id='delete'
              onClick={onButton}
              disabled={selectedClass === '' ? true : false}
            >
              Delete Class
            </button> */}
            {/* <button
              className='btn btn-warning'
              style={{ width: '100%', marginTop: '10px' }}
              id='change'
              onClick={onButton}
              disabled={selectedClass === '' ? true : false}
            >
              Change Class Name
            </button> */}

            {selectedClass === '' ? null : (
              <Fragment>
                <Link
                  className='btn btn-info'
                  to={`/teacher/groups/create?class_id=${selectedClass}`}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Create Group
                </Link>
                {/* <button
              className='btn btn-info'
              id='add'
              onClick={onButton}
              style={{ width: '100%', marginTop: '10px' }}
            >
              Add Students to Class
            </button> */}
              </Fragment>
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col' style={{ marginTop: '20px' }}>
            {selectedClass === '' ? null : (
              <Fragment>
                <h4 className='text-center'>Class Groups</h4>
                <table className='table'>
                  <thead className='thead-dark'>
                    <tr>
                      <th scope='col'>Group Name</th>
                      <th scope='col'>Active Test</th>
                      {/* <th scope='col'>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>{getClassGroups()}</tbody>
                </table>
              </Fragment>
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col' style={{ marginTop: '20px' }}>
            {selectedClass === '' ? null : (
              <Fragment>
                <h4 className='text-center'>Students</h4>
                <table className='table'>
                  <thead className='thead-dark'>
                    <tr>
                      <th scope='col'>First</th>
                      <th scope='col'>Last</th>
                      <th scope='col'>Username</th>
                      <th scope='col'>Group</th>
                    </tr>
                  </thead>
                  <tbody>{getClassDetails()}</tbody>
                </table>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Classes;
