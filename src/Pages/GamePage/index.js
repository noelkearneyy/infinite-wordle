// ----------------------------------------------------------------------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LetterGrid from '../../Components/LetterGrid';
import './index.css';
let randomWords = require('random-english-words');

// ----------------------------------------------------------------------------------------------------------------------------------------
// PARENT COMPONENT - GamePage
// ----------------------------------------------------------------------------------------------------------------------------------------
const GamePage = (props) => {

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

// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
    // useEffect hook is executed on the initial render and when the dependency array changes (props.settings)
    useEffect(()=>{
        // props.settings is set to the settings variable
        let settings = props.settings;
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

    }, [props.settings])

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
        if (letter.length === 1 && (validateString(letter) || letter === '')) {
            // setRowWord function updates the rowWord State Object with the input name key and the capitalised letter value
            setRowWord(sortObject({...rowWord, [name]:letter.toUpperCase()}));  
        } 
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
        } else if (wordDetails.defaultTries === (parseInt(tryNo)+1)) {
            handleGameOver(wordDetails);
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
            }
    
            // Increment number of tries by one
            setTries(tries+1)
        
    }

    // handleGameOver - Function (wordDetails) - 
    const handleGameOver = (wordDetails) => {
        for(let i = 0; i<=wordDetails.defaultTries-1; i++) {
            let form = document.getElementById('form_'+(i));
            for (const inputField of form.children) {
                inputField.setAttribute('disabled','');
            }
        }
        setGameOver(true);
        setShowQuit(true)
    }

 // ----------------------------------------------------------------------------------------------------------------------------------------   
    // Creating the game form grid (inputGrid)
    const inputGrid = []
    for(let i = 0; i <= wordDetails.defaultTries-1; i++) {
        const inputRow = [];
        for(let n = 0; n<=wordDetails.wordLength-1; n++) {
            if (i===0) {
                inputRow.push(<input key={'input_'+i+'_'+n} id={'input_'+i+'_'+n} className='game-input' type='text' name={'input_'+i+'_'+n} value={rowWord['input_'+i+'_'+n]} onChange={handleInput} />);
            } else {
                inputRow.push(<input key={'input_'+i+'_'+n} id={'input_'+i+'_'+n} className='game-input' type='text' name={'input_'+i+'_'+n} value={rowWord['input_'+i+'_'+n]} onChange={handleInput} disabled />);
            }
        }
        inputGrid.push(<form autoComplete='off' key={'form_'+i} id={'form_'+i} onSubmit={handleRowSubmit} className='row-form'>{inputRow}<input hidden key={'form_submit_'+i} type='submit'/></form>, <br/> );
    }

// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className='game-container'>
        <Header showQuit={showQuit} />
        <div className='game-grid'>
            {inputGrid}
        </div>
          
        { gameOver ? <GameOver tries={tries} word={wordDetails.wordString} /> : <LetterGrid submittedLetters={submittedLetters}  />}

        </div>
    )
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - Header
// ----------------------------------------------------------------------------------------------------------------------------------------
const Header = (props) => {

    useEffect(()=>{
        if(props.showQuit) {
            document.getElementById('quit-btn').style.visibility = 'hidden';
        }
    },[props.showQuit])
    
    return (
        <div className='header-row'> 
        <Link id='quit-btn' className='standard-btn header-btn' to='/'>QUIT</Link>
            <h1 className='title  header-title'>CUSTOM WORDLE</h1>  
        </div>  
    );
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - GameOver
// ----------------------------------------------------------------------------------------------------------------------------------------
const GameOver = (props) => {
    
    return (
        <div className='gameover-container'>
            <h1 className='title'>GAME COMPLETE</h1>
            <p><strong>WORD:</strong> { props.word.toUpperCase() } </p>
            <p><strong>TRIES:</strong> { props.tries } </p>
            <div className='btns-row'>
                <Link className='standard-btn gameover-btn' to='/'>HOME</Link>
            </div>
        </div>
    );
}

export default GamePage;