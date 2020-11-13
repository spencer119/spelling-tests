import React, {useState} from 'react'

const CreateTest = () => {
    const [words, setWords] = useState([])
    const [wordCount, setWordCount] = useState(0)
    let wordArr = [];
    return (
        <div className='container'>
            
            <div className="row">
                <div className="col-10">
                <label>Enter a test name</label>
                <input type="text" placeholder='Test name' className="form-control"/>
                </div>
                <div className="col-2">
                <label>How many words?</label>
                <input value={wordCount} onChange={(e) => setWordCount(e.target.value)} type="number" placeholder='# of words' className="form-control"/>
                </div>
            
            </div>
            <div className="row word-margin">
                
            </div>
            <div className="row word-margin">
                <div className="col-10">
                    <input type="text" className="form-control"/>
                </div>
                <div className="col-2">
                    <div className="row">
                    <div className="col">
                <i class="fas fa-microphone fa-2x" style={{cursor: 'pointer'}}></i>
                        </div>
                        <div className="col">
                        <i class="fas fa-volume-up fa-2x" style={{cursor: 'pointer'}}></i>
                    </div>
                    <div className="col">
                    <i class="fas fa-check-square fa-2x" style={{color: 'green'}}></i>
                    </div>
                    </div>
                </div>
            </div>
            {() => {
                for (let i=0; i < wordCount; i++) return (<div className="row word-margin">
                <div className="col-10">
                    <input type="text" className="form-control"/>
                </div>
                <div className="col-2">
                    <div className="row">
                    <div className="col">
                <i class="fas fa-microphone fa-2x" style={{cursor: 'pointer'}}></i>
                        </div>
                        <div className="col">
                        <i class="fas fa-volume-up fa-2x" style={{cursor: 'pointer'}}></i>
                    </div>
                    <div className="col">
                    <i class="fas fa-check-square fa-2x" style={{color: 'green'}}></i>
                    </div>
                    </div>
                </div>
            </div>)
            }}
            






        </div>
    )
}

export default CreateTest
