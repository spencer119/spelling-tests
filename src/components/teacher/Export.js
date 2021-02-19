import React, { useState, useRef } from 'react';
import axios from 'axios';

const Export = ({ createAlert }) => {
  let fileDownload = require('js-file-download');
  const [downloading, setDownloading] = useState(false);
  const token = useRef(localStorage.getItem('token'));

  const getData = (params) => {
    if (downloading) return;
    setDownloading(true);
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
        setDownloading(false);
      })
      .catch(() => {
        createAlert('There was an error exporting the data. Please try again.', 'danger', 5000);
        setDownloading(false);
      });
  };
  return (
    <div className='container'>
      Export <button onClick={getData}>GET</button>
    </div>
  );
};

export default Export;
