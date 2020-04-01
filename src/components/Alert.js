import React, { Fragment } from 'react';

const Alert = ({ alert, alertType }) => {
  if (alert === '' || alertType === '') return <Fragment />;

  const types = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ]; // List of alert types can also be found here https://getbootstrap.com/docs/4.0/components/alerts/
  if (!types.includes(alertType)) {
    console.error(`Invalid error type of ${alertType}`);
    return <Fragment />;
  }
  return (
    <div
      style={{ marginTop: '30px' }}
      className={`container alert alert-${alertType}`}
    >
      {alert}
    </div>
  );
};

export default Alert;
