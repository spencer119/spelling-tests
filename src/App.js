import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Alert from './components/Alert';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from './components/Test';
import Done from './components/Done';
import TeacherLogin from './components/teacher/TeacherLogin';
import axios from 'axios';
import EditStudent from './components/teacher/EditStudent'
import Maintenance from './components/Maintenance';
import Navbar from './components/Navbar';
import Students from './components/teacher/Students';
import Results from './components/teacher/Results';
import Tests from './components/teacher/Tests';
import Groups from './components/teacher/Groups';
import CreateClass from './components/teacher/create/CreateClass';
import CreateGroup from './components/teacher/create/CreateGroup';
import Classes from './components/teacher/Classes';
import StudentHome from './components/StudentHome';
import FirstLogin from './components/teacher/FirstLogin';
function App() {
  const [alert, setAlert] = useState('');
  const [token, setToken] = useState('');
  const [alertType, setAlertType] = useState('');
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
    // return new Promise((resolve, reject) => {
    //   let total = answers.length;
    //   let correct = 0;
    //   answers.map((q) => {
    //     if (q.word.toLowerCase() === q.ans.toLowerCase()) {
    //       return correct++;
    //     } else return null;
    //   });
    //   setResults({
    //     name: first.toLowerCase(),
    //     test: testName,
    //     score: ((correct / total) * 100).toFixed(3),
    //     correct,
    //     total,
    //     data: answers,
    //   });
    //   axios
    //     .post(
    //       process.env.NODE_ENV === 'development'
    //         ? '/api/results'
    //         : 'https://spelling-tests-backend.herokuapp.com/api/results',
    //       {
    //         name: first.toLowerCase(),
    //         testName,
    //         score: ((correct / total) * 100).toFixed(3),
    //         correct,
    //         total,
    //         data: answers,
    //         token,
    //       }
    //     )
    //     .then((res) => {
    //       resolve(res);
    //     })
    //     .catch((err) => {
    //       reject(err);
    //     });
    // });
  };
  return (
    <Router>
      <div className='App'>
        <div>
          <Switch>
            <Route exact path='/'>
              <Alert alert={alert} alertType={alertType} />
              <Home createAlert={createAlert} />
            </Route>
            <Route exact path='/student/test'>
              <Alert alert={alert} alertType={alertType} />
              <Test createAlert={createAlert} />
            </Route>
            <Route exact path='/student/home'>
              <Alert alert={alert} alertType={alertType} />
              <StudentHome createAlert={createAlert} />
            </Route>
            <Route exact path='/done'>
              <Alert alert={alert} alertType={alertType} />
              <Done results={results} />
            </Route>
            <Route exact path='/maintenance'>
              <Alert alert={alert} alertType={alertType} />
              <Maintenance />
            </Route>
            <Route exact path='/teacher/login'>
              <Alert alert={alert} alertType={alertType} />
              <TeacherLogin setToken={setToken} createAlert={createAlert} />
            </Route>
            <Route exact path='/teacher/login/firstlogin'>
              <Alert alert={alert} alertType={alertType} />
              <FirstLogin createAlert={createAlert} />
            </Route>
            <Route exact path='/teacher/students'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Students />
            </Route>
            <Route path='/teacher/results'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Results />
            </Route>
            <Route path='/teacher/tests'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Tests createAlert={createAlert} />
            </Route>
            <Route exact path='/teacher/groups'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Groups createAlert={createAlert} />
            </Route>
            <Route exact path='/teacher/classes'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Classes createAlert={createAlert} />
            </Route>
            <Route exact path='/teacher/classes/create'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <CreateClass createAlert={createAlert} />
            </Route>
            <Route path='/teacher/groups/create'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <CreateGroup createAlert={createAlert} />
            </Route>
            <Route path='/teacher/students/edit'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <EditStudent />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
