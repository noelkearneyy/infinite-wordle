import './index.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Settings = (props) => {
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

    const handleSettingsSubmit = (event) => {
        event.preventDefault();
        window.location.href = '/'
        props.setSettings(mainSettings)
        
    }

    return (
        // <div className='settings-container'>
        <>
            <h1 className='title'>SETTINGS</h1>
                <form className='form' onSubmit={handleSettingsSubmit}>
                    <label className='bold'>WORD LENGTH: {mainSettings.wordLength} </label>
                    <input name='wordLength' value={mainSettings.wordLength} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    <label className='bold'>TRIES: {mainSettings.tries} </label>
                    <input name='tries' value={mainSettings.value} onChange={handleInputChange} type='range' min={3} max={8} /> 
                    {/* <input className='standard-btn settings-btn' type='submit' value='SAVE' /> */}
                    <Link to={{
                        pathname: '/',
                        state: { settings: mainSettings }
                    }}/>
                </form>
                </>
        // </div>
    );
}

const Homepage = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState();

    useEffect(()=>{

        setSettings(settings);   
        
    },[])
  
//     <div className='centered-container'>
//     
//  </div>
    return (
        <div className='centered-container'>
        { showSettings ? <Settings /> : 
        <>
            <h1 className='title'>INFINITE WORDLE</h1>
            <Link className='standard-btn' to='/play'>START</Link>
            <Link className='standard-btn' to='/settings'>SETTINGS</Link>
        </>
       
    }
    </div>
    );
}

export default Homepage;