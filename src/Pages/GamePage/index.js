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
var randomWords = require('random-words');

// var randomWords = require('an-array-of-english-words');

// ----------------------------------------------------------------------------------------------------------------------------------------
// PARENT COMPONENT - GamePage
// ----------------------------------------------------------------------------------------------------------------------------------------
const GamePage = ({ settings, setSettings }) => {

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
    const [tries, setTries] = useState(1);
    
    const [currentCell, setCurrentCell] = useState('');
    // gameOver State Boolean defines when the gameOver component is shown and hides the letter grid
    const [gameOver, setGameOver] = useState(false);
    // showConfetti State Boolean defines when the ConfettiExplosion component is displayed - when the user has won the game
    const [showConfetti, setShowConfetti] = useState(false);
    // showRain State Boolean defines when the RainAnimation component is displayed - when the user has lost the game
    const [showRain, setShowRain] = useState(false);

    const [popupDetails, setPopupDetails] = useState({
        message: 'Enter a valid word', 
        display: false,
    });

    const timer = useRef(null);
    const rows = useRef([]);
    const inputs = useRef([]);
    const lettersRef = useRef([]);
    const container = useRef(null);

// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
    const getRandomWord = (wordLength) => {
        // const filteredWords = randomWords.filter((word)=> new RegExp(`^.{${wordLength}}$`).test(word));
        // const randomIndex = Math.floor(Math.random() * filteredWords.length);
        // return filteredWords[randomIndex];

        let randomWord = randomWords({exactly: 1, maxLength: wordLength})
        while(randomWord[0].length < wordLength) {
            randomWord = randomWords({exactly: 1, maxLength: wordLength})
        }
        return randomWord[0];
    }

    // useEffect hook is executed on the initial render and when the dependency array changes (props.settings)
    useEffect(()=>{
        // settings.tries is converted to an Integer and set to the defaultTries variable
        let defaultTries = Number(settings.tries);
        // the random-english-words package is used to obtain a random english word. The minChars and maxChars keys are set to the wordLength in the settings object
        const randomWordString = getRandomWord(Number(settings.wordLength));
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

        setRowWord(rowDetails);
        setCurrentCell(Object.keys(rowDetails)[0]);

    }, [settings]);

    const handleKeyUp = (event) => {
        if(validateString(event.key) && event.key.length === 1) {
            setRowWord((prevState) => ({...prevState, [currentCell]: event.key.toUpperCase()}));
            const nextIndex = changeCurrentCell(rowWord, currentCell, tries, 'next');
            setCurrentCell(Object.keys(rowWord)[nextIndex]);
        } else if (event.key === 'Enter') {
            handleRowSubmit();
        } else if (event.key === 'Backspace') {
            setRowWord((prevState) => ({...prevState, [currentCell]: ''}));
            const prevIndex = changeCurrentCell(rowWord, currentCell, tries, 'prev');
            setCurrentCell(Object.keys(rowWord)[prevIndex]);
        }
    }

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

    const spellcheckEntry = (rowWord) => {
        const wordStr = (Object.values(rowWord).join('')).toLowerCase();
        return ALL_WORDS.includes(wordStr);
    }

    const changeCurrentCell = (obj, currentCell, tries, direction='next') => {
        const keys = Object.keys(obj);
        let currentIndex = keys.indexOf(currentCell);

        if(direction === 'next') {
            if(currentIndex+1 <= keys.length-1) {
                if(Number(keys[currentIndex+1].split('_')[1]) === tries) {
                    currentIndex = currentIndex + 1;
                }
            }
        } else if(direction === 'prev') {
            if(currentIndex-1 >= 0) {
                if(Number(keys[currentIndex-1].split('_')[1]) === tries)  {
                    currentIndex = currentIndex - 1;
                }
            }
        }
        return currentIndex;
    }


    const handleRowSubmit = () => {
        // Store the submitted word based on the current value of tries variable in the submittedWord object
        let submittedWord = {}
        for(const input in rowWord) {
            const rowNumber = input.split('_')[1];
            if(tries === Number(rowNumber)) {
               submittedWord = {...submittedWord, [input]: rowWord[input]}
                } 
            }
        
        // Validate for incomplete inputs][]
        if(Object.values(submittedWord).includes('')) {
            setPopupDetails((prevState) => ({...prevState, message: 'Complete all fields', display: true}));
            clearTimeout(timer.current);
            return timer.current = setTimeout(() => {
                setPopupDetails((prevState) => ({...prevState, message: '', display: false}));
            }, 1500);
        }

        let submittedWordColors = [];
        for(let i = 0; i <= wordDetails.wordLength-1; i++) {
            const submittedWordValues = Object.values(submittedWord);
            const submittedWordKeys = Object.keys(submittedWord);
            let color = '';
            if (wordDetails.wordSplit[i] === submittedWordValues[i]) {
                color = 'green';
            } else if (wordDetails.wordSplit[i] !== submittedWord[i] && wordDetails.wordSplit.includes(submittedWordValues[i])) {
                color = 'orange';
            } else {
                color = 'gray';
            }

            for(const input of inputs.current) {
                if(input.id === submittedWordKeys[i]) {
                        input.style.animation = 'rotateY 2s linear';
                        input.children[0].style.animation = 'rotateY 2s linear';

                    setTimeout(() => {
                        input.style.backgroundColor = color;
                        input.style.border = '2px solid #2F4550';
                    }, 1000)
                }
            } 

            for(const letterElement of lettersRef.current) {
                const letter = letterElement.id.split('_')[1];
                if(letter === submittedWordValues[i]) {
                    letterElement.style.backgroundColor = color;
                }
            }
            submittedWordColors.push(color);
        }

        // check if all inputs are correct then the game is won
        if(submittedWordColors.every((letter) => letter === 'green')) {
            setGameOver(true);
            return setShowConfetti(true);
        }


        // check if last try and if all inputs are not correct game is lost
        if(tries === wordDetails.defaultTries && !(submittedWordColors.every((letter) => letter === 'green'))) {
            setGameOver(true);
            return setShowRain(true);
        }


        if(tries+1 <= wordDetails.defaultTries ) {
            setTimeout(()=>{
                setTries((prevState) => (prevState+1))
                const nextIndex = changeCurrentCell(rowWord, currentCell, tries+1, 'next');
                const nextInput = Object.keys(rowWord)[nextIndex];
                setCurrentCell(nextInput);
            }, 2000);

        } else {
            setGameOver(true);
        }
    
        }
    

// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className='game-page-container' tabIndex={0} ref={container} onKeyUp={handleKeyUp}>
        { 
        showConfetti && 
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
        <header className='header-row'> 
        {
            (!gameOver) && 
            <div className='left-header'>
                <Link id='quit-btn' className='standard-btn header-btn' to='/'>HOME</Link>
            </div>
        }
            
            <div className='center-header'>
                <h1 className='title'>INFINITE WORDLE</h1>
            </div>
            {
                (!gameOver) &&
                <div className='right-header'>
                    <Link id='quit-btn' className='standard-btn header-btn' to='/settings'>Settings</Link>
                </div>
            }
           
        </header>

    <main className='game-container'>             
        <section className='game-grid-container'>
           {
            <GameGrid wordLength={wordDetails.wordLength} totalTries={wordDetails.defaultTries} currentTries={tries} rowWord={rowWord} currentCell={currentCell} rows={rows} inputs={inputs} gameOver={gameOver} />
           }
        </section>

        <section className='footer-container'>  
        { gameOver ? <GameOver tries={tries} word={wordDetails.wordString} totalTries={wordDetails.defaultTries} setSettings={setSettings} setGameOver={setGameOver} /> : <LetterGrid lettersRef={lettersRef} submittedLetters={submittedLetters} rowWord={rowWord} setRowWord={setRowWord} tries={tries} setTries={setTries} currentCell={currentCell} setCurrentCell={setCurrentCell} rows={rows} inputs={inputs} handleRowSubmit={handleRowSubmit} changeCurrentCell={changeCurrentCell}/>}
        </section>
    </main>
        </div>
    )
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - GameGrid
// ----------------------------------------------------------------------------------------------------------------------------------------

const GameGrid = ({ wordLength, totalTries, currentTries, rowWord, currentCell, rows, inputs, gameOver }) => {

    const addToInputs = (element) => {
        if(element && !inputs.current.includes(element)) {
            inputs.current.push(element);
        }
    }

    const addToRows = (element) => {
        if(element && !rows.current.includes(element)) {
            rows.current.push(element);
        }
    }

    const inputGrid = [];
    for(let tries=1; tries <= totalTries; tries++) {
        const inputRow = [];
        for(let letter=1; letter<=wordLength; letter++) {
            inputRow.push(<div ref={addToInputs} id={`input_${tries}_${letter}`} className={`game-input ${(currentTries === tries || gameOver === true) ? '' : 'disabled'} ${(currentCell === `input_${tries}_${letter}`) ? 'activeCell' : ''}`}><p>{rowWord[`input_${tries}_${letter}`]}</p></div>)
        }
        inputGrid.push(<div ref={addToRows} className='row-form'>{inputRow}</div>);
    }
    return inputGrid;

}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - GameOver
// ----------------------------------------------------------------------------------------------------------------------------------------
const GameOver = ({ word, tries, totalTries, setSettings, setGameOver }) => {
    return (
        <div className='gameover-container'>
            {/* <h1 className='title'>{props.gameStatus}</h1> */}
                <h1 className='title'>Game Over</h1>
                <p><strong>WORD:</strong> { word.toUpperCase() } </p>
                <p><strong>TRIES:</strong> {`${tries}/${totalTries}`} </p>
            
            <div className='btns-row'>
                <Link className='standard-btn gameover-btn' to='/'>HOME</Link>
                <Link className='standard-btn' to='/settings'>SETTINGS</Link>
            </div>
        </div>
    );
}



export default GamePage;