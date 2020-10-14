import React, { useState, useEffect } from 'react';
import { Modal, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Spinner from '../Spinner';

const Students = ({ createAlert }) => {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [selectedGroup, setSelectedGroup] = useState('Select Group');
  const [classId, setClassId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [groups, setGroups] = useState([]);
  const [classes, setClasses] = useState([]);
  const [creationAlert, setCreationAlert] = useState(false);
  const [sorted, setSorted] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory()
  let token = localStorage.getItem('token');
  const getData = () => {
    axios // get student data
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher',
        { headers: { token } }
      )
      .then((res) => {
        setStudents(res.data.students);
        setGroups(res.data.groups);
        setClasses(res.data.classes);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const addStudent = () => {
    if (firstName === '' || lastName === '' || username === '') {
      setCreationAlert(true);
      setTimeout(() => setCreationAlert(false), 5000);
      return;
    } else {
      axios
        .post(
          process.env.NODE_ENV === 'development'
            ? '/api/teacher/student'
            : 'https://spelling-tests-backend.herokuapp.com/api/teacher/student',
          { firstName, lastName, username, classId, groupId },
          { headers: { token } }
        )
        .then((res) => {
          getData();
          setClassId('');
          setSelectedClass('Select Class');
          setSelectedGroup('Select Group')
          setGroupId('');
          setFirstName('');
          setLastName('');
          setUsername('');
          setShowModal(false);
          createAlert('Student created!', 'success', 5000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    setLoading(true);
    axios // get student data
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher',
        { headers: { token } }
      )
      .then((res) => {
        setStudents(res.data.students);
        setGroups(res.data.groups);
        setClasses(res.data.classes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  const onChange = (e) => {
    setSearch(e.target.value);
  };
  const onModal = (e) => {
    setShowModal(true);
  };
  const getClassName = (id) => {
    let className = classes.find((x) => x.class_id === id);
    if (className === undefined) return 'None';
    else return className.class_name;
  };
  const getGroupName = (id) => {
    let groupName = groups.find((x) => x.group_id === id);
    if (groupName === undefined) return 'None';
    else return groupName.group_name;
  };
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='container'>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Student</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>All fields must be filled in</p>
            {creationAlert ? (
              <div className='alert alert-danger'>
                The first 3 fields must be filled in.
              </div>
            ) : null}
            <div className='input-group mb-3'>
              <input
                type='text'
                value={firstName}
                id='firstName'
                className='form-control'
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='First Name'
              />
              <input
                type='text'
                value={lastName}
                id='lastName'
                onChange={(e) => setLastName(e.target.value)}
                className='form-control'
                placeholder='Last Name'
              />
              <input
                type='text'
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                id='username'
                className='form-control'
                placeholder='Username'
              />
            </div>
            <Dropdown>
              <Dropdown.Toggle
                variant='primary'
                id='dropdown-basic'
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {selectedClass}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {selectedClass !== 'Select Class' ? (
                  <Dropdown.Item
                    id='Select Class'
                    onClick={(e) => {
                      setClassId('');
                      setSelectedClass(e.target.id);
                    }}
                  >
                    None
                  </Dropdown.Item>
                ) : null}
                {classes.map((c) => (
                  <Dropdown.Item
                    cname={c.class_name}
                    id={c.class_id}
                    onClick={(e) => {
                      setSelectedClass(e.target.getAttribute('cname'));
                      setClassId(e.target.id);
                    }}
                  >
                    {c.class_name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle
                variant='primary'
                id='dropdown-basic'
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {selectedGroup}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {selectedGroup !== 'Select Group' ? (
                  <Dropdown.Item
                    id='Select Group'
                    onClick={(e) => {
                      setGroupId('');
                      setSelectedGroup(e.target.id);
                    }}
                  >
                    None
                  </Dropdown.Item>
                ) : null}
                {groups.map((g) => (
                  <Dropdown.Item
                    id={g.group_id}
                    gname={g.group_name}
                    onClick={(e) => {
                      setGroupId(e.target.id);
                      setSelectedGroup(e.target.getAttribute('gname'));
                    }}
                  >
                    {g.group_name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Modal.Body>
          <Modal.Footer>
            <button
              className='btn btn-danger'
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              className='btn btn-success'
              onClick={() => {
                addStudent();
              }}
              disabled={selectedClass === 'Select Class' || selectedGroup === 'Select Group' || firstName === '' || lastName === '' || username === '' ? true : false}
            >
              Add Student
            </button>
          </Modal.Footer>
        </Modal>
        <div className='input-group mb-3'>
          <div className='input-group-prepend'>
            <button className='btn btn-secondary'>Student </button>
          </div>
          <input
            className='form-control'
            placeholder={`Search by student`}
            value={search}
            onChange={onChange}
          />
          <button
            className='btn btn-primary'
            style={{ width: '100%', marginTop: '10px' }}
            onClick={onModal}
          >
            Add Student
          </button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>First Name</th>
              <th scope='col'>Last Name</th>
              <th scope='col'>Username</th>
              <th scope='col'>Class</th>
              <th scope='col'>Group</th>
              <th scope='col'>Modify</th>
            </tr>
          </thead>
          <tbody>
            {search === ''
              ? students.map((student) => (
                  <tr key={student.student_id} id={student.student_id}>
                    <td>
                      {student.first_name.charAt(0).toUpperCase() +
                        student.first_name.slice(1)}
                    </td>
                    <td>
                      {student.last_name.charAt(0).toUpperCase() +
                        student.last_name.slice(1)}
                    </td>
                    <td>{student.username}</td>
                    <td>{getClassName(student.class_id)}</td>
                    <td>{getGroupName(student.group_id)}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                          Modify
                        </Dropdown.Toggle>
                        <Dropdown.Menu id={student.student_id}>
                          <Dropdown.Item onClick={() => history.push(`/teacher/students/edit?student_id=${student.student_id}&class_id=${student.class_id}&group_id=${student.group_id}&student_name=${student.first_name}`)}>Edit Student</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item style={{ color: 'red' }}>
                            Delete Student
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              : sorted.map((student) => (
                  <tr key={student.student_id} id={student.student_id}>
                    <td>First Name</td>
                    <td>Last</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <button className='btn btn-primary'>Edit</button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Students;
