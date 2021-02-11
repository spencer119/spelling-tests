import React from 'react';

const Feedback = () => {
  return (
    <div className='container'>
      <table className='table'>
        <thead className='thead-dark'>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Type</th>
            <th scope='col'>Submitted By</th>
            <th scope='col'></th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default Feedback;
