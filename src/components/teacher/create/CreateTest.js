import axios from "axios";
import React, { Fragment, useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import ReactPlayer from "react-player";
const CreateTest = ({ createAlert }) => {
  const [words, setWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [testName, setTestName] = useState("");
  const [record, setRecord] = useState(false);
  const [testblob, setTestblob] = useState("");
  const [audio, setAudio] = useState({});
  const [playing, setPlaying] = useState(-1);
  const token = useRef(localStorage.getItem("token"));
  const {
    startRecording,
    stopRecording,
    clearBlobUrl,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: false,
  });
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
  let createFormData = new Promise(async (resolve, reject) => {
    let data = new FormData();
    words.map(async (word) => {
      let response = await fetch(word.audio);
      let blob = await response.blob();
      data.append(
        word.word,
        new File([blob], `${word.word}.wav`, { type: "audio/wav" })
      );
    });
    console.log(data);
    resolve(data);
  });
  const blobToFile = async (blobUrl, fileName) => {
    let response = await fetch(blobUrl);
    let blob = await response.blob();
    console.log("convert");
    return new File([blob], `${fileName}.wav`, { type: "audio/wav" });
  };
  const confirmAudio = (e) => {
    if (mediaBlobUrl === null)
      return alert("You must record audio to save first.");
    let newValue = words.find((word) => word.number.toString() === e.target.id);
    newValue.audio = mediaBlobUrl;
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
  const createTest = async (e) => {
    // Check that all info is entered
    let notDone = false;
    words.forEach((w) => {
      if (w.word === "") {
        notDone = true;
        createAlert("One or more word entries is missing.", "danger", 5000);
      } else if (w.audio === "") {
        notDone = true;
        createAlert("One or more word is missing audio.", "danger", 5000);
      }
    });
    if (notDone) return;
    else {
      let data = new FormData();
      await words.forEach(async (word) => {
        await data.append(word.word, await blobToFile(word.audio, word.word));
      });
      createFormData().then((data) => {
        console.log(data);
      });
      console.log("sending");
      axios
        .post(
          process.env.NODE_ENV === "development"
            ? "/api/v2/teacher/tests/create"
            : "https://spelling-tests-backend.herokuapp.com/api/v2/teacher/tests/create",
          data,
          { headers: { token: token.current } }
        )
        .then((res) => {})
        .catch((err) => {});
    }
  };
  const deleteAudio = (e) => {
    let newValue = words.find((word) => word.number.toString() === e.target.id);
    newValue.audio = "";
    let wordArr = words.filter(
      (word) => word.number.toString() !== e.target.id
    );
    wordArr.push(newValue);
    wordArr.sort((a, b) => {
      return a.number - b.number;
    });
    setWords(wordArr);
  };
  return (
    <div className='container'>
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
                onClick={() => setPlaying(0)}
                style={{ cursor: "pointer" }}
              ></i>
              <ReactPlayer
                height='0px'
                width='0px'
                url={mediaBlobUrl}
                playing={playing === 0 ? true : false}
                onEnded={() => {
                  setPlaying(-1);
                }}
              />
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
                      onClick={() => {
                        setPlaying(word.number);
                      }}
                    ></i>
                    <ReactPlayer
                      height='20px'
                      width='20px'
                      url={word.audio}
                      playing={playing === word.number ? true : false}
                      onEnded={() => {
                        setPlaying(-1);
                      }}
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
      {wordCount !== 0 ? (
        <div className='row word-margin'>
          <button
            style={{ width: "100%" }}
            onClick={createTest}
            className='btn btn-success'
          >
            Create Test
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CreateTest;
