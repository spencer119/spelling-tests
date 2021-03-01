import React, { useState, useRef, useEffect, Fragment } from 'react';
import axios from 'axios';

const Export = ({ createAlert }) => {
  let fileDownload = require('js-file-download');
  const [downloading, setDownloading] = useState(false);
  const token = useRef(localStorage.getItem('token'));
  const [exportType, setExportType] = useState('all');
  const [tests, setTests] = useState([]);
  const [testSuggestions, setTestSuggestions] = useState([]);
  const [testSearch, setTestSearch] = useState('');

  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        setTests(res.data.tests);
      })
      .catch(() => {});
  }, []);
  const getData = (params) => {
    if (downloading) return;
    setDownloading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/v2/teacher/export'
          : 'https://spelling-tests-backend.herokuapp.com/api/v2/teacher/export',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        fileDownload(res.data, 'export.csv');
        setDownloading(false);
      })
      .catch(() => {
        createAlert(
          'There was an error exporting the data. Please try again.',
          'danger',
          5000
        );
        setDownloading(false);
      });
  };
  const searchTest = (e) => {
    setTestSearch(e.target.value);
    if (e.target.value.length < 3) return setTestSuggestions([]);
    let done = false;
    tests.forEach((t) => {
      if (t.test_name === e.target.value) {
        done = true;
        return;
      }
    });
    if (done) return setTestSuggestions([]);
    let match = tests.filter((tst) =>
      tst.test_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setTestSuggestions(
      match.map((t) => {
        return t.test_name;
      })
    );
  };
  return (
    <div className='container'>
      <div className='form-group'>
        <label>Select how you would like to export.</label>
        <select
          className='form-control'
          value={exportType}
          onChange={(e) => {
            setExportType(e.target.value);
          }}
        >
          <option value='all'>Export All Results</option>
          <option value='date'>Export by Date</option>
          <option value='student'>Export by Student</option>
          <option value='test'>Export by Test</option>
          <option value='group'>Export by Group</option>
        </select>
      </div>
      {exportType === 'date' ? (
        <div className='form-group'>
          <div className='row'>
            <div className='col'>
              <label>Start Date</label>
              <input
                type='date'
                placeholder='Start Date'
                min='2019-01-01'
                className='form-control'
              />
            </div>
            <div className='col'>
              <label>End Date</label>
              <input
                type='date'
                placeholder='End Date'
                min='2019-01-01'
                className='form-control'
              />
            </div>
          </div>
        </div>
      ) : exportType === 'test' ? (
        <div className='form-group'>
          <label>Test Name</label>
          <input
            type='text'
            value={testSearch}
            onChange={searchTest}
            className='form-control'
          />
          <br />
          <ul className='list-group list-group-horizontal'>
            {testSuggestions.map((sug) => (
              <li
                key={sug}
                id={sug}
                className='list-group-item list-group-item-action'
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  setTestSearch(e.target.id);
                  setTestSuggestions([]);
                }}
              >
                {sug}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className='form-group'>
        <button className='btn btn-primary form-control' onClick={getData}>
          Export
        </button>
      </div>
    </div>
  );
};

export default Export;
