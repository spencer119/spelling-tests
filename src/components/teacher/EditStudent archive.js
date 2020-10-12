import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
const EditStudent = () => {
  const [student, setStudent] = useState({});
  const [newStudent, setNewStudent] = useState({});
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  let student_id = query.get('student_id');
  let token;
  useEffect(() => {
    let initQuery = useQuery();
    token = localStorage.getItem('token');
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/student'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/student',
        {
          headers: { token, student_id },
        }
      )
      .then((res) => {
        setStudent(res.data.student[0]);

      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className='container'>
      <div className='input-group mb-3'>
        <input className='form-control' placeholder='First Name' />
        <input className='form-control' placeholder='Last Name' />
      </div>
      <div className='input-group mb-3'>
        <input className='form-control' placeholder='Username' />
        <input className='form-control' placeholder='Password' />
      </div>
      <div className='input-group mb-3'>
        <Dropdown>
          <Dropdown.Toggle></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default EditStudent;
