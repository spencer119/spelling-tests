import React, { useState, useRef, useEffect, Fragment } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';

const Reports = ({ createAlert }) => {
  let fileDownload = require('js-file-download');
  const [downloading, setDownloading] = useState(false);
  const token = useRef(localStorage.getItem('token'));
  const [exportType, setExportType] = useState('all');
  const [tests, setTests] = useState([]);
  const [testSuggestions, setTestSuggestions] = useState([]);
  const [testSearch, setTestSearch] = useState('');
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch(() => {});
  }, []);
  const getReport = () => {
    if (downloading) return;
    let finalParams;
    switch (exportType) {
      case 'all':
        getExport();
      case 'test':
        let testObj = tests.find((tst) => tst.test_name === testSearch);
        if (testObj === undefined)
          return createAlert(
            'The test you provided does not exist.',
            'danger',
            5000
          );
        setParams((prev) => ({
          testName: testSearch,
          testId: testObj.test_id,
        }));
        finalParams = { testName: testSearch, testId: testObj.test_id };

        break;
      case 'date':
        finalParams = params;
        if (params.startDate > params.endDate)
          return createAlert(
            'Please double check the dates entered and try again.',
            'danger',
            5000
          );
        console.log(params.endDate > params.startDate);
      default:
        break;
    }
    setDownloading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/v2/teacher/report'
          : 'https://spelling-tests-backend.herokuapp.com/api/v2/teacher/report',
        {
          headers: {
            exportType,
            params: JSON.stringify(finalParams),
            token: token.current,
          },
        }
      )
      .then((res) => {
        fileDownload(res.data, 'export.csv');
        setDownloading(false);
      })
      .catch((err) => {
        console.error(err);
        createAlert(
          'There was an error exporting the data. Please try again.',
          'danger',
          5000
        );
        setDownloading(false);
      });
  };
  const getExport = () => {
    if (downloading) return;

    setDownloading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/v2/teacher/export'
          : 'https://spelling-tests-backend.herokuapp.com/api/v2/teacher/export',
        {
          headers: { exportType, token: token.current },
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
  const onSubmit = () => {
    if (exportType === 'all') getExport();
    else getReport();
  };
  const updateParam = (param, value) => {
    setParams((prev) => ({ ...prev, [param]: value }));
  };
  const searchTest = (e) => {
    setTestSearch(e.target.value);
    setParams({ testName: e.target.id });
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
            setParams({});
          }}
        >
          <option value='all'>Export All Results</option>
          <option value='date'>Report by Date</option>
          <option value='student'>Individual Student Report</option>
          <option value='test'>Test Report</option>
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
                onChange={(e) => updateParam('startDate', e.target.value)}
              />
            </div>
            <div className='col'>
              <label>End Date</label>
              <input
                type='date'
                placeholder='End Date'
                min='2019-01-01'
                className='form-control'
                onChange={(e) => updateParam('endDate', e.target.value)}
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
                  setParams({ testName: e.target.id });
                }}
              >
                {sug}
              </li>
            ))}
          </ul>
        </div>
      ) : exportType === 'student' ? (
        <div className='form-group'>
          <label>Student Name</label>
          <input
            type='text'
            value={testSearch}
            onChange={searchTest}
            className='form-control'
          />
          <br />
        </div>
      ) : null}
      <div className='form-group'>
        <button className='btn btn-primary form-control' onClick={onSubmit}>
          Export
        </button>
      </div>
    </div>
  );
};

export default Reports;
