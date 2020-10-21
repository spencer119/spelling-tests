import React, {useState, useEffect, useRef} from 'react'
import {useLocation, Link} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Spinner'
const Result = ({createAlert}) => {
    const token = useRef(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    const [resultdata, setResultdata] = useState([])
    const [testName, setTestName] = useState('');
    const [student, setStudent] = useState({})
    const [result, setResult] = useState({})
    
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
      const query = useQuery();
      let result_id = query.get('result_id')
      useEffect(() => {
        let parse = require('postgres-date')
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
          setResultdata(res.data.resultdata);
          setResult(res.data.result)
          setStudent(res.data.student);
          setTestName(res.data.test_name)
            setLoading(false);
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
    <h5 className="card-title">{student.first_name} {student.last_name}</h5>
    <p>Username: {student.username}</p>
    <p className="card-text">Test: {testName}<br />Score: 10/10</p>
    <Link to='/teacher/results' className="btn btn-primary">Go back</Link>
  </div>
  <div className="card-footer text-muted">
    {/* {result.created_at} TIME */}
  </div>
</div>
<table className="table table-striped">
<thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Correct Answer</th>
      <th scope="col">Student Answer</th>
    </tr>
  </thead>
  <tbody>
    {resultdata.map(ans => (<tr style={{color: `${ans.correct ? 'green' : 'red'}`}}><th scope="row">{ans.line_number}</th>
    <td>{ans.word}</td>
    <td>{ans.answer}</td></tr>))}
    <tr style={{color: 'red'}}>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
    </tr>
  </tbody>
</table>
        </div>
    )
}

export default Result
