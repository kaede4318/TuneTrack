"use client";
import './App.css';
import Link from 'next/link';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPen, faHome } from '@fortawesome/free-solid-svg-icons';

export default function Toolbar() {
    const [annotateMode, setAnnotateMode] = useState(true);
    const [isDisabled, setDisabled] = useState(true);

    const handleClick = () => {
        alert("You clicked me!");
    };

    const setMode = () => {
        setAnnotateMode(prev => !prev);
        setDisabled(prev => !prev);
    };

    return (
        <div className={`toolbar ${annotateMode ? 'annotate-mode' : 'play-mode'}`}>
            <div className="home-button-container">
                <Link href="/Home">
                    <button id="home-button" role="button">
                        <FontAwesomeIcon icon={faHome} />
                    </button>
                </Link>
            </div>
            <div className="mode-buttons-container">
                <div className="mode-icon">
                    <FontAwesomeIcon icon={annotateMode ? faPen : faMusic} />
                </div>
                <div className="static-buttons">
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
                <div className="mode-action-button">
                {annotateMode ? (
                    <button onClick={handleClick}>
                        Draw
                    </button>
                ) : (
                    <button onClick={handleClick}>
                        Play
                    </button>
                )}
            </div>
            <div className="suggestion-button-containter">
                <div className="suggestion">
                    <button onClick={handleClick}>Suggestion</button>
                </div>
            </div>
        </div>
        </div>
    );
}
