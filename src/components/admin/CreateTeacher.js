import React, {useState, useRef} from 'react'
import axios from 'axios'
const CreateTeacher = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [useDefaultPassword, setUseDefaultPassword] = useState(true)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const token = useRef(localStorage.getItem('token'))
    const onClick = e => {
        axios
        .post(
          process.env.NODE_ENV === 'development'
            ? '/api/admin/teacher/create'
            : 'https://spelling-tests-backend.herokuapp.com/api/admin/teacher/create',
          { isAdmin, useDefaultPassword },
          { headers: { token: token.current } }
        )
        .then((res) => {
          
        })
        .catch((err) => {
          
        });
    }
    return (
        <div className='container'>
            <form>
                <div className="form-row">
                    <div className="col">
                    <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control"/>
                    </div>
                    <div className="col">
                    <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control"/>
                    </div>
                </div>
                <div className="form-row" style={{marginTop: '10px'}}>
                    <div className="col">
                        <input type="text" placeholder='Username' className="form-control"/>
                    </div>
                    <div className="col">
                        <input type="text" placeholder='Email' className="form-control"/>
                    </div>
                </div>
                <div className="form-row" style={{marginTop: '10px'}}>
                    <div className="col">
                    <div className="form-check form-check-inline">
                        <input className='form-check-input' checked={isAdmin} onChange={(e) => {if (isAdmin) {setIsAdmin(false)} else {setIsAdmin(true)}}} type='checkbox' />
                        <label className='form-check-label'>Admin</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className='form-check-input' onChange={(e) => {if (useDefaultPassword) {setUseDefaultPassword(false)} else {setUseDefaultPassword(true)}}} type='checkbox' checked={useDefaultPassword} />
                        <label className='form-check-label'>Use Default Password</label>
                    </div>
                    </div>
                    <div className="col">
                        {useDefaultPassword ? null : (<input type="text" placeholder='Password' className="form-control"/>)}
                        
                    </div>
                </div>
                <div className="form-row" style={{marginTop: '10px'}}>
                    <button onClick={onClick} className='btn btn-primary' style={{width: '100%'}}>Create Teacher</button>
                </div>
            </form>
        </div>
    )
}

export default CreateTeacher
