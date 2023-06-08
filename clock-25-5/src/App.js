import "./App.css";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRedo } from "@fortawesome/free-solid-svg-icons";

// Timer component for managing break and session lengths
const Timer = ({ label, value, increment, decrement }) => {
  const hid = label.toLowerCase() + "-label";
  const decid = label.toLowerCase() + "-decrement";
  const incid = label.toLowerCase() + "-increment";
  const len = label.toLowerCase() + "-length";
  const a = label + " length";
  return (
    <div>
      <h3 id={hid}>{a}</h3>
      <div className="change">
        <button className="fa1" id={decid} onClick={decrement}>
          -
        </button>
        <span className="text" id={len}>
          {value}
        </span>
        <button className="fa1" id={incid} onClick={increment}>
          +
        </button>
      </div>
    </div>
  );
};

const App = () => {
  // State for break and session lengths
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);

  // State for time left and timer label (Session or Break)
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState("Session");

  // State for timer running status
  const [isRunning, setIsRunning] = useState(false);
  // Reference to the audio element
  const audioRef = useRef(null);

  // Update time left when session length changes
  useEffect(() => {
    setTimeLeft(sessionLength * 60);
    setTimerLabel("Session");
    setIsRunning(false);
  }, [sessionLength, breakLength]);

  let name = {
    Session: "Break",
    Break: "Session",
  };
  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          // Switch between Session and Break
          audioRef.current.play();
          setTimerLabel(name[timerLabel]);
          return (timerLabel === "Session" ? breakLength : sessionLength) * 60;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    // Clean up interval when component unmounts or updates
    return () => clearInterval(timer);
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  // Toggle timer running status
  const toggleTimer = () => setIsRunning(!isRunning);

  // Reset timer and settings
  const resetTimer = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="Main">
      <h1>Timer</h1>

      <div id="centerpiece">
        <h2 id="timer-label">{timerLabel}</h2>
        <h2 id="time-left">{formatTime(timeLeft)}</h2>
        {/* Play/Pause Button */}
        <div className="buttons">
          <button id="start_stop" className="fa" onClick={toggleTimer}>
            {isRunning ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          {/* Reset Button */}
          <button className="fa" id="reset" onClick={resetTimer}>
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
      </div>

      <div className="lenSet">
        {/* Break Length Timer */}
        <Timer
          label="Break"
          value={breakLength}
          increment={() => setBreakLength((prev) => Math.min(prev + 1, 60))}
          decrement={() => setBreakLength((prev) => Math.max(prev - 1, 1))}
        />
        {/* Session Length Timer */}
        <Timer
          label="Session"
          value={sessionLength}
          increment={() => setSessionLength((prev) => Math.min(prev + 1, 60))}
          decrement={() => setSessionLength((prev) => Math.max(prev - 1, 1))}
        />
        <audio
          id="beep"
          ref={audioRef}
          src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
          preload="auto"
        ></audio>
      </div>
      <p>by Aravind</p>
    </div>
  );
};

export default App;
