import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../Navbar';
import Results from './Results';
import Tests from './Tests';
import Groups from './Groups';
import Upload from './Upload';
const Teacher = ({ token }) => {
  const history = useHistory();
  const [active, setActive] = useState('results');
  useEffect(() => {
    if (token === '') {
      history.push('/teacher/login');
    }
  });
  return (
    <Fragment>
      <Navbar active={active} setActive={setActive} />
      <div className='container-fluid'>
        {active === 'results' ? (
          <Results token={token} />
        ) : active === 'tests' ? (
          <Tests token={token} />
        ) : active === 'groups' ? (
          <Groups token={token} />
        ) : active === 'upload' ? (
          <Upload token={token} />
        ) : null}
      </div>
    </Fragment>
  );
};

export default Teacher;
