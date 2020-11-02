import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import {Dropdown} from 'react-bootstrap'
const Teachers = ({createAlert}) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [useDefaultPassword, setUseDefaultPassword] = useState(true)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [teachers, setTeachers] = useState([])
    const token = useRef(localStorage.getItem('token'))
    useEffect(() => {
        axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/admin/teachers'
          : 'https://spelling-tests-backend.herokuapp.com/api/admin/teachers',
        { headers: { token: token.current } }
      )
      .then((res) => {
        setTeachers(res.data)
      })
      .catch((err) => {
          console.log(err)
      });
    }, [])
    const onClick = e => {
        e.preventDefault()
        if (firstName === '' || lastName === '' || username === '' || email === '') return createAlert('One or more field is missing.', 'danger', 5000)
        if(useDefaultPassword === false && password === '') return createAlert('Please enter a custom password', 'danger', 5000)
        axios
        .post(
          process.env.NODE_ENV === 'development'
            ? '/api/admin/teacher/create'
            : 'https://spelling-tests-backend.herokuapp.com/api/admin/teacher/create',
          { firstName, lastName, username, email, isAdmin, useDefaultPassword, password },
          { headers: { token: token.current } }
        )
        .then((res) => {
            createAlert('Teacher created successfully!', 'success', 5000)
            setIsAdmin(false);
            setUseDefaultPassword(true);
            setFirstName('');
            setLastName('');
            setUsername('');
            setEmail('');
            setPassword('');
        })
        .catch((err) => {
          
        });
    }
    const onReset = (e) => {
      axios
        .post(
          process.env.NODE_ENV === 'development'
            ? '/api/admin/teacher/resetpassword'
            : 'https://spelling-tests-backend.herokuapp.com/api/admin/teacher/resetpassword',
          { teacher_id: e.target.id},
          { headers: { token: token.current } }
        )
        .then((res) => {
          createAlert(`Password reset.`, 'success', 5000)
        })
        .catch((err) => {
          console.log(err)
          alert('An error occured resetting the password.')
        });
    }
    return (
        <div className='container'>
            <form>
                <div className="form-row">
                    <div className="col">
                    <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control"/>
                    </div>
                    <div className="col">
                    <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control"/>
                    </div>
                </div>
                <div className="form-row" style={{marginTop: '10px'}}>
                    <div className="col">
                        <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className="form-control"/>
                    </div>
                    <div className="col">
                        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className="form-control"/>
                    </div>
                </div>
                <div className="form-row" style={{marginTop: '10px'}}>
                    <div className="col">
                    <div className="form-check form-check-inline">
                        <input className='form-check-input' checked={isAdmin} onChange={(e) => {if (isAdmin) {setIsAdmin(false)} else {setIsAdmin(true)}}} type='checkbox' />
                        <label className='form-check-label'>Admin</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className='form-check-input' onChange={(e) => {if (useDefaultPassword) {setUseDefaultPassword(false)} else {setUseDefaultPassword(true)}}} type='checkbox' checked={useDefaultPassword} />
                        <label className='form-check-label'>Use Default Password</label>
                    </div>
                    </div>
                    <div className="col">
                        {useDefaultPassword ? null : (<input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className="form-control"/>)}
                        
                    </div>
                </div>
                <div className="form-row" style={{marginTop: '10px'}}>
                    <button onClick={onClick} className='btn btn-primary' style={{width: '100%'}}>Create Teacher</button>
                </div>
            </form>
            <table className='table' style={{marginTop: '20px'}}>
          <thead>
            <tr>
              <th scope='col'>First Name</th>
              <th scope='col'>Last Name</th>
              <th scope='col'>Username</th>
              <th scope='col'>Email</th>
              <th scope='col'>Account Type</th>
              <th scope='col'>Modify</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (<tr key={teacher.teacher_id} id={teacher.teacher_id}>
                    <td>
                    {teacher.first_name.charAt(0).toUpperCase() +
                        teacher.first_name.slice(1)}
                    </td>
                    <td>
                    {teacher.last_name.charAt(0).toUpperCase() +
                        teacher.last_name.slice(1)}
                    </td>
                    <td>{teacher.username}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.is_admin ? 'Admin' : 'Teacher'}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                          Modify
                        </Dropdown.Toggle>
                        <Dropdown.Menu id={teacher.teacher_id}>
                          <Dropdown.Item onClick={onReset} username={teacher.username} id={teacher.teacher_id}>Reset Password</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => alert('This function is currently unavailable.')} style={{ color: 'red' }}>
                            Delete Teacher
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>))}
          </tbody>
        </table>
        </div>
    )
}

export default Teachers
