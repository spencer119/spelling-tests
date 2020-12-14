import React, { Fragment, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import ReactPlayer from "react-player";
const CreateTest = () => {
  const [words, setWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [testName, setTestName] = useState("");
  const [record, setRecord] = useState(false);
  const [testblob, setTestblob] = useState("");
  const [audio, setAudio] = useState({});
  const [playing, setPlaying] = useState(-1);
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
      startRecording();
    }
  };
  const confirmAudio = (e) => {
    if (mediaBlobUrl === null)
      return alert("You must record audio to save first.");
    let newValue = words.find((word) => word.number.toString() === e.target.id);
    newValue.audio = mediaBlobUrl;
    console.log(newValue);
    let wordArr = words.filter(
      (word) => word.number.toString() !== e.target.id
    );
    wordArr.push(newValue);
    wordArr.sort((a, b) => {
      return a.number - b.number;
    });
    setWords(wordArr);
    clearBlobUrl();
  };
  const deleteAudio = (e) => {
    let newObj = audio;
    delete audio[e.target.id];
    setAudio(newObj);
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
      {wordCount === 0 ? null : (
        <div className='text-center word-margin'>
          {mediaBlobUrl === null ? (
            <i
              className='fas fa-microphone fa-5x text-center'
              style={{ margin: "10px", cursor: "pointer" }}
              onClick={onRecord}
            ></i>
          ) : (
            <Fragment>
              <i
                className='fas fa-volume-up fa-5x text-center'
                height='20px'
                width='20px'
                style={{ cursor: "pointer" }}
              ></i>
              <br />
              <button className='btn btn-danger' onClick={() => clearBlobUrl()}>
                Discard
              </button>
            </Fragment>
          )}

          {record ? (
            <Fragment>
              <p>Recording...</p>
              <p>Click again to stop.</p>
            </Fragment>
          ) : mediaBlobUrl !== null ? (
            <p>Audio ready to save.</p>
          ) : (
            <p>Click to start a new recording.</p>
          )}
        </div>
      )}

      <div className='row word-margin'></div>
      {words.map((word) => (
        <div key={word.number} id={word.number} className='row word-margin'>
          <div className='col-10'>
            <input
              type='text'
              id={word.number}
              className='form-control'
              onChange={onWordChange}
              placeholder={audio[word.number]}
            />
          </div>
          <div className='col-2'>
            <div className='row'>
              {words.find((w) => w.number === word.number).audio === "" ? (
                <Fragment>
                  <div className='col'>
                    <button
                      id={word.number}
                      onClick={confirmAudio}
                      className='btn btn-success'
                    >
                      Save Audio
                    </button>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className='col'>
                    <i
                      className='fas fa-volume-up fa-2x'
                      style={{ cursor: "pointer" }}
                      onClick={() => setPlaying(word.number)}
                    ></i>
                    <ReactPlayer
                      height='20px'
                      width='20px'
                      url={words.find((w) => w.number === word.number).audio}
                      playing={playing === word.number}
                      onEnded={() => setPlaying(-1)}
                    />
                  </div>
                  <div className='col'>
                    <button
                      className='btn btn-danger'
                      id={word.number}
                      onClick={deleteAudio}
                    >
                      Delete
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateTest;
