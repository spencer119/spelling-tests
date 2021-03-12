import React, { useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateGroup = ({ createAlert }) => {
  let token = useRef(localStorage.getItem('token'));
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const class_id = query.get('class_id');
  const history = useHistory();
  const [groupName, setGroupName] = useState('');
  const onCreate = (e) => {
    e.preventDefault();
    let userToken = token.current;
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/group'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/group',
        { class_id, group_name: groupName },
        { headers: { token: userToken } }
      )
      .then((res) => {
        history.push('/teacher/classes');
        createAlert('Group created!', 'success', 5000);
      })
      .catch((err) => {
        history.push('/teacher/classes');
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
