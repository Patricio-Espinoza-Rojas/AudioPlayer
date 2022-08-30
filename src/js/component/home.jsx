import { element } from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaFastForward,
  FaFastBackward,
} from "react-icons/fa";
//include images into your bundle

//create your first component
const Home = () => {
  const [songList, setSongList] = useState([]);
  const [songUrl, setSongUrl] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [id, setId] = useState("");
  const [playing, setPlaying] = useState(false);
  const [button, setButton] = useState(<FaPlayCircle size="50" />);
  const songRef = useRef(songUrl);

  const url = "http://assets.breatheco.de/apis/sound/songs";

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setSongList(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    songRef.current.pause();
    setPlaying(false);
    setButton(<FaPlayCircle size="50" />);
    songRef.current.src = songUrl;
  }, [songUrl]);

  var urlArray = [];
  function contentSong() {
    return songList.map((element, index) =>
      songUrl === "https://assets.breatheco.de/apis/sound/" + element.url
        ? (urlArray.push([index, element.name, element.url]),
          (
            <li
              type="button"
              onClick={() => {
                handleClick(index);
              }}
              className="list-group-item list-group-item-action bg-warning text-white"
              key={index}
            >
              {element.name}
            </li>
          ))
        : (urlArray.push([index, element.name, element.url]),
          (
            <li
              type="button"
              onClick={() => {
                handleClick(index);
              }}
              className="list-group-item list-group-item-action bg-light text-black"
              key={index}
            >
              {element.name}
            </li>
          ))
    );
  }

  function handleClick(index) {
    /* setCurrentSong(e.currentTarget.innerHTML); */
    var songLink = "";
    var name = "";
    for (var i of urlArray) {
      if (i[0] === index) {
        songLink = i[2];
        name = i[1];
        setId(index);
      }
    }
    setCurrentSong(name);
    setSongUrl("https://assets.breatheco.de/apis/sound/" + songLink);
  }

  console.log(currentSong);
  console.log(songUrl);
  console.log(id);

  const togglePlay = () => {
    if (!playing) {
      setPlaying(true);
      setButton(<FaPauseCircle size="50" />);
      songRef.current.play();
    } else {
      setPlaying(false);
      setButton(<FaPlayCircle size="50" />);
      songRef.current.pause();
    }
  };

  const previous = () => {
    var songUrl = "";
    var songName = "";
    if (id === 0) {
      songUrl = `https://assets.breatheco.de/apis/sound/${
        urlArray[urlArray.length - 1][2]
      }`;
      songName = urlArray[urlArray.length - 1][1];
      setId(urlArray[urlArray.length - 1][0]);
    } else {
      for (var song of urlArray) {
        if (song[0] === id) {
          songName = urlArray[urlArray.indexOf(song) - 1][1];
          songUrl = `https://assets.breatheco.de/apis/sound/${
            urlArray[urlArray.indexOf(song) - 1][2]
          }`;
          setId(id - 1);
        }
      }
    }
    setCurrentSong(songName);
    setSongUrl(songUrl);
  };

  const next = () => {
    var songUrl = "";
    var songName = "";
    if (id === urlArray.length - 1) {
      songUrl = `https://assets.breatheco.de/apis/sound/${urlArray[0][2]}`;
      songName = urlArray[0][1];
      setId(urlArray[0][0]);
    } else {
      for (var song of urlArray) {
        if (song[0] === id) {
          songName = urlArray[urlArray.indexOf(song) + 1][1];
          songUrl = `https://assets.breatheco.de/apis/sound/${
            urlArray[urlArray.indexOf(song) + 1][2]
          }`;
          setId(id + 1);
        }
      }
    }
    setCurrentSong(songName);
    setSongUrl(songUrl);
  };
  /* Audio Management */
  return (
    <>
      <div className="container-fluid">
        <div className="row bg-secondary">
          <div className="col-12-md p-0">
            <ul className="list-group list-group-flush p-2">{contentSong()}</ul>
          </div>
        </div>
        <div className="fixed-bottom">
          <div className="row bg-success bg-gradient bg-opacity-75 p-3 mx-2 me-4 border rounded border-success justify-content-center">
            <div
              id="backward"
              type="button"
              onClick={() => previous()}
              className="col-4 text-end"
            >
              <FaFastBackward size="50" />
            </div>
            <div
              type="button"
              onClick={() => togglePlay()}
              className="col-2 text-center"
            >
              {button}
            </div>
            <div
              type="button"
              onClick={() => next()}
              className="col-4 text-start"
            >
              <FaFastForward size="50" />
            </div>
          </div>
        </div>
      </div>
      <audio src={songRef} ref={songRef}></audio>
    </>
  );
};

export default Home;
