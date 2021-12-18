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

//generateV4({});

function generateV4 (options) {
    console.log("GENERATEV4");
    var seedName = '';
    if (options.seed) {
        seedName = options.seed;
    }
    //seedName = "sdfhiuosdchuisd";
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
  
    var structure = {
        tracks : [
            {
                type : "Soprano",
                instrument : 1,
                channel : 1
            },
            {
                type : "Alto",
                instrument : 1,
                channel : 1
            },
            {
                type : "Chords",
                instrument : 1,
                channel : 1
            },
            {
                type : "Drums",
                style : "Punk",
                instrument : 1,
                channel : 10
            }
          
        ],
        types : 
        [
            {
                type : "Intro",
                nbRotations : 1,
                nbChords : 1,
                tracks : [
                    {
                        duration : [
                            2, 2,
                            4, 4
                        ]
                    },
                    {
                        duration : [
                            2, 2,
                            4, 4
                        ]
                    },
                    {
                        style : ""
                    },
                    {
                        style : "Slow"
                    }
                ]
                
            },        
            {
                type : "Verse",
                nbRotations : 2,
                nbChords : 2,
                tracks : [
                    {
                        duration : [
                            1,
                            2, 2,
                            4, 4, 4, 4, 4,
                            8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                            16
                        ]
                    },
                    {
                        duration : [
                            1,
                            2, 2,
                            4, 4, 4, 4, 4,
                            16
                        ]
                    },
                    {
                        style : ""
                    },
                    {
                        style : "Energic"
                    },
                ]
            },
            {
                type : "Chorus",
                nbRotations : 1,
                nbChords : 3,
                tracks : [
                    {
                        duration : [
                            1,
                            2, 2,
                            4, 4, 4, 4, 4,
                            8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                            16
                        ]
                    },
                    {
                        duration : [
                            1,
                            2, 2,
                            4, 4, 4, 4, 4
                        ]
                    },
                    {
                        style : ""
                    },
                    {
                        style : "Slow"
                    }
                ]
            },
            {
                type : "Bridge",
                nbRotations : 1,
                nbChords : 1,
                tracks : [
                    {
                        duration : [
                            4,
                            8
                        ]
                    },
                    {
                        duration : [
                            4,
                            8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                            16
                        ]
                    },
                    {
                        style : ""
                    },
                    {
                        style : "Energic"
                    }
                ]
            },
            {
                type : "Outro",
                nbRotations : 1,
                nbChords : 1,
                tracks : [
                    {
                        duration : [
                            2,
                            4
                        ]
                    },
                    {
                        duration : [
                            2,
                            4
                        ]
                    },
                    {
                        style : ""
                    },
                    {
                        style : "Slow"
                    }
                ]
           }
        ],
        order : [
            "Intro",
            "Verse",
            "Chorus",
            "Verse",
            "Chorus",
            "Bridge",
            "Outro"
        ]
    };

    var gammeIndex = getRandomFromRange(0, notesTab.length - 1);
    var gamme = notesTab[gammeIndex].substr(0, notesTab[gammeIndex].length - 1);

    let scaleNotes = getScaleNotes(gamme);

    var tempo = getRandomFromRange(80, 150);
    if (options.tempo) {
        tempo = options.tempo;
    }
  
    var tracks = initTracks(structure.tracks, tempo);
  
    var tabByTypes = [];
  
    for (var i = 0 ; i < structure.types.length ; ++i) {
          
        var tmpTab = createSequence({
            type : structure.types[i],
            tracks : structure.tracks
        });

        tabByTypes.push({
            type : structure.types[i].type,
            content : tmpTab
        })
    }
  
    //console.log(JSON.stringify(tabByTypes));
    console.log(tabByTypes);
    
    buildTracks (tabByTypes, structure, tracks);
    //console.log(tracks);
    /** /
    tracks[0].addEvent(new MidiWriter.NoteEvent({channel: 1, pitch: "C#5", duration: 1}));
    tracks[0].addEvent(new MidiWriter.NoteEvent({channel: 1, wait: 1}));
    /**/
/*
    for (let i = 0; i < tab.length; ++i) {
        track.addEvent(new MidiWriter.NoteEvent({channel: 1, pitch: tab[i].pitch, duration: tab[i].duration}));
    }
*/
    /*

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
    */
    console.log("DJDHDH");
    var writer = new MidiWriter.Writer(tracks);
    return {
      music : writer.dataUri(),
      scale : gamme + ((chosenScale == minorScale) ? ' minor' : ' Major'),
      //chords : getChordsNames (chordsList),
      tempo : tempo
    };
  
    function createSequence (params) {
        //console.log("Begin " + params.type.type);
        var sequencesByTrack = [];
        let chordsList = getChordsListFromScale(gamme, params.type.nbChords, chosenScale);
        for (let i = 0 ; i < params.tracks.length ; ++i) {
            var tab = [];
            for (let j = 0; j < params.type.nbChords * params.type.nbRotations; ++j) {
                let chord = chordsList[j % chordsList.length];
                if (!params.type.tracks[i]) {
                    tab.push({wait: 1});
                    continue;
                } else {
                    if (params.tracks[i].type == "Soprano") {
                        // Soprano    
                        createBar(5,5,chord,tab,params.type.tracks[i].duration);
                    } else if (params.tracks[i].type == "Alto") {
                        // Soprano    
                        createBar(4,4,chord,tab,params.type.tracks[i].duration);
                    } else if (params.tracks[i].type == "Chords") {
                        // Chords    
                        createChordsBar(chord,tab);
                    } else if (params.tracks[i].type == "Drums") {
                        createDrumBar(params.tracks[i].style, params.type.tracks[i].style, tab);
                    }
                }
            }
            //console.log(params.type.type, i, tab);
            sequencesByTrack.push({
                sequence : tab
            });
        }
        //console.log("End " + params.type.type);
        return sequencesByTrack;
        
    }

    function initTracks (tracksData, tempo) {
      
        var tracks = [];
      
        for (var i = 0 ; i < tracksData.length ; i++) {
            let data = tracksData[i];
            // Start with a new track
            let track = new MidiWriter.Track();

            track.setTempo(tempo);

            // Define an instrument :
            track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: data.instrument}));
          
            tracks.push(track);
        }
        return tracks;
    }

    function buildTracks (tabByTypes, structure, midiTracks) {
        var order = structure.order;
        for (var i = 0 ; i < order.length ; i++) {
            let type = order[i];
            let sequence = tabByTypes.filter(typeSeq => typeSeq.type == type)[0];
            for (var j = 0 ; j < sequence.content.length ; j++) {
                var content = sequence.content[j];
                var track = structure.tracks[j];
                for (var x = 0 ; x < content.sequence.length ; x++) {
                    //console.log(content.sequence[x]);
                    //console.log({channel: track.channel, pitch: content.sequence[x].pitch, duration: content.sequence[x].duration});
                    if (content.sequence[x].pitch) {
                        midiTracks[j].addEvent(new MidiWriter.NoteEvent({channel: track.channel, pitch: content.sequence[x].pitch, duration: content.sequence[x].duration}));
                    } else {
//                        midiTracks[j].addEvent(new MidiWriter.NoteEvent({channel: track.channel, wait: content.sequence[x].wait}));
                    }
                }
            }
        }
        console.log("END");
    }
  
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
  
    function createChordsBar (chord,tab) {
        tab.push({
            pitch: [chord[0] + '3', chord[1] + '3', chord[2] + '3'],
            duration: 1
        });
    }

    
    function createDrumBar (style, substyle, tab) {

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
      
        return tab;
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

                chords.push([note1, note2, note3]);
            }
        }

        return chords;
    }

    function getRandomFromRange(min, max) {
        return min + Math.floor(generator() * (max + 1 - min));
    }

    function createBar(minRange, maxRange, chord, tab, type) {
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
                duration = type[getRandomFromRange(0, type.length - 1)];
            }
          
            let pitch = chord[getRandomFromRange(0, chord.length - 1)] + "" + getRandomFromRange(minRange, maxRange);
            let note = {
                pitch: pitch,
                duration: duration,
                tension: false
            };
            
            if (i > 0 && j > 0 && Math.floor(((j + (1 / duration)) * 4)) < ((j + (1 / duration)) * 4)) {
                let tension = addTension(tab[tab.length - 1], note, j + (1 / duration), gamme, chord, getRandomFromRange(0, 4), type);
                for (let k = 0; k < tension.length; k++) {
                    tab.push(tension[k]);
                    j += (1 / tension[k].duration);
                }
            }
            
            tab.push(note);
        }
      
        return tab;
        
    }

    function addTension (previousNote, nextNote, mesure, scale, currentChord, nbMaxTension, type) {
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
              
                while (mesure + (1 / duration) > 1
                       || ((mesure + (1 / duration)) * 4) > Math.floor((mesureDeb * 4) + 1)) {
                  
                    duration = type[getRandomFromRange(0, type.length - 1)];
                  
                }
              
                let nextNoteName = nextNote.pitch.substr(0, nextNote.pitch.length - 1);

                let dist = (notesGenTab.indexOf(nextNoteName) - notesGenTab.indexOf(scale) + notesGenTab.length) % notesGenTab.length;
                let chosenScaleIndex = chosenScale.indexOf(dist);

                let newPitchDist = chosenScale[(chosenScaleIndex + tensionDistance + chosenScale.length) % chosenScale.length] - dist;

                if (newPitchDist > 6) {
                    newPitchDist -= 12;
                }
                if (newPitchDist < -6) {
                    newPitchDist += 12;
                }

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

        return scaleNotes;
    }

    function getRandomFromRange(min, max) {
        return min + Math.floor(generator() * (max + 1 - min));
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


module.exports.generateV4 = generateV4;