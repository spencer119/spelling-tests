import React, {useState, useEffect, useRef, Fragment} from 'react'
import {useHistory, useLocation, Link} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Spinner'
const ChangeClass = () => {
    const token = useRef(localStorage.getItem('token'));
    const [classes, setClasses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading]  = useState(true)
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('')
    const [classHover, setClassHover] = useState('');
    const history = useHistory();
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
      const query = useQuery();
      const student_name = query.get('student_name');
      const student_id = query.get('student_id')
      const getClassGroups = () => {
        let groupsInClass = [];
        groups.map(g => {
          if (g.class_id === selectedClass) groupsInClass.push(g)
        })
        return groupsInClass
      }
    useEffect(() => {
        setLoading(true)
        axios // get student data
      .get(
        process.env.NODE_ENV === 'development'
          ? '/api/teacher'
          : 'https://spelling-tests-backend.herokuapp.com/api/teacher',
        { headers: { token: token.current } }
      )
      .then((res) => {
        setClasses(res.data.classes)
        setGroups(res.data.groups)
        setSelectedClass(query.get('class_id'))
        setSelectedGroup(query.get('group_id'))
        setLoading(false)
      })
      .catch((err) => {
        history.push('/teacher/students')
      });
    }, [])
    if (loading) return <Spinner />
    else
    return (
        <div className='container'>
          <h2 className='text-center'>Edit Student: {student_name}</h2>
          <div className="row">
            <div className="col"><h4 className="text-center">Class</h4>
            <ul className='list-group'>
              {classes.map((x) => (
                <li
                  key={x.class_id}
                  style={{ cursor: 'pointer', width: '100%' }}
                  className={
                    selectedClass === x.class_id
                      ? 'list-group-item d-flex justify-content-between align-items-center active'
                      : classHover === x.class_id
                      ? 'list-group-item d-flex justify-content-between align-items-center list-group-hover'
                      : 'list-group-item d-flex justify-content-between align-items-center'
                  }
                  id={x.class_id}
                  onClick={(e) => setSelectedClass(e.target.id)}
                  onMouseEnter={(e) => setClassHover(e.target.id)}
                  onMouseLeave={() => setClassHover('')}
                >
                  {x.class_name}
                </li>
              ))}
            </ul></div>
                <div className="col">{selectedClass === '' ? null : <Fragment><div className="col"><h4 className="text-center">Group</h4>
            <ul className='list-group'>
              {getClassGroups().map((x) => (
                <li
                  key={x.group_id}
                  style={{ cursor: 'pointer', width: '100%' }}
                  className={
                    selectedClass === x.group_id
                      ? 'list-group-item d-flex justify-content-between align-items-center active'
                      : classHover === x.group_id
                      ? 'list-group-item d-flex justify-content-between align-items-center list-group-hover'
                      : 'list-group-item d-flex justify-content-between align-items-center'
                  }
                  id={x.group_id}
                  onClick={(e) => setSelectedClass(e.target.id)}
                  onMouseEnter={(e) => setClassHover(e.target.id)}
                  onMouseLeave={() => setClassHover('')}
                >
                  {x.group_name}
                </li>
              ))}
            </ul></div></Fragment>}</div>
          </div>
            
            <button style={{width: '100%', marginTop: '20px'}} className="btn btn-success" disabled={selectedClass === '' ? true : false}>Change Class</button>
            <Link to='/teacher/students' className='btn btn-primary' style={{marginTop: '10px', width: '100%'}}>Go Back</Link>
        </div>
    )
}

export default ChangeClass
