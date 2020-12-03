import React from 'react';
import loading from '../loading.gif';

const Spinner = () => {
  return (
    <div>
      <img alt='loading' src={loading} style={{ display: 'block', margin: '0 auto' }}></img>
      <h3 className='text-center' style={{ transform: 'translate(0, -75px)' }}>
        Loading
      </h3>
    </div>
  );
};
export default Spinner;
