import './index.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from '../../Components/SettingsModal';

const Homepage = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState();

    useEffect(()=>{

        setSettings(settings);   
        
    },[])
    
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
            <Link to='/play'><button className='standard-btn'>START</button></Link>
            <Link to='/settings'><button className='standard-btn'>SETTINGS</button></Link>
         </div>
    );
}

export default Homepage;