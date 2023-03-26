import React from 'react'
import styled from 'styled-components';

const SeekBarSlider = ({ seekBarValue, handleSeekBarValueChange, minSeekBarValue, maxSeekBarValue, seekBarValueSteps }) => {

    return (
        <>
            <input className='seekBar' type="range"
                value={isNaN(seekBarValue) ? 0 : seekBarValue}
                onChange={handleSeekBarValueChange}
                min={minSeekBarValue}
                max={maxSeekBarValue}
                step={seekBarValueSteps}
            />
        </>
    )
}

export default SeekBarSlider
