import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';
const StudentScores = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [mastered, setMastered] = useState([]);
  const [study, setStudy] = useState([]);
  const token = useRef(localStorage.getItem('token'));
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? `/api/student/scores`
          : `https://spelling-tests-backend.herokuapp.com/api/student/scores`,
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        setResults(res.data.results);
        let lastAttemptID = res.data.results[res.data.results.length - 1].result_id;
        let masteredArr = [];
        let studyArr = [];
        res.data.resultData.map((result) => {
          if (result.result_id !== lastAttemptID) return;
          if (result.correct) {
            let found = masteredArr.find((word) => word === result.word);
            if (found === undefined) {
              masteredArr.push(result.word);
            }
          } else {
            let found = studyArr.find((word) => word === result.word);
            if (found === undefined) {
              studyArr.push(result.word);
            }
          }
        });
        studyArr = studyArr.filter((word) => !masteredArr.includes(word));
        setMastered(masteredArr);
        setStudy(studyArr);
        setLoading(false);
      })
      .catch((err) => {});
  }, []);
  if (loading) return <Spinner />;
  else
    return (
      <div className='container'>
        <div className='jumbotron jumbotron-fluid'>
          <div className='container'>
            <h1 className='display-4'>Time to study!</h1>
            <p className='lead'>
              Last time you took the test you got {results[results.length - 1].correct} words
              correct out of {results[results.length - 1].total} total words.
            </p>
            <p className='lead'>
              <Link to='/student/home' className='btn btn-primary'>
                Go back
              </Link>
            </p>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Words you've mastered!</th>
                </tr>
              </thead>
              <tbody>
                {mastered.map((word) => (
                  <tr key={word}>
                    <th>{word}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='col'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Words you should study</th>
                </tr>
              </thead>
              <tbody>
                {study.map((word) => (
                  <tr key={word}>
                    <th>{word}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ul className='list-group'></ul>
      </div>
    );
};

export default StudentScores;
