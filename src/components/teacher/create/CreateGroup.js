import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';

const CreateGroup = ({ createAlert }) => {
  let token = useRef(localStorage.getItem('token'));
  const history = useHistory();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [groupName, setGroupName] = useState('');
  useEffect(() => {
    token = localStorage.getItem('token');
    axios // get groups that relate to teacher id
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/classes'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/classes',
        { headers: { token } }
      )
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  const onClick = (e) => {
    setSelectedClass(e.target.getAttribute('class_name'));
    setSelectedClassId(e.target.id);
  };
  const onCreate = (e) => {
    e.preventDefault();
    if (groupName === '' || selectedClassId === '') {
      return createAlert(
        'Both a group name and a class must be assigned',
        'danger',
        5000
      );
    }
    let userToken = token.current;
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/group'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/group',
        { class_id: selectedClassId, group_name: groupName },
        { headers: { token: userToken } }
      )
      .then((res) => {
        history.push('/teacher/groups');
        createAlert('Group created!', 'success', 5000);
      })
      .catch((err) => {
        history.push('/teacher/groups');
        createAlert(
          'There was an error creating your group. Please try again.',
          'danger',
          5000
        );
      });
  };
  return (
    <div className='container-sm'>
      <h1 className='text-center' style={{ marginBottom: '30px' }}>
        Create Group
      </h1>
      <form>
        <div className='form-row'>
          <div className='col'>
            <input
              className='form-control'
              type='text'
              placeholder='Group Name'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className='col'>
            <Dropdown>
              <Dropdown.Toggle
                style={{ width: '100%' }}
                variant='primary'
                id='dropdown-basic'
              >
                {selectedClass === ''
                  ? 'Assign the Group to a Class'
                  : selectedClass}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {classes.map((x) => (
                  <Dropdown.Item
                    id={x.class_id}
                    key={x.class_id}
                    class_name={x.class_name}
                    onClick={onClick}
                  >
                    {x.class_name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='col'>
            <button
              style={{ width: '100%' }}
              className='btn btn-success'
              onClick={onCreate}
            >
              Create Group
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
