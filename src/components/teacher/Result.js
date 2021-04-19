import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';
const Result = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [resultdata, setResultdata] = useState([]);
  const [testName, setTestName] = useState('');
  const [student, setStudent] = useState({});
  const [result, setResult] = useState({});
  const [fdate, setFdate] = useState();
  const history = useHistory();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  let result_id = query.get('result_id');
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/result'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/result',
        {
          headers: { token: token.current, result_id },
        }
      )
      .then((res) => {
        setResultdata(res.data.resultdata);
        setResult(res.data.result);
        setStudent(res.data.student);
        setTestName(res.data.test_name);
        let dateFormatted = new Date(res.data.result.created_at);
        setFdate(
          dateFormatted.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })
        );
        setLoading(false);
      })
      .catch(() => {
        createAlert(
          'There was an error fetching your student groups.',
          'danger',
          5000
        );
      });
  }, []);
  const deleteAttempt = (e) => {
    e.preventDefault();
    axios
      .delete(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/result'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/result',
        {
          headers: {
            token: token.current,
            result_id,
          },
        }
      )
      .then(() => {
        history.push('/teacher/results');
        createAlert('Attempt deleted!', 'success', 5000);
      })
      .catch(() => {
        createAlert('An error has occured.', 'danger', 5000);
      });
  };
  if (loading) return <Spinner />;
  else
    return (
      <div className='container'>
        <div className='card text-center'>
          <div className='card-header'>Student Result</div>
          <div className='card-body'>
            <h5 className='card-title'>
              {student.first_name} {student.last_name}
            </h5>
            <p>Username: {student.username}</p>
            <p className='card-text'>
              Test: {testName}
              <br />
              Attempt {result.attempt}
              <br />
              Score: {result.correct}/{result.total} <br />{' '}
              {((result.correct / result.total) * 100).toFixed(2)}%
            </p>
            <div className='no-print'>
              <button
                className='btn btn-danger'
                onClick={deleteAttempt}
                style={{ marginBottom: '5px' }}
              >
                Delete Attempt
              </button>{' '}
              <br />
              <Link
                to={
                  query.get('back') === 'home'
                    ? '/teacher/home'
                    : '/teacher/results'
                }
                className='btn btn-primary'
                style={{ marginBottom: '5px' }}
              >
                Go back
              </Link>
              <br />
              <button
                className='btn btn-success'
                onClick={() => window.print()}
              >
                Print/Save to PDF
              </button>
            </div>
          </div>
          <div className='card-footer text-muted'>{fdate}</div>
        </div>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Correct Answer</th>
              <th scope='col'>Student Answer</th>
            </tr>
          </thead>
          <tbody>
            {resultdata.map((ans) => (
              <tr style={{ color: `${ans.correct ? 'green' : 'red'}` }}>
                <th scope='row'>{ans.line_number}</th>
                <td>{ans.word}</td>
                <td>{ans.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default Result;
