import React from 'react';

const Tests = ({ tests }) => {
  console.log(tests);
  return (
    <div className='container'>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Test</th>
            <th scope='col'>Group</th>
            <th scope='col'>Modify</th>
            <th scope='col'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(test => (
            <tr key={test.id}>
              <td>{test.id}</td>
              <td>{test.group}</td>
              <td>
                <button
                  className='btn btn-primary'
                  style={{ position: 'relative', bottom: '5px' }}
                >
                  Modify
                </button>
              </td>
              <td>
                <button
                  className='btn btn-danger'
                  style={{ position: 'relative', bottom: '5px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tests;
