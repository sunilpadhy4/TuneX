import { createContext, useContext, useReducer } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {

    const INITIAL_STATE = {
        currSongIsPlaying: null,
        currSong: "",
        currSongIndx: 0,
        currSongCtx: null,
        currSongAudioSrc: null,
        currSongAnalyser: null
    };

    const SongReducer = (state, action) => {
        switch (action.type) {
            case "SONG_CHANGED":
                return {
                    ...state,
                    currSongIsPlaying: true,
                    currSong: action.payload.currSong,
                    currSongIndx: action.payload.currSongIndx,
                    currSongCtx: action.payload.currSongCtx,
                    currSongAudioSrc: action.payload.currSongAudioSrc,
                    currSongAnalyser: action.payload.currSongAnalyser
                };
            case "SONG_PLAYED_PAUSED":
                return {
                    ...state,
                    currSongIsPlaying: action.payload.currSongIsPlaying,
                }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(SongReducer, INITIAL_STATE);
    return (
        <SongContext.Provider value={{ data: state, dispatch }}>
            {children}
        </SongContext.Provider>
    );
}