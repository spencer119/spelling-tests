import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';
import Feedback from 'react-bootstrap/Feedback';
const TeacherHome = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [results, setResults] = useState([]);
  const [username, setUsername] = useState('');
  const [version, setVersion] = useState('');
  const [groups, setGroups] = useState([]);
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  const getTestName = (test_id) => {
    if (test_id === null) return 'None';
    let testObj = tests.find((test) => test.test_id === test_id);
    return testObj.test_name;
  };
  const getGroupName = (group_id) => {
    let groupObj = groups.find((g) => g.group_id === group_id);
    return groupObj.group_name;
  };
  const getStudentName = (student_id) => {
    let studentObj = students.find((s) => s.student_id === student_id);
    return studentObj.first_name + ' ' + studentObj.last_name;
  };
  const submitFeedback = (e) => {
    if (feedbackType === '' || feedback === '')
      return createAlert('One or more fields is missing', 'danger', 5000);
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/feedback',
        {
          feedback,
          feedback_type: feedbackType,
        },
        { headers: { token: token.current } }
      )
      .then((res) => {
        setFeedbackType('');
        setFeedback('');
        createAlert('Feedback submitted! Thank you.', 'success', 5000);
      });
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/home'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/home',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        let updateArr = Object.keys(res.data.latestChangelog)
          .filter((key) => key !== 'Date' && key !== 'Version')
          .reduce((obj, key) => {
            obj[key] = res.data.latestChangelog[key];
            return obj;
          }, {});
        setDate(res.data.latestChangelog['Date']);
        setVersion(res.data.latestChangelog['Version']);
        setUpdates(updateArr);
        setResults(res.data.results);
        setTests(res.data.tests);
        setGroups(res.data.groups);
        setStudents(res.data.students);
        setUsername(res.data.username);
        setLoading(false);
      })
      .catch(() => {});
  }, []);
  if (loading) return <Spinner />;
  else
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col text-center'>
            <div className='card bg-light mb-3'>
              <div className='card-header'>Group Current Tests</div>
              <div className='card-body'>
                {groups.map((group) => (
                  <Fragment>
                    {group.group_name} <i class='fas fa-angle-double-right' />{' '}
                    {getTestName(group.active_test)} <br />
                  </Fragment>
                ))}
              </div>
            </div>
            <div className='card bg-light mb-3'>
              <div className='card-header'>Site Feedback</div>
              <div className='card-body'>
                <p>Any bugs found, suggestions, or feedback of any kind can be submitted here.</p>
                <input
                  type='text'
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className='form-control'
                  placeholder='Feedback type (Bug, suggestion, issue, etc.)'
                  style={{ marginBottom: '10px' }}
                />
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  cols='30'
                  placeholder='Description'
                  rows='10'
                  className='form-control'
                  style={{ marginBottom: '10px' }}
                ></textarea>
                <button className='btn btn-primary' onClick={submitFeedback}>
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
          <div className='col-6 text-center'>
            <div className='card text-center'>
              <div className='card-header'>Home</div>
              <div className='card-body'>
                <h5 className='card-title'>Welcome {username}</h5>
                <p className='card-text'>You are on the home page.</p>
                <Link to='/teacher/results' class='btn btn-primary'>
                  See All Results
                </Link>
              </div>
              {results.length === 0 ? null : <div className='card-footer'>Most Recent Results</div>}
            </div>
            {results.length === 0 ? null : (
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>Name</th>
                    <th scope='col'>Test</th>
                    <th scope='col'>Group</th>
                    <th scope='col'>Attempt</th>
                    <th scope='col'>Score</th>
                    <th scope='col'>See More</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.result_id} id={result.result_id}>
                      <td>{getStudentName(result.student_id)}</td>
                      <td>{getTestName(result.test_id)}</td>
                      <td>{getGroupName(result.group_id)}</td>
                      <td>{result.attempt}</td>
                      <td>
                        {result.correct}/{result.total} | {result.score * 100}%
                      </td>
                      <td>
                        <Link
                          to={`/teacher/result?result_id=${result.result_id}&back=home`}
                          className='btn btn-primary'
                        >
                          See More
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className='col'>
            <div className='card bg-light mb-3'>
              <div className='card-header'>Latest Updates</div>
              <div className='card-body'>
                <h4 className='card-title'>
                  Version {version} - {date}
                </h4>
                {Object.keys(updates).map((key) => (
                  <Fragment>
                    <h5 className='card-title'>{key}</h5>
                    <p className='card-text'>
                      {updates[key].map((update) => (
                        <Fragment>
                          <i class='fas fa-angle-double-right' /> {update} <br />
                        </Fragment>
                      ))}
                    </p>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col align-self-start'></div>
          <div className='col-6'></div>
          <div className='col'></div>
        </div>
      </div>
    );
};

export default TeacherHome;
