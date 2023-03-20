// ----------------------------------------------------------------------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// ----------------------------------------------------------------------------------------------------------------------------------------
// PARENT COMPONENT - SettingsPage
// ----------------------------------------------------------------------------------------------------------------------------------------
const SettingsPage = (props) => {

// ----------------------------------------------------------------------------------------------------------------------------------------
// STATE
// ----------------------------------------------------------------------------------------------------------------------------------------
    // mainSettings State Object - used to store the previous/altered game settings within the SettingsPage
    const [mainSettings, setMainSettings] = useState({
        wordLength: '',
        tries: '',
    });

// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
    // useEffect hook is is executed on the initial component render and executed when the array dependancy changes (props.settings)
    useEffect(() => {
        // the settings current game settings are set to the mainSettings State Object
        setMainSettings(props.settings);
    },[props.settings]);
        
    // handleInputChange - Function (event) - executes when the wordLength and tries input are altered, the mainSettings State Object is updated to reflect these changes 
    const handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        setMainSettings({...mainSettings, [name]:value})
    }

// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className='settings-container'>
            <h1 className='title'>SETTINGS</h1>
                <form className='form'>
                    <label className='bold'>WORD LENGTH: {mainSettings.wordLength} </label>
                    <input className='range-input' name='wordLength' value={mainSettings.wordLength} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <label className='bold'>TRIES: {mainSettings.tries} </label>
                    <input className='range-input' name='tries' value={mainSettings.tries} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <Link state={{ savedSettings: mainSettings }} to='/' className='standard-btn settings-btn' >SAVE</Link>
                </form>
        </div>
    );
}

export default SettingsPage;