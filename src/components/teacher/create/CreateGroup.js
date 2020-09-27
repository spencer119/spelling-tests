import React from 'react';
import { Dropdown } from 'react-bootstrap';

const CreateGroup = () => {
  return (
    <div className='container-sm'>
      <h1 className='text-center' style={{ marginBottom: '30px' }}>
        Create Group
      </h1>
      <form>
        <div className='form-row'>
          <div className='col'>
            <input
              className='form-control'
              type='text'
              placeholder='Group Name'
            />
          </div>
          <div className='col'>
            <Dropdown>
              <Dropdown.Toggle
                style={{ width: '100%' }}
                variant='primary'
                id='dropdown-basic'
              >
                Assign the Group to a Class
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>test</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>No test</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='col'>
            <button style={{ width: '100%' }} className='btn btn-success'>
              Create Group
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
