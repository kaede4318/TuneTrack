import './App.css';
import React, { useState, useEffect } from 'react';

export default function Toolbar() {
    const [annotateMode, setAnnotateMode] = useState(true);
    const [isDisabled, setDisabled] = useState(true);

    function handleClick() {
        alert("You clicked me!");
    }

    const setMode = () => {
        console.log("status: "+isDisabled)
        setAnnotateMode(annotateMode => !annotateMode)
        setDisabled(isDisabled => !isDisabled)

    }

    return (
        <div className="toolbar">
            <div className="static-buttons">
                <button id="home-button" role="button" onClick={handleClick}>
                    Home
                </button>
                <button id="annotate-mode-button" role="button" disabled={isDisabled} onClick={setMode}>
                    Annotate Mode
                </button>
                <button id="play-mode-button" role="button" disabled={!isDisabled} onClick={setMode}>
                    Play Mode
                </button>
            </div>
            {annotateMode ? (
                <div className="annotate-mode-buttons">
                    <button onClick={handleClick}>
                        draw
                    </button>
                </div>
            ) : (
                <div className="play-mode-buttons">
                    <button onClick={handleClick}>
                        play
                    </button>
                </div>
            )}
        </div>
    );
  }