import React, { useState } from 'react';
import './App.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPen, faHome, faBook } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import Practice from './practice';

// Set the app element for accessibility
if (typeof document !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function Toolbar({ onDrawButtonClick, onEraseButtonClick, onClearButtonClick }) {
    const [pitchFeedbackEnabled, setPitchFeedbackEnabled] = useState(false);
    const [annotateMode, setAnnotateMode] = useState(true);
    const [isDisabled, setDisabled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

    const PitchFeedback = () => {
        const btn = document.getElementById("pitch-feedback-button");
        if (btn.classList.contains("enabled")) {
            btn.classList.remove("enabled");
            setPitchFeedbackEnabled(false);
        } else {
            btn.classList.add("enabled");
            setPitchFeedbackEnabled(true);
            Practice();
        }
    };

    const handleClick = () => {
        alert("You clicked me!");
    };

    const setMode = () => {
        setAnnotateMode(prev => !prev);
        setDisabled(prev => !prev);
        setActiveButton(null);
    };

    const handleDrawClick = () => {
        onDrawButtonClick();
        setActiveButton('draw');
    };

    const handleEraseClick = () => {
        onEraseButtonClick();
        setActiveButton('erase');
    };

    const handleClearClick = () => {
        if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
            onClearButtonClick();
        }
    };

    const fetchSuggestions = async () => {
        setIsLoading(true);
        const response = await fetch(
            'https://noggin.rea.gent/managerial-cockroach-7657',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer rg_v1_pejlvs09ga2q51e6055fgyxordens8fblnhr_ngk',
                },
                body: JSON.stringify({
                    "title": "The Second Waltz",
                    "composer": "Dmitri Shostakovich",
                    "tempo_bpm": "162",
                    "instrument": "Flute",
                }),
            }
        ).then(response => response.text());

        const data = JSON.parse(response);
        setSuggestions(data);
        setIsLoading(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`toolbar ${annotateMode ? 'annotate-mode' : 'play-mode'}`}>
            <div className="home-button-container">
                <Link href="/Home">
                    <button id="home-button" title="Home" role="button">
                        <FontAwesomeIcon icon={faHome} />
                    </button>
                </Link>
            </div>
            <div className="gallery-button-container">
                <Link href="/Gallery" legacyBehavior>
                    <a>
                        <button id="galleryButton" title="Gallery">
                            <FontAwesomeIcon icon={faBook} />
                        </button>
                    </a>
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
                    {annotateMode && (
                        <>
                            <button
                                onClick={handleDrawClick}
                                className={activeButton === 'draw' ? 'active' : ''}
                            >
                                Draw
                            </button>
                            <button
                                onClick={handleEraseClick}
                                className={activeButton === 'erase' ? 'active' : ''}
                            >
                                Erase
                            </button>
                            <button
                                onClick={handleClearClick}
                                className="clear-button"
                            >
                                Clear
                            </button>
                        </>
                    )}
                    {!annotateMode && (
                        <button onClick={handleClick}>
                            Play
                        </button>
                    )}
                </div>
                {!annotateMode ? (
                    <div className="pitch-feedback">
                        <button id="pitch-feedback-button" onClick={PitchFeedback}>
                            Pitch Feedback
                        </button>
                        { pitchFeedbackEnabled ? <div id="note"></div> : null}
                    </div>
                ) : null}
                <div className="suggestion-button-container">
                    <button onClick={fetchSuggestions}>
                        {isLoading ? 'Loading...' : 'Suggestion'}
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Suggestions Modal"
                className="ReactModal__Content"
                overlayClassName="ReactModal__Overlay"
            >
                <h2>Practice Suggestions</h2>
                {suggestions ? (
                    <div>
                        <h3>Technical Suggestions</h3>
                        <p>{suggestions['Technical Suggestions']}</p>
                        <h3>Musical Interpretation</h3>
                        <p>{suggestions['Musical Interpretation']}</p>
                        <h3>Common Challenges</h3>
                        <p>{suggestions['Common Challenges']}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <button onClick={closeModal}>Let's Practice!</button>
            </Modal>
        </div>
    );
}
