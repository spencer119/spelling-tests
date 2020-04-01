import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

const Done = ({ results }) => {
  const history = useHistory();
  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };
  if (isEmpty(results)) {
    history.push('/');
    return <Fragment />;
  }
  return (
    <div className='container'>
      <strong>
        <h1 className='title'>Mrs. Hamilton's Spelling Test</h1>
      </strong>
      <div className='alert alert-success'>
        Test submitted. You may close this window.
      </div>
      <div className='container'>
        <div style={{ textAlign: 'center' }}>
          You answered {results.correct} out of {results.total} correct.{' '}
          {results.score}%
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Correct Word</th>
              <th scope='col'>Your answer</th>
            </tr>
          </thead>
          <tbody>
            {results.data.map(obj => (
              <tr key={obj.word}>
                <td>{obj.word}</td>
                <td>{obj.ans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Done;
