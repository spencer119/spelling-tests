import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Alert from './components/Alert';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from './components/Test';
import CreateTeacher from './components/admin/CreateTeacher'
import TeacherLogin from './components/teacher/TeacherLogin';
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
import Result from './components/teacher/Result'
import StudentHome from './components/StudentHome';
import FirstLogin from './components/teacher/FirstLogin';
function App() {
  const [alert, setAlert] = useState('');
  const [token, setToken] = useState('');
  const [alertType, setAlertType] = useState('');
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
              <Students createAlert={createAlert} />
            </Route>
            <Route path='/teacher/results'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Results createAlert={createAlert} />
            </Route>
            <Route path='/teacher/result'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <Result createAlert={createAlert} />
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
              <EditStudent createAlert={createAlert} />
            </Route>
            <Route path='/admin/teacher/create'>
              <Navbar />
              <Alert alert={alert} alertType={alertType} />
              <CreateTeacher />
            </Route>

          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
