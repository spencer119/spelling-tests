import React, { useState, useRef } from 'react';
import axios from 'axios';

const Export = ({ createAlert }) => {
  let fileDownload = require('js-file-download');
  const token = useRef(localStorage.getItem('token'));

  const getData = (params) => {
    axios
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/v2/teacher/export'
          : 'https://spelling-tests-backend.herokuapp.com/api/v2/teacher/export',
        {
          headers: { token: token.current },
        }
      )
      .then((res) => {
        fileDownload(res.data, 'export.csv');
      })
      .catch(() => {
        createAlert('There was an error exporting the data. Please try again.', 'danger', 5000);
      });
  };
  return (
    <div className='container'>
      Export <button onClick={getData}>GET</button>
    </div>
  );
};

export default Export;
