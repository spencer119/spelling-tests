import React from 'react';
import { useLocation } from 'react-router-dom';

const EditGroup = () => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const group_id = query.get('group_id');
  return (
    <div className='container'>
      Edit Group
      <br />
      group id: <br />
      {group_id}
    </div>
  );
};

export default EditGroup;
