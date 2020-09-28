import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

const Classes = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [editClass, setEditClass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
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
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <ul className='list-group'>
              {classes.map((x) => (
                <li
                  style={{ cursor: 'pointer' }}
                  className='list-group-item d-flex justify-content-between align-items-center'
                >
                  {x.class_name}
                  <span className='badge badge-primary badge-pill'>
                    2 students
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
          </div>
        </div>
      </div>
    );
  }
};

export default Classes;
