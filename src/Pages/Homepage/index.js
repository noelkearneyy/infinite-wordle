import './index.css';
import { useState, useEffect } from 'react';
import SettingsModal from '../../Components/SettingsModal';

const Homepage = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({});
    
    const handleShowSettings = ()=> {
        setShowSettings(!showSettings);
    };

    const handleSaveSettings = () => {
        
    };

    const handleStart = () => {
        
    };

    return (
        <div className='centered-container'>
            <h1 className='title'>INFINITE WORDLE</h1>
            { showSettings && <SettingsModal setShowSettings={setShowSettings} setSettings={setSettings} /> }
            { !showSettings && <button className='standard-btn' onClick={handleStart}>START</button> }
           
            <button className='standard-btn' onClick={handleShowSettings}>{ showSettings ? 'CLOSE':'SETTINGS'}</button>
        </div>
    );
}

export default Homepage;