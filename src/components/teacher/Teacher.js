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
  useEffect(() => {
    if (localStorage.getItem('token') === '') {
      history.push('/teacher/login');
    }
  });
  return (
    <Fragment>
    </Fragment>
  );
};

export default Teacher;
