import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Alert from './components/Alert';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from './components/Test';
function App() {
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState('');
  const [first, setFirst] = useState('');
  const [test, setTest] = useState(0);

  const createAlert = (msg, type, time) => {
    // Creates an alert with a msg, type (see Alert.js for types), and time (in milliseconds) setting a time of 0 makes a permanant alert
    setAlert(msg);
    setAlertType(type);
    if (time !== 0)
      setTimeout(() => {
        setAlert('');
        setAlertType('');
      }, time);
  };
  return (
    <Router>
      <div className='App'>
        <div className='container'>
          <strong>
            <h1 className='title'>Mrs. Hamilton's Spelling Test</h1>
          </strong>
          <Alert alert={alert} alertType={alertType} />
          <Switch>
            <Route
              exact
              path='/'
              render={props => (
                <Home
                  createAlert={createAlert}
                  first={first}
                  setFirst={setFirst}
                  setTest={setTest}
                />
              )}
            />
            <Route
              exact
              path='/test'
              render={props => <Test first={first} test={test} />}
            />
          </Switch>
        </div>
      </div>
      <footer>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          If you have any issues taking the test, please contact{' '}
          <a href='mailto:khamilton@mdsd.org'>Mrs. Hamilton</a>
        </p>
      </footer>
    </Router>
  );
}

export default App;
