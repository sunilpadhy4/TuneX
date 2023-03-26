import React, { useContext, useEffect, useRef, useState } from 'react'
import { SongContext } from '../contexts/SongContext';
import PlayerControls from './PlayerControls';

const Player = () => {
    const songData = ["./music/song1.mp3", "./music/song2.mp3", "./music/song3.mp3", "./music/song4.mp3", "./music/song5.mp3"];

    const { data, dispatch } = useContext(SongContext);

    const [songs, setSongs] = useState(songData);
    const [playList, setPlayList] = useState(songData);
    const [currentSongIndx, setCurrentSongIndx] = useState(0);
    const [currentSong, setCurrentSong] = useState(playList[0]);

    const audioRef = useRef();

    useEffect(() => {
        if (data.currSongIsPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [data.currSongIsPlaying, currentSong]);

    return (
        <>
            <div>
                <audio id='song' src={currentSong} ref={audioRef} />
                <PlayerControls
                    audioRef={audioRef}
                    currentSong={currentSong}
                    setCurrentSong={setCurrentSong}
                    currentSongIndx={currentSongIndx}
                    setCurrentSongIndx={setCurrentSong}
                    playList={playList}
                    setPlayList={setPlayList}
                />
            </div>
        </>
    )
}

export default Player
