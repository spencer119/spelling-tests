import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Alert from './components/Alert';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from './components/Test';
import Done from './components/Done';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import axios from 'axios';
function App() {
  const [alert, setAlert] = useState('');
  const [token, setToken] = useState('');
  const [alertType, setAlertType] = useState('');
  const [first, setFirst] = useState('');
  const [results, setResults] = useState({});
  const [testName, setTestName] = useState('');
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
  const gradeTest = (answers) => {
    console.log(answers);
    let total = answers.length;
    let correct = 0;
    answers.map((q) => {
      if (q.word.toLowerCase() === q.ans.toLowerCase()) {
        return correct++;
      } else return null;
    });
    setResults({
      name: first.toLowerCase(),
      test: testName,
      score: ((correct / total) * 100).toFixed(3),
      correct,
      total,
      data: answers,
    });
    axios
      .post('https://spelling-tests-backend.herokuapp.com/api/results', {
        name: first.toLowerCase(),
        testName,
        score: ((correct / total) * 100).toFixed(3),
        correct,
        total,
        data: answers,
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <Router>
      <div className='App'>
        <div>
          <Alert alert={alert} alertType={alertType} />
          <Switch>
            <Route
              exact
              path='/'
              render={(props) => (
                <Home
                  createAlert={createAlert}
                  first={first}
                  setFirst={setFirst}
                  setToken={setToken}
                />
              )}
            />
            <Route
              exact
              path='/test'
              render={(props) => (
                <Test
                  first={first}
                  createAlert={createAlert}
                  gradeTest={gradeTest}
                  token={token}
                  setTestName={setTestName}
                />
              )}
            />
            <Route
              exact
              path='/done'
              render={(props) => <Done results={results} />}
            />
            <Route
              exact
              path='/admin'
              render={(props) => <Admin token={token} />}
            />
            <Route
              exact
              path='/admin/login'
              render={(props) => (
                <AdminLogin setToken={setToken} createAlert={createAlert} />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
