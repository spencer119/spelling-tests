import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const Feedback = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [feedback, setFeedback] = useState([]);
  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/admin/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/admin/feedback',
        { headers: { token: token.current } }
      )
      .then((res) => {
        setFeedback(res.data);
      });
  }, []);
  return (
    <div className='container'>
      <table className='table'>
        <thead className='thead-dark'>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Type</th>
            <th scope='col'>Submitted By</th>
            <th scope='col'>Feedback</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((f) => (
            <tr>
              <th scope='row'>{Date(f.created_at).toLocaleString()}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;
