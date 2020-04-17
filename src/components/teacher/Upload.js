import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Upload = ({ token }) => {
  const [missing, setMissing] = useState('');
  const [count, setCount] = useState(0);
  const getMissing = () => {
    axios.get('/api/teacher/tests', { headers: { token } }).then((res) => {
      setMissing(res.data.missing.join('\n'));
      setCount(res.data.missing.length);
    });
  };
  useEffect(() => {
    getMissing();
  }, []);
  const [files, setFiles] = useState([]);
  const onClick = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    for (var x = 0; x < files.length; x++) {
      data.append('file', files[x]);
    }
    axios
      .post('/api/teacher/upload', data, { headers: { token } })
      .then((res) => {
        alert('Files uploaded.');
        getMissing();
      })
      .catch(() => alert('There was an error uploading the file(s).'));
  };
  const onChange = (e) => {
    setFiles(e.target.files);
  };
  return (
    <div className='container'>
      <form>
        <input type='file' onChange={onChange} multiple />
        <button className='btn btn-success' onClick={onClick}>
          Upload Files
        </button>
      </form>
      <p>Below is a list of missing files. Upload them to remove the error.</p>
      <p style={count === 0 ? { color: 'green' } : { color: 'red' }}>
        You have {count} missing files.
      </p>
      <textarea
        style={{ marginTop: '20px' }}
        className='form-control'
        defaultValue={missing}
        name='files'
        readOnly
        rows='20'
      ></textarea>
    </div>
  );
};

export default Upload;
