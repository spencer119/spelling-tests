import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Spinner from './Spinner'
const StudentScores = () => {
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [resultData, setResultData] = useState([])
    const [mastered, setMastered] = useState([]);
    const [study, setStudy] = useState([])
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
        setResultData(res.data.resultData)
        let masteredArr = [];
        let studyArr = [];
        res.data.resultData.map(result => {
          if (result.correct) {
            masteredArr.push(result.word)
          } else {
            studyArr.push(result.word)
          }
        })
        setMastered(masteredArr)
        setStudy(studyArr)
        setLoading(false)
      })
      .catch((err) => {});
    },[])
    if (loading) return <Spinner /> 
    else 
    return (
        <div className='container'>
          <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Time to study!</h1>
    <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
    <p className="lead"><button className='btn btn-primary'></button></p>
  </div>
</div>
            <div className="row">
              <div className="col">
                <table className='table'>
                  <thead>
                    <tr>
                      <th>
                      Words you've mastered!
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mastered.map(word => (<tr scope='row'>
                      <th>
                        {word}
                      </th>
                    </tr>))}
                  </tbody>
                </table>
              </div>
              <div className="col">
              <table className='table'>
              <thead>
                    <tr>
                      <th>
                      Words you should study
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {study.map(word => (<tr scope='row'>
                      <th>
                        {word}
                      </th>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
            <ul className="list-group">
                
            </ul>
        </div>
    )
    
}

export default StudentScores
