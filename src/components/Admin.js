import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get('/api/admin/results')
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => console.error(err.message));
  }, []);
  return (
    <div>
      <div className='container'>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Student</th>
              <th scope='col'># Correct</th>
              <th scope='col'>Total #</th>
              <th scope='col'>Score</th>
              <th scope='col'>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.map(result => (
              <tr key={result.name}>
                <td>{result.name}</td>
                <td>{result.correct}</td>
                <td>{result.total}</td>
                <td>{result.score}%</td>
                <button
                  className='btn btn-primary'
                  style={{ position: 'relative', top: '6px' }}
                >
                  Data
                </button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
