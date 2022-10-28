import { useEffect, useState } from 'react';
import './index.css';

const SettingsModal = ({setShowSettings, setSettings}) => {

    const [mainSettings, setMainSettings] = useState({
        wordLength: '',
        tries: '',
    });

    // useEffect(() => {
    //     const defaultSettings = {
    //         wordLength: 5, 
    //         tries: 6, 
    //     };
    //     setMainSettings(defaultSettings);
    // },[])
        
    const handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        setMainSettings({...mainSettings, [name]:value})
    }

    const handleSettingsSubmit = (event) => {
        event.preventDefault();
        setSettings(mainSettings);
        setShowSettings(false);
    }

    return (
        <div className='settings-container'>
            <h2 className='title'>SETTINGS</h2>
                <form className='form' onSubmit={handleSettingsSubmit}>
                    <label className='bold'>WORD LENGTH: {mainSettings.wordLength} </label>
                    <input name='wordLength' value={mainSettings.wordLength} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <label className='bold'>TRIES: {mainSettings.tries} </label>
                    <input name='tries' value={mainSettings.value} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <input className='standard-btn' type='submit' value='SAVE' />
                </form>
        </div>
    );
}

export default SettingsModal;