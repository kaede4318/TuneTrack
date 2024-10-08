import React, { useState, useEffect } from 'react';
import './App.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPen, faHome, faBook, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import Practice from './practice';
import MetronomeDropdown from './metronomeDropdown';
import MIDIPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';


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
    const [drawingEnabled, setDrawingEnabled] = useState(null);
    const [eraseEnabled, setEraseEnabled] = useState(null);
    const [player, setPlayer] = useState(null);
    const [soundfontPlayer, setSoundfontPlayer] = useState(null);
    const [isPlaying, setPlayButton] = useState(false);

    useEffect(() => {
        const newPlayer = new MIDIPlayer.Player({
            onEvent: function(event) {
                if (event.name === 'Note on' && event.velocity > 0) {
                    if (soundfontPlayer) {
                        soundfontPlayer.play(event.noteName, 0, { gain: event.velocity / 127 });
                    }
                }
            },
            onEnd: function() {
                console.log('Playback ended');
            }
        });
        setPlayer(newPlayer);
        
        Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then(instrument => {
            setSoundfontPlayer(instrument);
        });
    }, []);

    const PitchFeedback = () => {
        const btn = document.getElementById("pitch-feedback-button");
        if (btn.classList.contains("enabled")) {
            btn.classList.remove("enabled");
            setPitchFeedbackEnabled(false);

            var note = document.getElementById("note")
            note.style.opacity = 0;
        } else {
            btn.classList.add("enabled");
            setPitchFeedbackEnabled(true);
            Practice();
        }
    };

    const handleClick = () => {
        alert("You clicked me!");
    };
    let synth;
    let part;
    
    const handlePlayClick = async () => {
        if (!isPlaying) {
            try {
                setPlayButton(true);
                console.log('Fetching MIDI file...');
                const response = await fetch('/data/the second waltz/thesecondwaltz.mid');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const arrayBuffer = await response.arrayBuffer();
    
                console.log('Parsing MIDI file...');
                const midi = new Midi(arrayBuffer);
    
                await Tone.start();
                synth = new Tone.Synth().toDestination();
    
                const notes = [];
                midi.tracks.forEach(track => {
                    track.notes.forEach(note => {
                        notes.push({
                            time: note.time,
                            note: note.name,
                            duration: note.duration
                        });
                    });
                });
    
                part = new Tone.Part((time, value) => {
                    synth.triggerAttackRelease(value.note, value.duration, time);
                }, notes).start(0);
    
                Tone.Transport.start();
                console.log('Playing MIDI file...');
            } catch (error) {
                console.error('Error loading or playing MIDI file:', error);
            }
        } else {
            if (part) {
                part.stop();
                part.dispose();
                part = null;
            }
            if (synth) {
                synth.dispose();
                synth = null;
            }
            Tone.Transport.stop();
            console.log('Stopped MIDI playback.');
            setPlayButton(false);
        }
    };
    

    

    const setMode = () => {
        setAnnotateMode(prev => !prev);
        setDisabled(prev => !prev);
        setDrawingEnabled(false)
        setEraseEnabled(false)
        setActiveButton(null);
    };

    const handleDrawClick = () => {
        onDrawButtonClick();
        const drawbtn = document.getElementById("draw-btn");
        const erasebtn = document.getElementById("erase-btn");
        // setActiveButton('draw');
        if (drawingEnabled) {
            drawbtn.classList.remove("active")
            setDrawingEnabled(false)
        } else {
            drawbtn.classList.add("active")
            erasebtn.classList.remove("active")
            setDrawingEnabled(true)
            setEraseEnabled(false)
        }
    };

    const handleEraseClick = () => {
        const drawbtn = document.getElementById("draw-btn");
        const erasebtn = document.getElementById("erase-btn");
        onEraseButtonClick();
        // setActiveButton('erase');
        if (eraseEnabled) {
            erasebtn.classList.remove("active")
            setEraseEnabled(false)
        } else {
            erasebtn.classList.add("active")
            drawbtn.classList.remove("active")
            setEraseEnabled(true)
            setDrawingEnabled(false)
        }
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
                <Link href="/">
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
                    {/* Renders only when annotate mode is on. */}
                    {annotateMode && (
                        <>
                            <button
                                onClick={handleDrawClick}
                                className={activeButton === 'draw' ? 'active' : ''}
                                id="draw-btn"
                            >
                                Draw
                            </button>
                            <button
                                onClick={handleEraseClick}
                                className={activeButton === 'erase' ? 'active' : ''}
                                id="erase-btn"
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
                    {/* Renders only when practice mode is on. */}
                    {!annotateMode && (
                        <>
                            <button id='playpause-button' title={isPlaying ? 'Pause MIDI' : 'Play MIDI'} onClick={handlePlayClick}>
                                {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                            </button>
                            <MetronomeDropdown />
                        </>
                    )}
                </div>
                {!annotateMode ? (
                    <div className="pitch-feedback">
                        <button id="pitch-feedback-button" onClick={PitchFeedback}>
                            Pitch Feedback 
                        </button>
                        { pitchFeedbackEnabled ? 
                        <div 
                        id="note"
                        className="toolbar-dropdown"
                        ></div> 
                        : null}
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
