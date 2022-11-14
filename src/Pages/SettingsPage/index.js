import { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import './index.css';

const SettingsPage = (props) => {

    const [mainSettings, setMainSettings] = useState({
        wordLength: '',
        tries: '',
    });

    useEffect(() => {
        setMainSettings(props.settings)
    },[])
        
    const handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        setMainSettings({...mainSettings, [name]:value})
    }

    // const handleSettingsSubmit = (event) => {
    //     event.preventDefault();
    //     window.location.href = '/'
    //     props.setSettings(mainSettings)
    // }

    return (
        <div className='settings-container'>
            <h1 className='title'>SETTINGS</h1>
                <form className='form'>
                    <label className='bold'>WORD LENGTH: {mainSettings.wordLength} </label>
                    <input name='wordLength' value={mainSettings.wordLength} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <label className='bold'>TRIES: {mainSettings.tries} </label>
                    <input name='tries' value={mainSettings.tries} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <Link state={{ savedSettings: mainSettings }} to='/' className='standard-btn settings-btn' >SAVE</Link>
                </form>
        </div>
    );
}

export default SettingsPage;