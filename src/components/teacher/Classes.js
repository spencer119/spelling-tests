import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';
import '../../Misc.css'

const Classes = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [editClass, setEditClass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classHover, setClassHover] = useState('') 
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('')
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
        console.log(res.data)
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
                  className={classHover === x.class_id ? 'list-group-item d-flex justify-content-between align-items-center list-group-hover' : 'list-group-item d-flex justify-content-between align-items-center'}
                  id={x.class_id}
                  onClick={(e) => setSelectedClass(e.target.id)}
                  onMouseEnter={(e) => setClassHover(e.target.id)}
                  onMouseLeave={() => setClassHover('')}
                >
                  {x.class_name}
                  {/* <span className='badge badge-primary badge-pill'>
                    2 students
                  </span> */}
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
            <button className='btn btn-danger' style={{width: '100%', marginTop: '10px'}} disabled>Delete Class</button>
            <button className='btn btn-warning' style={{width: '100%', marginTop: '10px'}} disabled>Change Class Name</button>
            <button className='btn btn-info' style={{width: '100%', marginTop: '10px'}} disabled>Add Students to Class</button>
          </div>
        </div>
      </div>
    );
  }
};

export default Classes;
