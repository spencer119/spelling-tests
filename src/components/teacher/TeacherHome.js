import React from 'react'

const TeacherHome = () => {
    return (
        <div className='container-fluid'>
            <div className="row">
            <div className="col text-center">col1</div>
            <div className="col-6 text-center">
            <div className="card text-center">
  <div className="card-header">
    Home
  </div>
  <div className="card-body">
    <h5 className="card-title">Welcome username</h5>
    <p className="card-text">Who knows</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div className="card-footer text-muted">
    something idk
  </div>
</div>
            </div>
            <div className="col">
                <h3>Updates</h3>
            <div className="card text-white bg-info mb-3" style={{maxWidth: '18rem'}}>
  <div className="card-header">Something</div>
  <div className="card-body">
    <h5 className="card-title">smething else</h5>
    <p className="card-text">idk</p>
  </div>
</div>
            </div>
            </div>
            
        </div>
    )
}

export default TeacherHome
