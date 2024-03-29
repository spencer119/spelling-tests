import React, { useEffect } from 'react';

export const Forbidden = () => {
  useEffect(() => {
    localStorage.clear();
  });
  return (
    <div>
      <h1>403 Forbidden</h1>
      <a href='/'>Go to home page</a>
    </div>
  );
};
export default Forbidden;
