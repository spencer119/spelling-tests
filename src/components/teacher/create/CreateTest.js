import React, {useState} from 'react'
import {ReactMic} from '@cleandersonlobo/react-mic'
import AudioRecorder from 'react-audio-recorder'
const CreateTest = () => {
    const [words, setWords] = useState([])
    const [wordCount, setWordCount] = useState(0)
    const [testName, setTestName] = useState('')
    const [record, setRecord] = useState(false)
    const onWordCountChange = (e) => {

        let newWordArr = [];
        for (let i = 0; i < e.target.value; i++) {
            newWordArr.push({number: i + 1, word: '', audio: ''})
        }
        setWordCount(e.target.value)
        setWords(newWordArr)
        
    }
    const onWordChange = e => {
        console.log(e.target.id)
        let found = words.find(word => word.number === parseInt(e.target.id));
        found.word = e.target.value;
        let newArr = words.filter(word => word.number !== parseInt(e.target.id))
        newArr.push(found)
        newArr.sort((a,b) => {return a.number - b.number})
        setWords(newArr)
        
    }
    const onStop = (blob) => {
        console.log('recordedBlob is: ', blob);
    }
    const onData = (blob) => {
        console.log('chunk of real-time data is: ', blob);
    }
    return (
        <div className='container'>
            
            <div className="row">
                <div className="col-10">
                <label>Enter a test name</label>
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder='Test name' className="form-control"/>
                </div>
                <div className="col-2">
                <label>How many words?</label>
                <input value={wordCount} onChange={onWordCountChange} type="number" placeholder='# of words' className="form-control"/>
                </div>
            
            </div>
            <div className="row word-margin">
                
            </div>
            {words.map((word) => (<div key={word.number} className="row word-margin">
                <div className="col-10">
                    <input type="text" id={word.number} className="form-control" onChange={onWordChange}/>
                </div>
                <div className="col-2">
                    <div className="row">
                    <div className="col">
                    <AudioRecorder className='btn btn-primary' />
                {/* <i className="fas fa-microphone fa-2x" style={{cursor: 'pointer'}}></i> */}
                        </div>
                        <div className="col">
                        <i className="fas fa-volume-up fa-2x" style={{cursor: 'pointer'}}></i>
                    </div>
                    <div className="col">
                        {word.audio === '' ? <i className="fas fa-times-circle fa-2x" style={{color: 'red'}} /> : <i className="fas fa-check-square fa-2x" style={{color: 'green'}} />}
                    
                    
                    </div>
                    </div>
                </div>
            </div>))}
            
            






        </div>
    )
}

export default CreateTest
