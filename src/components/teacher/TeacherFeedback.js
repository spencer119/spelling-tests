import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';
import { Dropdown } from 'react-bootstrap';

const TeacherFeedback = ({ createAlert }) => {
  const [feedback, setFeedback] = useState([]);
  const token = useRef(localStorage.getItem('token'));
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/feedback',
        { headers: { token: token.current } }
      )
      .then((res) => {
        setFeedback(res.data);
        setLoading(false);
      });
  }, []);
  const submitFeedback = (e) => {
    if (feedbackType === '' || newFeedback === '')
      return createAlert('One or more fields is missing', 'danger', 5000);
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher/feedback',
        {
          feedback: newFeedback,
          feedback_type: feedbackType,
        },
        { headers: { token: token.current } }
      )
      .then((res) => {
        setFeedbackType('');
        setNewFeedback('');
        createAlert('Feedback submitted! Thank you.', 'success', 5000);
      });
  };
  if (loading) {
  } else if (feedback.length === 0) {
  } else {
  }
  if (loading) return <Spinner />;
  else if (feedback.length === 0)
    return (
      <div className='container'>
        <p className='text-center'>You have not submitted any feedback.</p>
        <div className='text-center'>
          <button className='btn btn-primary' onClick={() => history.push('/teacher/home')}>
            Go Back
          </button>
        </div>
      </div>
    );
  else
    return (
      <div className='container'>
        <div className='text-center' style={{ paddingBottom: '25px' }}>
          <button className='btn btn-primary' onClick={() => history.push('/teacher/home')}>
            Go Back
          </button>
        </div>
        <div className='card bg-light mb-3 text-center'>
          <div className='card-header'>Submit New Feedback</div>
          <div className='card-body'>
            <p>Any bugs found, suggestions, or feedback of any kind can be submitted here.</p>

            <Dropdown style={{ marginBottom: '10px' }}>
              <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
                {feedbackType === ''
                  ? 'Select Feedback Type'
                  : `${feedbackType.charAt(0).toUpperCase()}${feedbackType.slice(
                      1 - feedbackType.length
                    )}`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFeedbackType('bug')}>Bug</Dropdown.Item>
                <Dropdown.Item onClick={() => setFeedbackType('suggestion')}>
                  Suggestion
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFeedbackType('other')}>Other</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p>
              Please be as descriptive as possible when reporting an error. If possible, include
              steps to recreate the issue. The issue will be addressed quickly and a response will
              be provided below.
            </p>
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              cols='30'
              placeholder='Description'
              rows='10'
              className='form-control'
              style={{ marginBottom: '10px' }}
            ></textarea>
            <button className='btn btn-success' onClick={submitFeedback}>
              Submit Feedback
            </button>
          </div>
        </div>
        <h3 className='text-center'>Feedback Status</h3>
        <br />
        <p>
          Feedback submitted will be viewed shortly and a response will be given. <br />
          All feedback has a status and a response from the developer. <br />
          <br />
          Possible Status:
          <br />
          <ul>
            <li style={{ color: '#f0ad4e' }}>
              Not Viewed: Your feedback will be reviewed soon. Wait for an update.
            </li>
            <li style={{ color: 'red' }}>
              Your feedback was rejected. A reason will have been provided below.
            </li>
            <li style={{ color: '#0275d8' }}>
              Your feedback is being worked on. The resposne may have an estimated time.
            </li>
            <li style={{ color: '#5cb85c' }}>
              Feedback implemented! The response may have specific details.
            </li>
          </ul>
        </p>
        <table className='table'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Date</th>
              <th scope='col'>Type</th>
              <th scope='col'>Feedback Sent</th>
              <th scope='col'>Status</th>
              <th scope='col'>Developer Response</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f) => (
              <tr key={f.feedback_id}>
                <th scope='row'>{new Date(f.created_at).toLocaleDateString()}</th>
                <td>{f.feedback_type.charAt(0).toUpperCase() + f.feedback_type.slice(1)}</td>
                <td>{f.feedback}</td>
                <td>
                  {f.status === 'Not Viewed' ? (
                    <p style={{ color: '#f0ad4e', userSelect: 'none' }}>Not Viewed</p>
                  ) : (
                    <p>
                      <a
                        style={{
                          color: `${
                            f.status === 'Not Viewed'
                              ? '#f0ad4e'
                              : f.status === 'Rejected'
                              ? 'red'
                              : f.status === 'In Progress'
                              ? '#0275d8'
                              : f.status === 'Resolved'
                              ? '#5cb85c'
                              : ''
                          }`,
                        }}
                        href='#'
                      >
                        {f.status}
                      </a>
                    </p>
                  )}
                </td>
                <td>
                  {f.response === null
                    ? 'No response has been provided. Please check back later.'
                    : f.response}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default TeacherFeedback;
