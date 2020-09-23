import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../Navbar';
import Results from './Results';
import Tests from './Tests';
import Groups from './Groups';
import Upload from './Upload';
import Classes from './Classes';
import Students from './Students.js';
const Teacher = ({createAlert }) => {
  const history = useHistory();
  const [active, setActive] = useState('results');
  useEffect(() => {
    if (localStorage.getItem('token') === '') {
      history.push('/teacher/login');
    }
  });
  return (
    <Fragment>
      <Navbar active={active} setActive={setActive} />
      <div className='container-fluid'>
        {active === 'results' ? (
          <Results />
        ) : active === 'tests' ? (
          <Tests />
        ) : active === 'groups' ? (
          <Groups />
        ) : active === 'upload' ? (
          <Upload />
        ) : active === 'classes' ? (
          <Classes/>
        ) : active === 'students' ? (
          <Students createAlert={createAlert} />
        ) : null}
      </div>
    </Fragment>
  );
};

export default Teacher;
