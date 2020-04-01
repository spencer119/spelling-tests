import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Navbar from './Navbar';
import Results from './admin/Results';
import Tests from './admin/Tests';

const Admin = ({ token }) => {
  const [results, setResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const history = useHistory();
  const [active, setActive] = useState('results');
  useEffect(() => {
    if (token === '') {
      history.push('/admin/login');
    } else {
      axios
        .get('/api/admin', {
          headers: { token }
        })
        .then(res => {
          console.log(res.data);
          setGroups(res.data.groups);
          setTests(res.data.tests);
          setResults(res.data.results);
          setStudents(res.data.students);
        })
        .catch(err => console.error(err.message));
    }
  }, [history, token]);
  return (
    <Fragment>
      <Navbar active={active} setActive={setActive} />
      <div className='container-fluid'>
        {active === 'results' ? (
          <Results results={results} setResults={setResults} />
        ) : active === 'tests' ? (
          <Tests tests={tests} />
        ) : active === 'students' ? (
          <Fragment />
        ) : null}
      </div>
    </Fragment>
  );
};

export default Admin;
