// utils.js contains a variety of utility functions used throughout the app

// Data compiled from: https://theonlinemetronome.com/blogs/12/tempo-markings-defined
let tempoDict = new Map();
tempoDict.set("larghissimo", 20); // 20 bpm or slower
tempoDict.set("solenne", 30);
tempoDict.set("grave", 30);
tempoDict.set("lento", 50);
tempoDict.set("lentissimo", 48); // 48 bpm or sloewr
tempoDict.set("largo", 50);
tempoDict.set("larghetto", 63);
tempoDict.set("adagio", 70);
tempoDict.set("adagietto", 75);
tempoDict.set("tranquillo", 80);
tempoDict.set("andante moderato", 95);
tempoDict.set("andante", 74);
tempoDict.set("andantino", 78);
tempoDict.set("moderato", 108);
tempoDict.set("allegretto", 112);
tempoDict.set("allegro moderato", 120);
tempoDict.set("allegro", 138);
tempoDict.set("vivace", 160);
tempoDict.set("vivacissimo", 172);
tempoDict.set("allegrissimo", 174);
tempoDict.set("allegro vivace", 174);
tempoDict.set("presto", 184);
tempoDict.set("prestissimo", 200);

// Converts parsed tempo marking from noggin to tempo in bpm
// Returns JSON object in string format.
export function convertToBPM(jsonStr) {
    console.log(jsonStr)
    let jsonObj = JSON.parse(jsonStr);
    console.log(jsonObj)
    let tempoMarking = jsonObj.tempo_marking

    // make sure tempoMarking is always lowercase so there are no key errors
    tempoMarking = tempoMarking.toLowerCase();

    // get tempo_bpm from dictionary. if not found, return "".
    jsonObj.tempo_bpm = tempoDict.get(tempoMarking) || "";

    return JSON.stringify(jsonObj)
    }