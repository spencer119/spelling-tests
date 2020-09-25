import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios'
const EditStudent = () => {
    const [student, setStudent] = useState({})
    const [newStudent, setNewStudent] = useState({})
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
      const query = useQuery();
      let student_id = query.get('student_id')
      let token;
      useEffect(() => {
          token = localStorage.getItem('token')
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
            setStudent(res.data.student[0])
        })
        .catch((err) => console.log(err));
      }, [])
    return (
        <div className='container'>
            {student_id}
        </div>
    )
}

export default EditStudent
