import React, {useState, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Spinner'
const Result = ({createAlert}) => {
    const token = useRef(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    const [resultdata, setResultdata] = useState([])
    const [result, setResult] = useState({})
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
      const query = useQuery();
      let result_id = query.get('result_id')
      useEffect(() => {
          setLoading(true)
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
          setLoading(false);
          setResultdata(res.data.resultdata);
          setResult(res.data.result)
        })
        .catch(() => {
          createAlert(
            'There was an error fetching your student groups.',
            'danger',
            5000
          );
        });
      }, [])
    if (loading) return <Spinner />
    else
    return (
        <div className='container'>
            
            <div className="card text-center">
  <div className="card-header">
    Student Result
  </div>
  <div className="card-body">
    <h5 className="card-title">{result.student_id}</h5>
    <p className="card-text">Test: {result.test_id}<br />Score: 10/10</p>
    <button className="btn btn-primary">Go back</button>
  </div>
  <div className="card-footer text-muted">
    Time test was taken
  </div>
</div>
        </div>
    )
}

export default Result
