import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFastForward } from "@fortawesome/free-solid-svg-icons";
import { faFastBackward } from "@fortawesome/free-solid-svg-icons";
import styles from "./audio-player.module.css";

export const AudioPlayer = ({ audioArray }) => {
  const [nowPlaying, setNowPlaying] = useState(0);

  const onEnd = (e) => {
    //if there is another element in the audio array, advance nowPlaying
    if (audioArray[nowPlaying + 1]) {
      setNowPlaying(nowPlaying + 1);
    } else if (audioArray.length > 1) {
      //otherwise, go back to the begininning of the array
      setNowPlaying(0);
    }
    const player = document.getElementById("player");
    player.pause();
    player.load();
    setTimeout(() => {
      player.play();
    }, 500);
  };

  return (
    <div className={styles.audioPlayerContainer}>
      <div className={styles.audioPlayerTitleButtonsContainer}>
        {audioArray && audioArray.length > 1 && (
          <button
            onClick={() => {
              if (audioArray[nowPlaying - 1]) {
                setNowPlaying(nowPlaying - 1);
              } else if (audioArray.length > 1) {
                //otherwise, go back to the end of the array
                setNowPlaying(audioArray.length - 1);
              }
              const player = document.getElementById("player");
              player.pause();
              player.load();
              setTimeout(() => {
                player.play();
              }, 500);
            }}
          >
            <FontAwesomeIcon icon={faFastBackward} size="1x" color="white" />
          </button>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <small style={{ color: "white" }}>
            <i>Track Title</i>
          </small>
          <p>
            {audioArray && audioArray[nowPlaying] &&
              audioArray[nowPlaying].title.substring(0, 15) +
                (audioArray[nowPlaying] &&
                audioArray[nowPlaying].title.length > 15
                  ? "..."
                  : "")}
          </p>
        </div>
        {audioArray && audioArray.length > 1 && (
          <button
            onClick={() => {
              if (audioArray[nowPlaying + 1]) {
                setNowPlaying(nowPlaying + 1);
              } else if (audioArray.length > 1) {
                //otherwise, go back to the beginning of the array
                setNowPlaying(0);
              }
              const player = document.getElementById("player");
              player.pause();
              player.load();
              setTimeout(() => {
                player.play();
              }, 500);
            }}
          >
            <FontAwesomeIcon icon={faFastForward} size="1x" color="white" />
          </button>
        )}
      </div>
      <audio
        id="player"
        controls
        className={styles.audioPlayer}
        autoPlay={false}
        onEnded={onEnd}
        src={audioArray && audioArray[nowPlaying] && audioArray[nowPlaying].url}
      >
        {/* <source
          src={audioArray[nowPlaying] && audioArray[nowPlaying].url}
          type={audioArray[nowPlaying] && audioArray[nowPlaying].fileType}
        /> */}
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
