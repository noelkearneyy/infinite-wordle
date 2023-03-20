// ----------------------------------------------------------------------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------------------------------------------------------------------
import './index.css';
import { Link } from 'react-router-dom';
import LetterAnimation from '../../Components/Homepage/LetterAnimation';

// ----------------------------------------------------------------------------------------------------------------------------------------
// PARENT COMPONENT - Homepage
// ----------------------------------------------------------------------------------------------------------------------------------------
const Homepage = () => {
    
// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className='centered-container'>
            <LetterAnimation />
            {/* Homepage Title */}
            <h1 className='title'>INFINITE WORDLE</h1>
            {/* Start Button Link - to Gamepage */}
            <Link className='standard-btn' to='/play'>START</Link>
            {/* Settings Button Link - to SettingsPage */}
            <Link className='standard-btn' to='/settings'>SETTINGS</Link>

            <span className='note'>Click Me!</span>
    </div>
    );
}

export default Homepage;