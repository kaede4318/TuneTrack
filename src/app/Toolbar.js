import './App.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'


export default function Toolbar() {
    const [annotateMode, setAnnotateMode] = useState(true);
    const [isDisabled, setDisabled] = useState(true);

    function handleClick() {
        alert("You clicked me!");
    }

    const setMode = () => {
        setAnnotateMode(prev => !prev);
        setDisabled(prev => !prev);
    };

    return (
        <div className={`toolbar ${annotateMode ? 'annotate-mode' : 'play-mode'}`}>
            <div className="mode-icon">
                {annotateMode ? (
                    <FontAwesomeIcon icon={faPen} />
                ) : (
                    <FontAwesomeIcon icon={faMusic} />
                )}
            </div>
            <div className="static-buttons">
                <button id="home-button" role="button" onClick={handleClick}>
                    Home
                </button>
                <button
                    id="annotate-mode-button"
                    role="button"
                    disabled={isDisabled}
                    onClick={setMode}
                    className={annotateMode ? 'active' : ''}
                >
                    Annotate Mode
                </button>
                <button
                    id="play-mode-button"
                    role="button"
                    disabled={!isDisabled}
                    onClick={setMode}
                    className={!annotateMode ? 'active' : ''}
                >
                    Play Mode
                </button>
            </div>
            {annotateMode ? (
                <div className="annotate-mode-buttons">
                    <button onClick={handleClick}>
                        Draw
                    </button>
                </div>
            ) : (
                <div className="play-mode-buttons">
                    <button onClick={handleClick}>
                        Play
                    </button>
                </div>
            )}
        </div>
    );
}
