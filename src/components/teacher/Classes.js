import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';
import '../../Misc.css';

const Classes = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [editClass, setEditClass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classHover, setClassHover] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [action, setAction] = useState('');
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState([]);
  useEffect(() => {
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
          let counter = 0;
          res.data.students.map((s) => {
            if (s.class_id === c.class_id) counter++;
          });
          console.log(`${c.class_name}: ${counter}`);
          slist.push({
            class_id: c.class_id,
            class_name: c.class_name,
            count: counter,
          });
        });
        setStudentCount(slist);
        setClasses(res.data.classes);
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
  const confirm = () => {
    return new Promise((resolve, reject) => {});
  };
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
      default:
        break;
    }
  };
  const onRemove = (e) => {};
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
            <td scope='row'>{s.first_name}</td>
            <td scope='row'>{s.last_name}</td>
            <td scope='row'>{s.username}</td>
            <td scope='row'>
              <button className='btn btn-danger'>Delete</button>
            </td>
          </tr>
        ))}
      </Fragment>
    );
  };
  const getClassGroups = () => {
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
            <td scope='row'>{s.first_name}</td>
            <td scope='row'>{s.last_name}</td>
            <td scope='row'>
              <button className='btn btn-danger'>Delete</button>
            </td>
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
                    {
                      studentCount.find((sc) => sc.class_id === x.class_id)
                        .count
                    }{' '}
                    students
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
            <button
              className='btn btn-danger'
              style={{ width: '100%', marginTop: '10px' }}
              id='delete'
              onClick={onButton}
              disabled={selectedClass === '' ? true : false}
            >
              Delete Class
            </button>
            <button
              className='btn btn-warning'
              style={{ width: '100%', marginTop: '10px' }}
              id='change'
              onClick={onButton}
              disabled={selectedClass === '' ? true : false}
            >
              Change Class Name
            </button>
            <button
              className='btn btn-info'
              id='add'
              onClick={onButton}
              style={{ width: '100%', marginTop: '10px' }}
              disabled={selectedClass === '' ? true : false}
            >
              Add Students to Class
            </button>
          </div>
        </div>
        <div className='row'>
          <div className='col' style={{ marginTop: '20px' }}>
            {selectedClass === '' ? null : (
              <Fragment>
                <h4 className='text-center'>Class Info</h4>
                <table className='table'>
                  <thead className='thead-dark'>
                    <tr>
                      <th scope='col'>First</th>
                      <th scope='col'>Last</th>
                      <th scope='col'>Username</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{getClassDetails()}</tbody>
                </table>
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
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{getClassGroups()}</tbody>
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
