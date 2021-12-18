var MidiWriter = require('midi-writer-js');

const notesGenTab = [
    'A', 'A#',
    'B',
    'C', 'C#',
    'D', 'D#',
    'E',
    'F', 'F#',
    'G', 'G#'
];

const majorScale = [
    0, 2, 4, 5, 7, 9, 11
];

const minorScale = [
    0, 2, 3, 5, 7, 8, 11
];


function generate (seedName) {
  //console.log(seedName);

    const notesTab = [
        'C4', 'C#4',
        'D4', 'D#4',
        'E4',
        'F4', 'F#4',
        'G4', 'G#4',
        'A4', 'A#4',
        'B4',
        'C5', 'C#5',
        'D5', 'D#5',
        'E5',
        'F5', 'F#5',
        'G5', 'G#5',
        'A5', 'A#5',
        'B5',
        'C6', 'C#6',
        'D6', 'D#6',
        'E6',
        'F6', 'F#6',
        'G6', 'G#6',
        'A6', 'A#6',
        'B6'
    ];


    var seedrandom = require('seedrandom');
    var generator = seedrandom(seedName);
    //console.log(generator());
    const cNbDim = getRandomFromRange(0, 0);
    const cNbMaxDim = 1;
    const cNbMin = getRandomFromRange(0, 1);
    const cNbMaj = getRandomFromRange(0, 1);
    const chosenScale = getRandomFromRange(0, 1) ? majorScale : minorScale;
  /*
    if (chosenScale == minorScale) {
        console.log("Minor");
    } else {
        console.log("Major");
    }
    */

//const type = [2,4,8];
    const type = [
        1, 1, 1, 1, 1, 1, 1, 1, 
        2, 2, 2, 2, 2,
        2, 2, 2, 2, 2,
        2, 2, 2, 2, 2,
        4, 4, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 4, 4, 4, 4,
        8, 8, 8,
        16
    ];
// 1 : 15%
// 2 : 33%
// 4 : 50%
// 8 :  1%
// 16 : 1%
//console.log(notesTab.length);

    var gammeIndex = getRandomFromRange(0, notesTab.length - 1);
    var gamme = notesTab[gammeIndex].substr(0, notesTab[gammeIndex].length - 1);

    //console.log("Gamme : " + gamme);


    let scaleNotes = getScaleNotes(gamme);
    let chordsList = getChordsListFromScale(gamme, getRandomFromRange(4, 6), chosenScale);

    const tempo = getRandomFromRange(80, 150);

    //console.log("Tempo : " + tempo);
// Start with a new track
    let track = new MidiWriter.Track();
    let track2 = new MidiWriter.Track();
    let track3 = new MidiWriter.Track();
//track.setTempo(90);
    track.setTempo(tempo);
    track2.setTempo(tempo);
    track3.setTempo(tempo);

// Define an instrument (optional):
    // 28 : JV style
    // 42-41 : Violons
    // 30 : Guitare Electrique
    //const instruments = [1, 28, 41, 30];
    const instruments = [1];
    var indexInstru = getRandomFromRange(0, instruments.length - 1);
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: instruments[indexInstru]})); //28
    track2.addEvent(new MidiWriter.ProgramChangeEvent({instrument: instruments[indexInstru]}));

    let tab = [];
    let chordsTrackTab = [];
    for (let i = 0; i < chordsList.length * 12; ++i) {
        let chord = chordsList[i % chordsList.length];
        chordsTrackTab.push({
            pitch: [chord[0] + '3', chord[1] + '3', chord[2] + '3'],
            duration: 1
        });
        for (let j = 0, duration = 1; j < 1; j += (1 / duration)) {
            duration = type[getRandomFromRange(0, type.length - 1)];
            while (j + (1 / duration) > 1) {
                duration = type[getRandomFromRange(0, type.length - 1)];
            }
            let pitch = chord[getRandomFromRange(0, chord.length - 1)] + "" + getRandomFromRange(4, 5);
            let note = {
                pitch: pitch,
                duration: duration,
                tension: false
            };
            if (i > 0 && j > 0) {
                let tension = addTension(tab[tab.length - 1], note, j + (1 / duration), gamme, chord, getRandomFromRange(0, 4));
                for (let k = 0; k < tension.length; k++) {
                    tab.push(tension[k]);
                    j += (1 / tension[k].duration);
                }
            }
            tab.push(note);
            //console.log(i, j, duration);
        }
    }

