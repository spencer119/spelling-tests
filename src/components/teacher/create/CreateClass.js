import React, {useState, useRef} from 'react';
import {useHistory} from 'react-router-dom'
import axios from 'axios'
const CreateClass = ({createAlert}) => {
  const history = useHistory()
  const token = useRef(localStorage.getItem('token'))
  const [className, setClassName] = useState('')
  const onClick = e => {
    e.preventDefault()
    if (className === '') {
      return createAlert('You must enter a class name.', 'danger', 5000)
    } else {
      axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/classes'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/classes',
        { class_name: className },
        { headers: { token: token.current } }
      )
      .then((res) => {
        console.log(res);
        console.log('success')
        history.push('/teacher/classes');
        createAlert('Class created!', 'success', 5000);
      })
      .catch((err) => {
        history.push('/teacher/classes');
        createAlert(
          'There was an error creating your class. Please try again.',
          'danger',
          5000
        );
      });
    }
  }
  return (
    <div className='container'>
      <p>Enter a name for your new class and click Create Class.</p>
      <form>
        <div className='form-row'>
          <div className='col'>
            <input type='text' value={className} onChange={(e) => setClassName(e.target.value)} className='form-control' placeholder='Create Class' />
          </div>
          <button className="btn btn-success" onClick={onClick}>Create Class</button>
        </div>
      </form>
    </div>
  );
};

export default CreateClass;
