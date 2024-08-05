"use client";
import init from './tuner';

export default function Practice() {
    var bpm = 120 // placeholder
    var measures = [] // nothing here yet
    const fetchData = async () => { 
        try {
            const response = await fetch('/songinfo.json'); 
            const data = await response.json();
            console.log(data);
            bpm = data.songs[0].bpm; // fetch bpm from json
            measures = data.songs[0].measures
            await runIn(5, bpm, measures)
        } catch (error) {
            console.error('Error fetching JSON:', error);
        }
    };
    const runIn = async (s, bpm, measures) => { 
        try {
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            const countdown = document.getElementById("countdown")
            for (let i = s; i >= 0; i--) {
                countdown.innerText = i.toString();
                await sleep(1000);
                console.log(s)
            }
            countdown.innerText = ""
            init(bpm, measures);
            note.style.opacity = 1;
        } catch (error) {
            console.error('Error:', error);
        }
    };
    fetchData();
    return;
}