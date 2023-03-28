// ----------------------------------------------------------------------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LetterGrid from '../../Components/Gamepage/LetterGrid';
import PopUp from '../../Components/Gamepage/PopUp';
import RainAnimation from '../../Components/Gamepage/RainAnimation';
import './index.css';
import ConfettiExplosion from 'react-confetti-explosion';



import ALL_WORDS from '../../Components/Gamepage/Words'
const randomWords = require('random-english-words');

// ----------------------------------------------------------------------------------------------------------------------------------------
// PARENT COMPONENT - GamePage
// ----------------------------------------------------------------------------------------------------------------------------------------
const GamePage = ({ settings }) => {

// ----------------------------------------------------------------------------------------------------------------------------------------
// STATE
// ----------------------------------------------------------------------------------------------------------------------------------------
    // wordDetails State Object holds information regarding the current game in play, with the keys - wordString, defaultTries, wordLength, wordSplit
    const [wordDetails, setWordDetails] = useState({});
    // rowWord State Object holds the input name and letter value of the word which is to be submitted
    const [rowWord, setRowWord] = useState({});
    // submittedLetters State Object holds the formID key and the letters which have been submitted
    const [submittedLetters, setSubmittedLetters] = useState({});
    // tries State is an Int which records how many tries/forms submitted by the player
    const [tries, setTries] = useState(0);
    // gameOver State Boolean defines when the gameOver component is shown and hides the letter grid
    const [gameOver, setGameOver] = useState(false);
    // showQuit State Boolean defines when the Quit button is displayed - when the gameOver component is rendered, the quit button is hidden
    const [showQuit, setShowQuit] = useState(false);
    // showConfetti State Boolean defines when the ConfettiExplosion component is displayed - when the user has won the game
    const [showConfetti, setShowConfetti] = useState(false);
    // showRain State Boolean defines when the RainAnimation component is displayed - when the user has lost the game
    const [showRain, setShowRain] = useState(false);

    const [popupDetails, setPopupDetails] = useState({
        message: 'Enter a valid word', 
        display: false,
    });

    const timer = useRef(null);
// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
    // useEffect hook is executed on the initial render and when the dependency array changes (props.settings)
    useEffect(()=>{
        // settings.tries is converted to an Integer and set to the defaultTries variable
        let defaultTries = Number(settings.tries);
        // the random-english-words package is used to obtain a random english word. The minChars and maxChars keys are set to the wordLength in the settings object
        let randomWordString = randomWords({minCount: 1, minChars: Number(settings.wordLength), maxChars: Number(settings.wordLength)})
        // the length of the randomWordString variable
        let wordLength = randomWordString.length;
        // the randomWordLength variable is set to uppercase and each letter is split into an array - used for analysing player input
        let wordSplit = randomWordString.toUpperCase().split('');

        // wordDetails object with current word and game data as state above
        let wordDetails = { 
            wordString: randomWordString,
            defaultTries: defaultTries,
            wordLength: wordLength,
            wordSplit: wordSplit,
        };

        // wordDetails object create in the useEffect hook is set as the wordDetails State Object
        setWordDetails(wordDetails);

        //create key/values pairs for rowWords state for controlled inputs 
        let rowDetails = {};
        for(let tries=1; tries <=  settings.tries; tries++) {
            for(let letter=1; letter <= settings.wordLength; letter++) {
                rowDetails = {...rowDetails, [`input_${tries}_${letter}`]: ''}
            }
        }
        console.log(rowDetails);
        setRowWord(rowDetails);
    }, [settings])

    // validateString - Function (str) - function takes a string parameter and returns boolean if the string only contains uppercase and lowercase letter characters
    const validateString = (str) => {
        return /^[A-Za-z]/.test(str)
    }

     // sortObject - Function (obj) - function ensures word is compared with wordSplit correctly if it has been inputted in a non chronological order
     const sortObject = (obj) => {
        return Object.keys(obj).sort().reduce((res, key) => {
            res[key] = obj[key];
            return res;
        }, {})
    }

    // handleInput - Function (event) - validates player input and updates rowWord State Object
    const handleInput = (event) => {
        const target = event.target;
        const name = target.name;
        let letter = target.value;
        
        // Validate letter length is 1, only contains alpha characters & allows character to be deleted (allows null)
        if ((letter.length === 1 && validateString(letter)) || letter === '') {
            // setRowWord function updates the rowWord State Object with the input name key and the capitalised letter value
            setRowWord(sortObject({...rowWord, [name]: letter.toUpperCase()}));  
        }
    }

    const spellcheckEntry = (rowWord) => {
        const wordStr = (Object.values(rowWord).join('')).toLowerCase();
        return ALL_WORDS.includes(wordStr);
    }

    // handleRowSubmit - Function (event) - 
    const handleRowSubmit = (event) => {
        event.preventDefault();

        // id of submitted row/form
        let formId = event.target.id;
        
        // the current try number 
        let tryNo = formId.split('_')[1];
        
        // Empty array which will be used to store submitted letters
        let submittedWord = [];

        // Empty object which will be used to store submitted letter and color 
        let usedLetters = {};

        // Verify all fields are complete
        if(Object.keys(rowWord).length < wordDetails.wordLength) {
            setPopupDetails((prevState) => ({...prevState, message: 'Complete all fields', display: true}))
            clearTimeout(timer.current);
            return timer.current = setTimeout(() => {
                setPopupDetails((prevState) => ({...prevState, message: '', display: false}))
            }, 1500)
        }

        // Verify inputted word is a valid english word
        if(!spellcheckEntry(rowWord)) {
            setPopupDetails((prevState) => ({...prevState, message: 'Word not in list', display: true}))
            clearTimeout(timer.current);
            return timer.current = setTimeout(() => {
                setPopupDetails((prevState) => ({...prevState, message: '', display: false}))
            }, 1500)
        }

        // Disable current row once analysed & activate next row Form 
        if(wordDetails.defaultTries !== (parseInt(tryNo)+1)) {
            let currentForm = document.getElementById('form_'+parseInt(tryNo));
            let nextForm = document.getElementById('form_'+(parseInt(tryNo)+1));
            for (const inputField of nextForm.children) {
                inputField.removeAttribute('disabled');
            }
            for (const inputField of currentForm.children) {
                inputField.setAttribute('disabled','');
            }
            setRowWord({});
        }

            for (let i in rowWord) {
                submittedWord.push(rowWord[i]);
            }
    
            //Analysis and compare input with word
            for (let i = 0; i <= wordDetails.wordLength-1; i++) {
                let inputFieldId = 'input_'+tryNo+'_'+i;
                let inputField = document.getElementById(inputFieldId);
                if (wordDetails.wordSplit[i] === submittedWord[i]) {
                    inputField.style.backgroundColor = 'green';
                    usedLetters[submittedWord[i]] = 'green';
                } else if (wordDetails.wordSplit[i] !== submittedWord[i] && wordDetails.wordSplit.includes(submittedWord[i])) {
                    inputField.style.backgroundColor = 'orange';
                    usedLetters[submittedWord[i]] = 'orange';
                } else {
                    inputField.style.backgroundColor = 'gray';
                    usedLetters[submittedWord[i]] = 'gray';
                }
            }
    
            setSubmittedLetters({...submittedLetters, [formId]:usedLetters});
    
            // Once game has been won, the values of the used letters are obtained and 
            let usedLettersValues = Object.values(usedLetters);
            const gameWon = (value) => value === 'green';
            // If all values of the usedLetters object are green the handleGameOver function is executed
            if(usedLettersValues.every(gameWon)) {
                handleGameOver(wordDetails);
                setShowConfetti(true);
            }

            if (wordDetails.defaultTries === (parseInt(tryNo)+1) && !usedLettersValues.every(gameWon)) {
                handleGameOver(wordDetails);
                setShowRain(true);
                // Game lost 
            } 
    
            // Increment number of tries by one
            setTries(tries+1)
        
    }

    // handleGameOver - Function (wordDetails) - 
    const handleGameOver = (wordDetails) => {
        for (let i = 0; i<=wordDetails.defaultTries-1; i++) {
            let form = document.getElementById('form_'+(i));
            for (const inputField of form.children) {
                inputField.setAttribute('disabled','');
            }
        }
        setGameOver(true);
        setShowQuit(true);
    }

    const handleKeyDown = (event) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            handleRowSubmit(event);
        }
    }

 // ----------------------------------------------------------------------------------------------------------------------------------------   
    // Creating the game form grid (inputGrid)
    const generateInputGrid = () => {
        const inputGrid = [];
        for(let i = 0; i <= wordDetails.defaultTries-1; i++) {
        const inputRow = [];
        for(let n = 0; n<=wordDetails.wordLength-1; n++) {
            if (i===0) {
                inputRow.push(<input key={'input_'+i+'_'+n} id={'input_'+i+'_'+n} className='game-input' type='text' name={'input_'+i+'_'+n} value={rowWord['input_'+i+'_'+n]} onChange={handleInput} onKeyDown={handleKeyDown} />);
            } else {
                inputRow.push(<input key={'input_'+i+'_'+n} id={'input_'+i+'_'+n} className='game-input' type='text' name={'input_'+i+'_'+n} value={rowWord['input_'+i+'_'+n]} onChange={handleInput} onKeyDown={handleKeyDown} disabled />);
            }
        }
        inputGrid.push(<form autoComplete='off' key={'form_'+i} id={'form_'+i} onSubmit={handleRowSubmit} className='row-form'>{inputRow}<input hidden key={'form_submit_'+i} type='submit'/></form>);
    }
        return inputGrid;
    }

    const generateGrid = () => {
        const inputGrid = [];
        for(let tries=1; tries <= wordDetails.defaultTries; tries++) {
            const inputRow = [];
            for(let letter=1; letter<=wordDetails.wordLength; letter++) {
                inputRow.push(<div className='game-input'>{rowWord[`input_${tries}_${letter}`]}</div>)
            }
            inputGrid.push(<div className='row-form'>{inputRow}</div>);
        }
        return inputGrid;
    }

// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
    return (
        <>
        { showConfetti && 
            <div className='confetti-animation'>
                <ConfettiExplosion 
                            force={0.8}
                            duration={3000}
                            particleCount={250}
                    />
            </div>
        }
        
        {
            showRain &&  <RainAnimation raindropNum={300} />
        }
        {     
            popupDetails.display ?   
                <PopUp message={popupDetails.message} timeout={popupDetails.timeout} />
                : 
                null
        }        
<main className='game-container'>             
        {/* Header */}
        <header className='header-row'> 
            <div className='left-header'>
                <Link id='quit-btn' className={`standard-btn header-btn ${(showQuit) ? 'hidden' : null}`} to='/'>HOME</Link>
            </div>
            <div className='center-header'>
                <h1 className='title'>INFINITE WORDLE</h1>
            </div>
            <div className='right-header'>
                <Link id='quit-btn' className={`standard-btn header-btn ${(showQuit) ? 'hidden' : null}`} to='/settings'>Settings</Link>
            </div>
        </header>  
    
        {/* Input Grid */}
        <section className='game-grid-container'>
            {/* { generateInputGrid() } */}
           {
            <GameGrid wordLength={wordDetails.wordLength} totalTries={wordDetails.defaultTries} rowWord={rowWord} />
           }
        </section>

        {/* <section>   */}
        { gameOver ? <GameOver tries={tries} word={wordDetails.wordString} /> : <LetterGrid submittedLetters={submittedLetters}  />}
        {/* </section> */}
        </main>
        </>
    )
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - GameGrid
// ----------------------------------------------------------------------------------------------------------------------------------------

const GameGrid = ({ wordLength, totalTries, rowWord }) => {

    const handleKeyDown = (event) => {
        console.log(event.key)
    }

    const inputGrid = [];
    for(let tries=1; tries <= totalTries; tries++) {
        const inputRow = [];
        for(let letter=1; letter<=wordLength; letter++) {
            inputRow.push(<div className='game-input' onKeyDown={handleKeyDown}>{rowWord[`input_${tries}_${letter}`]}</div>)
        }
        inputGrid.push(<div className='row-form'>{inputRow}</div>);
    }
    return inputGrid;

}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - GameOver
// ----------------------------------------------------------------------------------------------------------------------------------------
const GameOver = ({ word, tries }) => {
    
    return (
        <div className='gameover-container'>
            {/* <h1 className='title'>{props.gameStatus}</h1> */}
            <h1 className='title'>Game Over</h1>
            <p><strong>WORD:</strong> { word.toUpperCase() } </p>
            <p><strong>TRIES:</strong> { tries } </p>
            <div className='btns-row'>
                <Link className='standard-btn gameover-btn' to='/'>HOME</Link>
                <Link className='standard-btn gameover-btn' to='/settings'>SETTINGS</Link>
            </div>
        </div>
    );
}



export default GamePage;