import './index.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            <Link className='standard-btn' to='/play'>START</Link>
            <Link className='standard-btn' to='/settings'>SETTINGS</Link>
         </div>
    );
}

export default Homepage;