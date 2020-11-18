import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Spinner from './Spinner'
const StudentScores = () => {
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [testNames, setTestNames] = useState([])
    const token = useRef(localStorage.getItem('token'))
    useEffect(() => {
        setLoading(true)
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
        setTestNames(res.data.testNames)
        setLoading(false)
      })
      .catch((err) => {});
    },[])
    if (loading) return <Spinner /> 
    else 
    return (
        <div className='container'>
            
            <ul className="list-group">
                {results.map(result => (<li className="list-group-item"></li>))}
            </ul>
        </div>
    )
    
}

export default StudentScores
