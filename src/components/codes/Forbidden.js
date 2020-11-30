import React from 'react'

export const Forbidden = () => {
    return (
        <div>
            <h1>403 Forbidden</h1>
            <a href='/' onClick={localStorage.clear()}>Go to home page</a>
        </div>
        
    )
}
export default Forbidden
