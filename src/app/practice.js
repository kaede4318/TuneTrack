import init from './tuner';

async function countdown() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    await sleep(1000);
}
export default function Practice() {
    countdown();
    init();
    return (
        <div id="note"></div>
    );
}