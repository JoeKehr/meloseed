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

function generateV3 (options) {
    console.log("GENERATEV3");
    var seedName = '';
    if (options.seed) {
        seedName = options.seed;
    }
    const notesTab = [
        'C1', 'C#1',
        'D1', 'D#1',
        'E1',
        'F1', 'F#1',
        'G1', 'G#1',
        'A1', 'A#1',
        'B1',
        'C2', 'C#2',
        'D2', 'D#2',
        'E2',
        'F2', 'F#2',
        'G2', 'G#2',
        'A2', 'A#2',
        'B2',
        'C3', 'C#3',
        'D3', 'D#3',
        'E3',
        'F3', 'F#3',
        'G3', 'G#3',
        'A3', 'A#3',
        'B3',
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
    const cNbMaxDim = 99;
    const cNbMin = getRandomFromRange(0, 0);
    const cNbMaj = getRandomFromRange(0, 0);
    var chosenScale = getRandomFromRange(0, 1) ? majorScale : minorScale;
    if (options.scale) {
        if (options.scale == "minor") {
            chosenScale = minorScale;
        }
        if (options.scale == "major") {
            chosenScale = majorScale;
        }
    }
  
    var drums = false;
    if (options.drums) {
      drums = true;
    }
  
    var type = [];
  
    if (options.whole) {
        for (var i = 0 ; i < options.whole ; ++i) {
          type.push(1);
        }
    }
  
    if (options.half) {
        for (var i = 0 ; i < options.half ; ++i) {
          type.push(2);
        }
    }
  
    if (options.quarter) {
        for (var i = 0 ; i < options.quarter ; ++i) {
          type.push(4);
        }
    }
  
    if (options.eighth) {
        for (var i = 0 ; i < options.eighth ; ++i) {
          type.push(8);
        }
    }
  
    if (options.sixteenth) {
        for (var i = 0 ; i < options.sixteenth ; ++i) {
          type.push(16);
        }
    }
  
    if (type.length == 0) {
        type = [
            1,
            2, 2,
            4, 4, 4, 4, 4,
            8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
            16
        ];
    }

    
// 1 : 15%
// 2 : 33%
// 4 : 50%
// 8 :  1%
// 16 : 1%

    var gammeIndex = getRandomFromRange(0, notesTab.length - 1);
    var gamme = notesTab[gammeIndex].substr(0, notesTab[gammeIndex].length - 1);

    let scaleNotes = getScaleNotes(gamme);
    let chordsList = getChordsListFromScale(gamme, getRandomFromRange(4, 6), chosenScale);

    var tempo = getRandomFromRange(80, 150);
    if (options.tempo) {
        tempo = options.tempo;
    }
    //tempo = 160;
  
// Start with a new track
    let track = new MidiWriter.Track();
    let track2 = new MidiWriter.Track();
    let track3 = new MidiWriter.Track();
    let track4 = new MidiWriter.Track();
  
//track.setTempo(90);
    track.setTempo(tempo);
    track2.setTempo(tempo);
    track3.setTempo(tempo);
    track4.setTempo(tempo);

// Define an instrument (optional):
    // 28 : JV style
    // 42-41 : Violons
    // 30 : Guitare Electrique
    const instruments = [1, 28, 41, 30];
    var indexInstru = getRandomFromRange(0, instruments.length - 1);
    var instrument = instruments[indexInstru];
    if (options.instrument) {
        instrument = options.instrument;
    }
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: instrument})); //28
    track2.addEvent(new MidiWriter.ProgramChangeEvent({instrument: instrument}));

    let tab = [];
    let tab3 = [];
    let tab4 = [];
    let chordsTrackTab = [];
    for (let i = 0; i < chordsList.length * 12; ++i) {
        //console.log ("i = " + i);
        let chord = chordsList[i % chordsList.length];
        chordsTrackTab.push({
            pitch: [chord[0] + '3', chord[1] + '3', chord[2] + '3'],
            duration: 1
        });
       
        // Soprano    
        createBar(4,5,chord,tab);
        // Alto
        createBar(3,4,chord,tab3);
        // Baryton
        createBar(2,3,chord,tab4);
      
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

    for (let i = 0; i < tab3.length; ++i) {
        track3.addEvent(new MidiWriter.NoteEvent({channel: 1, pitch: tab3[i].pitch, duration: tab3[i].duration}));
    }

    for (let i = 0; i < tab4.length; ++i) {
        track4.addEvent(new MidiWriter.NoteEvent({channel: 1, pitch: tab4[i].pitch, duration: tab4[i].duration}));
    }
  
    var drumTrack = getDrumTrack(chordsList.length * 12, tempo);
    drumTrack.setTempo(tempo);
  
    var tracks = [];
    tracks.push(track);
    if (drums) {
        tracks.push(drumTrack);
    }
  
    var writer = new MidiWriter.Writer(tracks);
    return {
      music : writer.dataUri(),
      scale : gamme + ((chosenScale == minorScale) ? ' minor' : ' Major'),
      chords : getChordsNames (chordsList),
      tempo : tempo
    };
  
    function getChordsNames (chords) {
        var chordsNames = [];
        for (var i = 0 ; i < chords.length ; i++) {
            var type = '';
            if (isDimChord([ notesGenTab.indexOf(chords[i][0]),
                notesGenTab.indexOf(chords[i][1]),
                notesGenTab.indexOf(chords[i][2])])) {
                type = "Dim";
            }

            if (isMinChord([ notesGenTab.indexOf(chords[i][0]),
                notesGenTab.indexOf(chords[i][1]),
                notesGenTab.indexOf(chords[i][2])])) {
                type = "m";
            }
          
            chordsNames.push(chords[i][0] + type);
        }
        return chordsNames;

    }
  

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

    function createBar(minRange, maxRange, chord, tab) {
        for (let j = 0, duration = 1; j < 1; j += (1 / duration)) {
          
            duration = type[getRandomFromRange(0, type.length - 1)];
            
            while (j + (1 / duration) > 1 
                   || !((
                        (j + (1 / duration)) * 4) <= Math.floor((j * 4) + 1
                      )
                      || (
                        ((j + (1 / duration)) * 4) - Math.floor(j * 4) >= 1 
                         && (j * 4) == Math.floor(j * 4)
                      ))
                   )
            {
              /*
                console.log("WHILE");
                console.log(((j + (1 / duration)) * 4) - Math.floor(j * 4));
                console.log((j * 4) - Math.floor(j * 4));
                console.log("+Duration : " + (j + (1 / duration)), "Floor : " + (Math.floor(j * 4) / 4 ));
              */
                duration = type[getRandomFromRange(0, type.length - 1)];
            }
            //console.log("Chosen Duration : " + duration);
            let pitch = chord[getRandomFromRange(0, chord.length - 1)] + "" + getRandomFromRange(4, 5);
            let note = {
                pitch: pitch,
                duration: duration,
                tension: false
            };
            
            if (i > 0 && j > 0 && Math.floor(((j + (1 / duration)) * 4)) < ((j + (1 / duration)) * 4)) {
                let tension = addTension(tab[tab.length - 1], note, j + (1 / duration), gamme, chord, getRandomFromRange(0, 4));
                for (let k = 0; k < tension.length; k++) {
                    tab.push(tension[k]);
                    j += (1 / tension[k].duration);
                }
            }
            
            tab.push(note);
        }
      
      return tab;
        
    }

    function addTension (previousNote, nextNote, mesure, scale, currentChord, nbMaxTension) {
        //console.log("Add Tension Begin");
        //console.log(mesure);
        let tension = [];
        let count = 0;
        const mesureDeb = mesure;
        while (mesure < 1 
               && (mesure * 4) < Math.floor((mesureDeb * 4) + 1)
               && count < nbMaxTension) {
            if (getRandomFromRange(0, 10, generator) > 8 && tension.length == 0) {
                let pitch = scaleNotes[getRandomFromRange(0, scaleNotes.length - 1)];
                let height = nextNote.pitch.substr(nextNote.pitch.length-1, 1);
                if (currentChord.indexOf(pitch) < 0) {

                    let duration = type[getRandomFromRange(0, type.length - 1)];
                    while (mesure + (1 / duration) > 1 
                           || ((mesure + (1 / duration)) * 4) > Math.floor((mesureDeb * 4) + 1)) {
                        //console.log("WHILE2");
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
                //console.log("Before WHILE3");
                while (mesure + (1 / duration) > 1
                       || ((mesure + (1 / duration)) * 4) > Math.floor((mesureDeb * 4) + 1)) {
                    //console.log("WHILE3a");
                    //console.log("Mesure de base  : " + mesureDeb + " - " + (mesureDeb * 4));
                    //console.log("Mesure actuelle : " + mesure + " - " + (mesure * 4));
                    /*
                    console.log((mesure + (1 / duration)), 
                                ((mesure + (1 / duration)) * 4), 
                                Math.floor((mesureDeb * 4) + 1), 
                                1/duration);
                    */
                    duration = type[getRandomFromRange(0, type.length - 1)];
                    //console.log("WHILE3b");
                }
                //console.log("After WHILE3");
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
        //console.log("Add Tension End");
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

    function getRandomFromRange(min, max) {
        return min + Math.floor(generator() * (max + 1 - min));
    }
  
    function getDrumTrack (length, tempo) { 
        let track = new MidiWriter.Track();
      
        track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1})); 
        track.setTempo(tempo);

        let tab = [];

        for (let i = 0; i < length; ++i) {

            let note = {
                pitch: [35, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [35, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [38, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [35, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [35, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [35, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [38, 42],
                duration: 8
            };
            tab.push(note);

            note = {
                pitch: [35, 42],
                duration: 8
            };
            tab.push(note);

        }
    //console.log(tab);

        for (let i = 0; i < tab.length; ++i) {
            var event = {};
            event = tab[i];
            event.channel = 10;
            track.addEvent(new MidiWriter.NoteEvent(event));
        }

        return track;
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


module.exports.generateV3 = generateV3;