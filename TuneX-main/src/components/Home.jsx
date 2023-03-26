import React from 'react'
import Player from './Player'
import PlayerList from './PlayerList'
import Settings from './Settings'

const home = () => {

    return (
        <div className="container">
            <div className='logoTitle_container'>
                <div className="logo"></div>
                <h1 className='title'>TuneX</h1>
            </div>
            <div className="tools_container">
                <Settings />
                <Player />
                <PlayerList />
            </div>
        </div>
    )
}

export default home
