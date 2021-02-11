import React, { useEffect, useRef, useState, Fragment } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Spinner from '../Spinner';
const AdminFeedback = ({ createAlert }) => {
  const token = useRef(localStorage.getItem('token'));
  const [feedback, setFeedback] = useState([]);
  const [teacherIds, setTeacherIds] = useState([]);
  const [show, setShow] = useState(false);
  const [update, setUpdate] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setUpdate({});
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const getFeedback = () => {
    setLoading(true);
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/admin/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/admin/feedback',
        { headers: { token: token.current } }
      )
      .then((res) => {
        setFeedback(res.data.feedback);
        setTeacherIds(res.data.teacherIds);
        setLoading(false);
      });
  };
  useEffect(() => {
    getFeedback();
  }, []);
  const updateFeedback = () => {
    axios
      .put(
        process.env.NODE_ENV === 'development'
          ? '/api/admin/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/admin/feedback',
        { feedback_id: update.feedback_id, status: update.status, response: update.response },
        { headers: { token: token.current } }
      )
      .then((res) => {
        getFeedback();
        handleClose();
        createAlert('Feedback updated!', 'success', 5000);
      });
  };
  const deleteFeedback = () => {
    axios
      .delete(
        process.env.NODE_ENV === 'development'
          ? '/api/admin/feedback'
          : 'https://spelling-tests-backend.herokuapp.com/api/admin/feedback',
        { headers: { token: token.current, feedback_id: update.feedback_id } }
      )
      .then((res) => {
        getFeedback();
        handleClose();
        createAlert('Feedback deleted!', 'success', 5000);
      });
  };
  const getUsername = (id) => {
    let found = teacherIds.find((t) => t.teacher_id === id);
    if (found === undefined) return '';
    else return found.username;
  };
  const statusChange = (e) => {
    let newStatus = e.target.id;
    setUpdate({ ...update, status: newStatus });
  };
  if (loading) return <Spinner />;
  else
    return (
      <div className='container'>
        <Modal
          size='sm'
          show={showResponse}
          onHide={() => setShowResponse(false)}
          backdrop='static'
        >
          <Modal.Header closeButton>
            <Modal.Title>Response</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{response === null ? 'No response provided.' : response}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-danger' onClick={() => setShowResponse(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <Modal size='lg' show={show} onHide={handleClose} backdrop='static'>
          <Modal.Header closeButton>
            <Modal.Title>Update Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>User:</b> {getUsername(update.submitted_by)}
            <p>{update.feedback}</p>
            <div className='row'>
              <div className='col-sm'>
                <button
                  className={`form-control btn btn-${
                    update.status === 'Not Viewed' ? '' : 'outline-'
                  }warning`}
                  id='Not Viewed'
                  onClick={statusChange}
                >
                  Not Viewed
                </button>
              </div>
              <div className='col-sm'>
                <button
                  className={`form-control btn btn-${
                    update.status === 'Rejected' ? '' : 'outline-'
                  }danger`}
                  id='Rejected'
                  onClick={statusChange}
                >
                  Rejected
                </button>
              </div>
              <div className='col-sm'>
                <button
                  className={`form-control btn btn-${
                    update.status === 'In Progress' ? '' : 'outline-'
                  }primary`}
                  id='In Progress'
                  onClick={statusChange}
                >
                  In Progress
                </button>
              </div>
              <div className='col-sm'>
                <button
                  className={`form-control btn btn-${
                    update.status === 'Resolved' ? '' : 'outline-'
                  }success`}
                  id='Resolved'
                  onClick={statusChange}
                >
                  Resolved
                </button>
              </div>
            </div>
            <label>Response</label>
            <textarea
              cols='30'
              rows='10'
              className='form-control'
              value={update.response}
              onChange={(e) => setUpdate({ ...update, response: e.target.value })}
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger mr-auto' onClick={deleteFeedback}>
              Delete Feedback
            </button>
            <button className='btn btn-danger' onClick={handleClose}>
              Close
            </button>
            <button className='btn btn-success' onClick={updateFeedback}>
              Update
            </button>
          </Modal.Footer>
        </Modal>
        <table className='table'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Date</th>
              <th scope='col'>Type</th>
              <th scope='col'>Submitted By</th>
              <th scope='col'>Feedback</th>
              <th scope='col'>Status</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f) => (
              <tr key={f.feedback_id}>
                <th scope='row'>{new Date(f.created_at).toLocaleDateString()}</th>
                <td>{f.feedback_type.charAt(0).toUpperCase() + f.feedback_type.slice(1)}</td>
                <td>{getUsername(f.submitted_by)}</td>
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
                        onClick={() => {
                          setResponse(f.response);
                          setShowResponse(true);
                        }}
                      >
                        {f.status}
                      </a>
                    </p>
                  )}
                </td>
                <td>
                  <a
                    href='#'
                    onClick={() => {
                      handleShow();
                      setUpdate(f);
                    }}
                  >
                    Update
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default AdminFeedback;