//console.log(tab);

    for (let i = 0; i < tab.length; ++i) {
        track.addEvent(new MidiWriter.NoteEvent({channel: 1, pitch: tab[i].pitch, duration: tab[i].duration}));
    }

    for (let i = 0; i < chordsTrackTab.length; ++i) {
        track2.addEvent(new MidiWriter.NoteEvent({
            channel: 1,
            pitch: chordsTrackTab[i].pitch,
            duration: chordsTrackTab[i].duration
        }));
    }

    for (let i = 0; i < chordsTrackTab.length; ++i) {
        //track3.addEvent(new MidiWriter.NoteEvent({channel : 10, pitch: chordsTrackTab[i].pitch, duration: chordsTrackTab[i].duration}));
    }

    var writer = new MidiWriter.Writer([track, track2, track3]);
    return writer.dataUri();

    function getChordsListFromScale (scale, nbChords) {
        let nbMin = 0;
        let nbDim = 0;
        let nbMaj = 0;
        let chords = [];
        for ( ; chords.length < nbChords ; ) {
            let note = getRandomFromRange(0, chosenScale.length - 1);

            let note1 = notesGenTab[(notesGenTab.indexOf(scale) + chosenScale[(note) % chosenScale.length]) % notesGenTab.length];
            let isNew = true;
            for (let i = 0 ; isNew && i < chords.length ; ++i) {
                if (chords[i][0] == note1) {
                    isNew = false;
                }
            }
            if (isNew) {
                let note2 = notesGenTab[(notesGenTab.indexOf(scale) + chosenScale[(note + 2) % chosenScale.length]) % notesGenTab.length];
                let note3 = notesGenTab[(notesGenTab.indexOf(scale) + chosenScale[(note + 4) % chosenScale.length]) % notesGenTab.length];
                if (nbDim < cNbDim) {
                    if (!isDimChord([ chosenScale[note],
                        chosenScale[(note + 2) % chosenScale.length],
                        chosenScale[(note + 4) % chosenScale.length]])) {
                        continue;
                    }
                } else if (nbMin < cNbMin) {
                    if (!isMinChord([ chosenScale[note],
                        chosenScale[(note + 2) % chosenScale.length],
                        chosenScale[(note + 4) % chosenScale.length]])) {
                        continue;
                    }
                } else if (nbMaj < cNbMaj) {
                    if (!isMajChord([ chosenScale[note],
                        chosenScale[(note + 2) % chosenScale.length],
                        chosenScale[(note + 4) % chosenScale.length]])) {
                        continue;
                    }
                }

                if (isDimChord([  chosenScale[note],
                        chosenScale[(note + 2) % chosenScale.length],
                        chosenScale[(note + 4) % chosenScale.length]])
                    && nbDim === cNbMaxDim) {
                    continue;
                }

                let type = "";
                if (isDimChord([  chosenScale[note],
                    chosenScale[(note + 2) % chosenScale.length],
                    chosenScale[(note + 4) % chosenScale.length]])) {
                    type = "Dim";
                    nbDim++;
                }

                if (isMinChord([  chosenScale[note],
                    chosenScale[(note + 2) % chosenScale.length],
                    chosenScale[(note + 4) % chosenScale.length]])) {
                    type = "m";
                    nbMin++;
                }

                if (isMajChord([  chosenScale[note],
                    chosenScale[(note + 2) % chosenScale.length],
                    chosenScale[(note + 4) % chosenScale.length]])) {
                    nbMaj++;
                }

                //console.log(note1 + type);
                chords.push([note1, note2, note3]);
            }
        }

        return chords;
    }

    function getRandomFromRange(min, max) {
        return min + Math.floor(generator() * (max + 1 - min));
    }

    function addTension (previousNote, nextNote, mesure, scale, currentChord, nbMaxTension) {
        let tension = [];
        let count = 0;
        while (mesure < 1 && count < nbMaxTension) {
            if (getRandomFromRange(0, 10, generator) > 8 && tension.length == 0) {
                let pitch = scaleNotes[getRandomFromRange(0, scaleNotes.length - 1)];
                let height = nextNote.pitch.substr(nextNote.pitch.length-1, 1);
                if (currentChord.indexOf(pitch) < 0) {

                    let duration = type[getRandomFromRange(0, type.length - 1)];
                    while (mesure + (1 / duration) > 1) {
                        duration = type[getRandomFromRange(0, type.length - 1)];
                    }
                    tension.push({
                        pitch: pitch + height,
                        duration: duration,
                        tension: true
                    });
                    mesure += 1 / duration;
                }
            } else {

                let nextNoteIndex = notesTab.indexOf(nextNote.pitch);
                let tensionDistance = getRandomFromRange(-1, 1);
                while (tensionDistance === 0) {
                    tensionDistance = getRandomFromRange(-1, 1);
                }
                let duration = type[getRandomFromRange(0, type.length - 1)];
                while (mesure + (1 / duration) > 1) {
                    duration = type[getRandomFromRange(0, type.length - 1)];
                }
                let nextNoteName = nextNote.pitch.substr(0, nextNote.pitch.length - 1);
                //console.log(nextNote.pitch.substr(0, nextNote.pitch.length - 1));
                //console.log(scale);
                //console.log ((notesGenTab.indexOf(nextNoteName) - notesGenTab.indexOf(scale) + notesGenTab.length) % notesGenTab.length);

                let dist = (notesGenTab.indexOf(nextNoteName) - notesGenTab.indexOf(scale) + notesGenTab.length) % notesGenTab.length;
                let chosenScaleIndex = chosenScale.indexOf(dist);

                //console.log("dist :" , dist);
                //console.log("chosenScaleIndex :" , chosenScaleIndex);
                //console.log("tensionDistance :" , tensionDistance);
                let newPitchDist = chosenScale[(chosenScaleIndex + tensionDistance + chosenScale.length) % chosenScale.length] - dist;

                if (newPitchDist > 6) {
                    newPitchDist -= 12;
                }
                if (newPitchDist < -6) {
                    newPitchDist += 12;
                }
                //console.log(newPitchDist);

                if (0 <= nextNoteIndex + newPitchDist && nextNoteIndex + newPitchDist < notesTab.length) {
                    tension.push({
                        pitch: notesTab[nextNoteIndex + newPitchDist],
                        duration: duration,
                        pitchDist: newPitchDist,
                        tension: true
                    });
                    mesure += 1 / duration;
                }
            }
            count++;
        }
        return tension;
    }


    function getScaleNotes(gamme) {
        let scaleNotes = [];
        for (let i = 0 ; i < chosenScale.length ; i++) {
            scaleNotes.push (notesGenTab[(notesGenTab.indexOf(gamme) + chosenScale[i]) % notesGenTab.length]);
        }
        //console.log(scaleNotes);
        return scaleNotes;
    }

}

function isDimChord(chord) {
    return ((chord[1] - chord[0]) + 12) % 12 === 3
        && ((chord[2] - chord[0]) + 12) % 12 === 6;
}

function isMinChord(chord) {
    return ((chord[1] - chord[0]) + 12) % 12 === 3
        && ((chord[2] - chord[0]) + 12) % 12 === 7;
}

function isMajChord(chord) {
    return ((chord[1] - chord[0]) + 12) % 12 === 4
        && ((chord[2] - chord[0]) + 12) % 12 === 7;
}


module.exports.generate = generate;