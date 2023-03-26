import React, { useContext, useEffect, useRef, useState } from 'react'

import { FaPause } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
import { SongContext } from '../contexts/SongContext';
import { FaStepBackward } from 'react-icons/fa';
import { FaStepForward } from 'react-icons/fa';
import { MdVolumeUp } from 'react-icons/md';
import { BiFullscreen } from 'react-icons/bi';
import { IoSettingsSharp } from 'react-icons/io5';
import { ImLoop2 } from "react-icons/im";
import SeekBarSlider from './SeekBarSlider';

var fftsize = 64;
const PlayerControls = ({ currentSong, setCurrentSong, currentSongIndx, setCurrentSongIndx, audioRef, playList, setPlayList }) => {


    const { data, dispatch } = useContext(SongContext);

    const [bars, setBars] = useState([]);
    const [currSongName, setCurrSongName] = useState(currentSong?.split("/")[currentSong?.split("/").length - 1]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [currSongVolume, setCurrSongVolume] = useState(100);

    const loopRef = useRef();
    const [loopOn, setLoopOn] = useState(0);

    if (window.screen.width < 426) {
        fftsize = 32;
    }

    const calHeightArray = (dataArray) => {
        let a = dataArray.filter((ele, ind) => ind % 2 === 0);
        let b = dataArray.filter((ele, ind) => ind % 2 !== 0);
        a.reverse();
        dataArray = a.concat(b);

        dataArray.forEach((val, index) => {
            if (dataArray[index] === 0) {
                dataArray[index] = 0;
            } else {
                if (window.screen.width < 426) {
                    dataArray[index] = val / (1.0 * 1);
                } else {
                    dataArray[index] = val / (1.0 * 3);
                }
            }
        })
        setBars(dataArray);
    }

    const runSongAnim = () => {
        if (data.currSongIsPlaying && data.currSongAudioSrc && data.currSongAnalyser) {
            data.currSongAudioSrc.connect(data.currSongAnalyser);
            data.currSongAudioSrc.connect(data.currSongCtx.destination);
            data.currSongAnalyser.fftSize = fftsize;

            const bufferLength = data.currSongAnalyser.frequencyBinCount;;
            const frequencyData = new Uint8Array(bufferLength);

            setInterval(() => {
                data.currSongAnalyser.getByteFrequencyData(frequencyData);
                let dataArray = Object.values(frequencyData);
                calHeightArray(dataArray);
            }, 1);
        }
    }
    const handlePlayPause = () => {
        if (currentSong) {
            if (data.currSong && currentSong === data.currSong) {
                const payload = {
                    currSongIsPlaying: !data.currSongIsPlaying
                }
                dispatch({ type: "SONG_PLAYED_PAUSED", payload: payload });
            } else if (currentSong !== data.currSong) {
                const audioCtx = new AudioContext();
                const audioSrc = audioCtx.createMediaElementSource(audioRef.current);
                const audioAnalyser = audioCtx.createAnalyser();
                const payload = {
                    currSongIsPlaying: true,
                    currSong: currentSong,
                    currSongIndx: currentSongIndx,
                    currSongCtx: audioCtx,
                    currSongAudioSrc: audioSrc,
                    currSongAnalyser: audioAnalyser
                }
                dispatch({ type: "SONG_CHANGED", payload: payload });
            }
        }
    }

    const mod = (n, m) => {
        return ((n % m) + m) % m;
    }

    const handlePrev = () => {
        const prevSongIndx = mod(data.currSongIndx - 1, playList.length);
        const prevSong = playList[prevSongIndx];
        setCurrentSongIndx(prevSongIndx);
        setCurrentSong(prevSong);
        setCurrSongName(() => prevSong?.split("/")[prevSong?.split("/").length - 1]);
        const payload = {
            ...data,
            currSongIsPlaying: true,
            currSong: prevSong,
            currSongIndx: prevSongIndx,
        }
        dispatch({ type: "SONG_CHANGED", payload: payload });
    }
    const handleNext = () => {
        const nextSongIndx = mod(data.currSongIndx + 1, playList.length);
        const nextSong = playList[nextSongIndx];
        setCurrentSongIndx(nextSongIndx);
        setCurrentSong(nextSong);
        setCurrSongName(() => nextSong?.split("/")[nextSong?.split("/").length - 1]);
        const payload = {
            ...data,
            currSongIsPlaying: true,
            currSong: nextSong,
            currSongIndx: nextSongIndx,
        }
        dispatch({ type: "SONG_CHANGED", payload: payload });
    }
    const handleBackward = () => {
        audioRef.current.currentTime -= 5;
    }
    const handleForward = () => {
        audioRef.current.currentTime += 5;
    }

    const handleSeekBarValueChange = (event) => {
        setTimeElapsed(event.target.value);
        audioRef.current.currentTime = event.target.value;
    }

    const handleLoop = () => {
        if (loopOn) {
            loopRef.current.classList.remove('clickSelect');
        } else {
            loopRef.current.classList.add('clickSelect');
        }
        setLoopOn(prev => !prev);
    }

    const handleVolumeChange = (event) => {
        audioRef.current.volume = (event.target.value) / 100;
        setCurrSongVolume(event.target.value);
    }

    const timeFormat = (Tsec) => {
        let min = Math.floor(Tsec / 60);
        let sec = Tsec % 60;
        min = (min < 10) ? `0${min}` : `${min}`;
        sec = (sec < 10) ? `0${sec}` : `${sec}`;
        let time = `${min}:${sec}`;
        return time;
    }

    useEffect(() => {
        if (audioRef.current?.currentTime) {
            setTimeElapsed(Math.floor(audioRef.current?.currentTime));
            setTimeRemaining(Math.floor(audioRef.current?.duration) - Math.floor(audioRef.current?.currentTime));
            setTotalTime(Math.floor(audioRef.current?.duration));
        }
        if (audioRef.current?.currentTime === audioRef.current?.duration) {
            setTimeElapsed(0);
            const payload = {
                currSongIsPlaying: false
            }
            dispatch({ type: "SONG_PLAYED_PAUSED", payload: payload });
        }
    }, [audioRef.current?.currentTime]);

    useEffect(() => {
        runSongAnim();
        if (loopOn && !data.currSongIsPlaying && audioRef.current?.currentTime === audioRef.current?.duration) {
            const payload = {
                currSongIsPlaying: !data.currSongIsPlaying
            }
            dispatch({ type: "SONG_PLAYED_PAUSED", payload: payload });
        }
    }, [data.currSongIsPlaying]);



    return (
        <div className='playerControls_container'>
            <div className='songAnim_container'>
                {
                    data.currSongIsPlaying ? (<ul className="bars">
                        {
                            bars && bars.map((ele, ind) => {
                                return (
                                    <li className='bar' style={{ height: `${ele}px` }} key={ind}></li>
                                )
                            })
                        }
                    </ul>
                    ) : (
                        <>
                            <h2 > TuneX: eXplore the Tunes</h2>
                            <h2>Play !t</h2>
                        </>
                    )
                }
            </div>

            <div className='songDetails_container'>
                <h1>{currSongName}</h1>
            </div>

            <div className="seekBar_container">
                <SeekBarSlider
                    seekBarValue={timeElapsed % totalTime}
                    handleSeekBarValueChange={handleSeekBarValueChange}
                    minSeekBarValue={0}
                    maxSeekBarValue={totalTime}
                    seekBarValueSteps={1}
                />
            </div>

            <div className='controls_container'>
                <div className="controls">
                    <button className='ctrBtn' onClick={handlePrev}>
                        <FaStepBackward />
                    </button>
                    <button className='ctrBtn' onClick={handlePlayPause}>
                        {
                            data.currSongIsPlaying ? (<FaPause />) : (<FaPlay />)
                        }
                    </button>
                    <button className='ctrBtn' onClick={handleNext}>
                        <FaStepForward />
                    </button>
                    <button className='ctrBtn' >
                        <MdVolumeUp />
                    </button>
                    <input type="range"
                        className='volumeBar'
                        min={0}
                        max={100}
                        step={1}
                        value={currSongVolume}
                        onChange={handleVolumeChange}
                    />
                    <p className='songTime'>{timeFormat(timeElapsed)} / {timeFormat(totalTime)}</p>
                    <button className='ctrBtn' ref={loopRef} onClick={handleLoop}>
                        <ImLoop2 />
                    </button>
                </div>
                <div className='controls'>
                    <button className='ctrBtn'>
                        <IoSettingsSharp />
                    </button>
                    {/* <button className='ctrBtn'>
                        <BiFullscreen />
                    </button> */}
                </div>
            </div>
        </div >
    );
}

export default PlayerControls
