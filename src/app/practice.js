"use client";
import init from './tuner';
import songinfo from './songinfo'
import React, { useRef, useEffect, useState } from 'react';

export default function Practice() {
    countdown();
    const bpm = songinfo.BPM
    console.log(bpm)
    init();
    return;
}

const PitchFeedback = ({ width, height, noteMap, lineSpacing, startLine }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    }); 

    

return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'relative', top: 0, zIndex: 1 }} />;
};

async function countdown() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(5000);
}

