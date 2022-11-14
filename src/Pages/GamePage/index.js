import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LetterGrid from '../../Components/LetterGrid';
import './index.css';

// var randomWords = require('random-words');
let randomWords = require('random-english-words');

const Header = (props) => {
    useEffect(()=>{
        if(props.showQuit) {
            document.getElementById('quit-btn').style.visibility = 'hidden'
        }
    },[props.showQuit])
    return (
        <div className='header-row'> 
        <Link id='quit-btn' className='standard-btn header-btn' to='/'>QUIT</Link>
            <h1 className='title  header-title'>CUSTOM WORDLE</h1>  
        </div>  
    );
}

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

const GamePage = (props) => {
    const [wordDetails, setWordDetails] = useState({});
    const [rowWord, setRowWord] = useState({});
    const [submittedLetters, setSubmittedLetters] = useState([]);
    const [tries, setTries] = useState(0)
    const [gameOver, setGameOver] = useState(false);

    useEffect(()=>{
        let settings = props.settings;
        let defaultTries = Number(settings.tries);
        let randomWordString = randomWords({minCount: 1, minChars: Number(settings.wordLength), maxChars: Number(settings.wordLength)})

        let wordLength = randomWordString.length;
        let wordSplit = randomWordString.toUpperCase().split('');

        //Main object with word and game info
        let wordDetails = { 
            wordString: randomWordString,
            defaultTries: defaultTries,
            wordLength: wordLength,
            wordSplit: wordSplit,
        };

        setWordDetails(wordDetails);

    }, [props.settings])

    const validateString = (str) => {
        return /^[A-Za-z]/.test(str)
    }

    const handleInput = (event) => {
        const target = event.target;
        const name = target.name;
        let letter = target.value;
        
        // Validate letter length is 1, only contains alpha characters & allows character to be deleted (allows null)
        if (letter.length <= 1 && (validateString(letter) || letter === '')) {
            setRowWord(sortObject({...rowWord, [name]:letter.toUpperCase()}));  
        } 
    }
    // Ensures word is compared correctly if it has been inputted in an irregaular way
    const sortObject = (obj) => {
        return Object.keys(obj).sort().reduce((res, key) => {
            res[key] = obj[key];
            return res;
        }, {})
    }

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

    const handleRowSubmit = (event) => {
        event.preventDefault()

        let formId = event.target.id;
        let tryNo = formId.split('_')[1];
        let submittedWord = [];
        let usedLetters = {};

        console.log(wordDetails.defaultTries, parseInt(tryNo))

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

        // Once game has been won
        let usedLettersValues = Object.values(usedLetters);
        const gameWon = (value) => value === 'green';
        if(usedLettersValues.every(gameWon)) {
            handleGameOver(wordDetails);
        }

        //Set number of tries
        setTries(tries+1)
    }

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

    const [showQuit, setShowQuit] = useState(false);
    
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

export default GamePage;