import './App.css';
import Link from 'next/link';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPen, faHome, faBook } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

// Set the app element for accessibility
if (typeof document !== 'undefined') {
  Modal.setAppElement('#__next'); // Adjust if your root element ID is different
}

export default function Toolbar() {
    const [annotateMode, setAnnotateMode] = useState(true);
    const [isDisabled, setDisabled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New state for loading status

    const handleClick = () => {
        alert("You clicked me!");
    };

    const setMode = () => {
        setAnnotateMode(prev => !prev);
        setDisabled(prev => !prev);
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
                    "subtitle": "from Jazz Suite",
                    "artist": "Dimitri Shostakovich",
                    "bpm": "162",
                    "instrument": "flute",
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
                    <button id="home-button" role="button">
                        <FontAwesomeIcon icon={faHome} />
                    </button>
                </Link>
            </div>
            <div className="gallery-button-container">
                <Link href="/Gallery" legacyBehavior>
                    <a>
                        <button id="galleryButton">
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
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
}
