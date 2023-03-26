import React, { useEffect, useRef, useState } from 'react'

import { FaPause } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
import { IoMdSkipForward } from 'react-icons/io';

const constraint = { audio: true };
const fftsize = 64;
const Backup = ({ audioEle, isPlaying, setIsPlaying }) => {


    const [bars, setBars] = useState([]);

    const calHeightArray = (dataArray) => {
        let a = dataArray.filter((ele, ind) => ind % 2 === 0);
        let b = dataArray.filter((ele, ind) => ind % 2 !== 0);
        a.reverse();
        dataArray = a.concat(b);

        dataArray.forEach((val, index) => {
            if (dataArray[index] === 0) {
                dataArray[index] = 0;
                // } else if (index < 3 || index >= fftsize / 2 - 3) {
                //     dataArray[index] = val / (1.0 * 26);
                // } else if (index < 5 || index >= fftsize - 5) {
                //     dataArray[index] = val / (1.0 * 24);
                // } else if (index < 7 || index >= fftsize / 2 - 7) {
                //     dataArray[index] = val / (1.0 * 22);
                // } else if (index < 10 || index >= fftsize / 2 - 10) {
                //     dataArray[index] = val / (1.0 * 20);
                // } else if (index < 16 || index >= fftsize / 2 - 16) {
                //     dataArray[index] = val / (1.0 * 18);
                // } else if (index < 18 || index >= fftsize / 2 - 18) {
                //     dataArray[index] = val / (1.0 * 16);
                // } else if (index < 20 || index >= fftsize / 2 - 20) {
                //     dataArray[index] = val / (1.0 * 10);
                // } else if (index < 22 || index >= fftsize / 2 - 22) {
                //     dataArray[index] = val / (1.0 * 6);
                // } else if (index < 26 || index >= fftsize / 2 - 26) {
                //     dataArray[index] = val / (1.0 * 4);
            } else {
                dataArray[index] = val / (1.0 * 3);
            }
        })
        setBars(dataArray);
    }


    const playPause = () => {
        // audioEle.current.play();
        setIsPlaying(!isPlaying);

        if (audioEle.current && !isPlaying) {
            try {
                const ctx = new AudioContext();
                // const audioSrc = ctx.createMediaStreamSource(audio);

                const audioSrc = ctx.createMediaElementSource(audioEle.current);
                const analyser = ctx.createAnalyser();

                audioSrc.connect(analyser);
                analyser.connect(ctx.destination);

                analyser.fftSize = fftsize;
                const bufferLength = analyser.frequencyBinCount;;
                const frequencyData = new Uint8Array(bufferLength);

                var intervalId = setInterval(() => {
                    analyser.getByteFrequencyData(frequencyData);
                    let dataArray = Object.values(frequencyData);
                    calHeightArray(dataArray);
                }, 1);
            } catch (err) {
                console.log(err);
            }
        } else {
            clearInterval(intervalId);
        }

    }

    return (
        <div>
            <div className='container'>
                <div className='logoTitle'>
                    <div className="box"></div>
                    <h1 className='title'>TuneX</h1>
                </div>
                <div className='animContainer'>
                    <ul className="bars">
                        {
                            bars && bars.map((ele, ind) => {
                                return (
                                    <li style={{ height: `${ele}px` }} key={ind}></li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className='player_container'>
                <div className='title'>
                    <p>first song</p>
                </div>
                <div className="navigation">
                    <div className="navigation_wrapper">
                        <div className="seek_bar" style={{ width: '50%' }}></div>
                    </div>
                </div>
                <div className="controls">
                    {
                        isPlaying ? (<FaPause className='btn_action' onClick={playPause} />) :
                            (<FaPlay className='btn_action pp' onClick={playPause} />)
                    }
                    <IoMdSkipForward className='btn_action' />
                </div>
            </div>
        </div>
    );
}

export default Backup