import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import ReactPlayer from "react-player";
const CreateTest = () => {
  const [words, setWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [testName, setTestName] = useState("");
  const [record, setRecord] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(0);
  const [testblob, setTestblob] = useState("");
  const [audio, setAudio] = useState({});
  const {
    status,
    startRecording,
    stopRecording,
    onStop,
    clearBlobUrl,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: false });
  const onWordCountChange = (e) => {
    let newWordArr = [];
    for (let i = 0; i < e.target.value; i++) {
      newWordArr.push({ number: i + 1, word: "", audio: "" });
    }
    setWordCount(e.target.value);
    setWords(newWordArr);
  };
  const onWordChange = (e) => {
    console.log(e.target.id);
    let found = words.find((word) => word.number === parseInt(e.target.id));
    found.word = e.target.value;
    let newArr = words.filter((word) => word.number !== parseInt(e.target.id));
    newArr.push(found);
    newArr.sort((a, b) => {
      return a.number - b.number;
    });
    setWords(newArr);
  };
  const onRecord = (e) => {
    if (record) {
      // Stop recording
      setRecord(false);
      stopRecording();
    } else {
      // start recording
      setRecord(true);
      setCurrentRecord(e.target.id);
      startRecording();
    }
  };
  const confirmAudio = (e) => {
    console.log(mediaBlobUrl);
    let audioObj = audio;
    audioObj[e.target.id] = mediaBlobUrl;
    setAudio(audioObj);
    clearBlobUrl();
    setCurrentRecord(0);
    console.log(mediaBlobUrl);
    console.log(audio);
  };
  const onPlay = (e) => {
    let audio = new Audio(mediaBlobUrl);
    audio.volume = 0.25;
    audio.play();
  };
  return (
    <div className='container'>
      {status}
      <input
        type='text'
        value={testblob}
        onChange={(e) => setTestblob(e.target.value)}
        placeholder='BLOB URL'
        className='form-control'
      />
      <ReactPlayer
        height='20px'
        width='20px'
        style={{ cursor: "pointer" }}
        className='btn btn-primary'
        url={testblob}
        playing
      >
        Play test blob
      </ReactPlayer>
      <audio className='btn btn-primary' src={mediaBlobUrl}></audio>
      <div className='row'>
        <div className='col-10'>
          <label>Enter a test name</label>
          <input
            type='text'
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder='Test name'
            className='form-control'
          />
        </div>
        <div className='col-2'>
          <label>How many words?</label>
          <input
            value={wordCount}
            onChange={onWordCountChange}
            type='number'
            placeholder='# of words'
            className='form-control'
          />
        </div>
      </div>
      <div className='text-right word-margin'>
        <i
          className='fas fa-microphone fa-5x text-center'
          style={{ margin: "10px" }}
          onClick={onRecord}
        ></i>
        <i
          className='fas fa-volume-up fa-5x text-center'
          style={{ margin: "10px" }}
        ></i>
      </div>

      <div className='row word-margin'></div>
      {words.map((word) => (
        <div key={word.number} id={word.number} className='row word-margin'>
          <div className='col-10'>
            <input
              type='text'
              id={word.number}
              className='form-control'
              onChange={onWordChange}
            />
          </div>
          <div className='col-2'>
            <div className='row'>
              <div className='col'>
                <ReactPlayer
                  height='20px'
                  width='20px'
                  style={{ cursor: "pointer" }}
                  className='fas fa-volume-up fa-2x'
                  url={audio[word.number]}
                  playing
                />
              </div>
              <div className='col'>
                <i
                  className={`fas fa-minus-circle fa-2x`}
                  id={word.number}
                  onClick={confirmAudio}
                  style={{ color: "red", cursor: "pointer" }}
                />
              </div>
              <div className='col'>
                <i
                  className='fas fa-check-square fa-2x'
                  id={word.number}
                  onClick={confirmAudio}
                  style={{ color: "green", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateTest;
