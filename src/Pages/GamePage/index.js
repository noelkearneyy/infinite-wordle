import { useEffect, useState } from 'react';
import LetterGrid from '../../Components/LetterGrid';
import './index.css';

var randomWords = require('random-words');

const Header = () => {
    return (
        <div className='header-container'>    
        <div className='header-row'> 
            <button className='standard-btn'>QUIT</button>   
            <h1 className='title'>CUSTOM WORDLE</h1>  
            </div>  
        </div>
    )
}

const GameOver = (props) => {
    return (
        <div className='gameover-container'>
            <h1 className='title'>GAME COMPLETE</h1>
            <p><strong>WORD:</strong> {props.word.toUpperCase()}</p>
            <p><strong>TRIES:</strong></p>
            <button className='standard-btn' onClick={()=>window.location.reload()}>PLAY AGAIN</button>
            <button className='standard-btn gameover-btn'>HOME</button>
        </div>
    );
}

const GamePage = (props) => {
    const [wordDetails, setWordDetails] = useState({});
    const [rowWord, setRowWord] = useState({});
    const [submittedLetters, setSubmittedLetters] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    useEffect(()=>{
        let settings = props.settings;
        let defaultTries = 6; 
        let randomWord = randomWords({exactly: 1, maxLength: 5});
        let [ randomWordString ] = randomWord;

        let wordLength = randomWordString.length;
        let wordSplit = randomWordString.toUpperCase().split('');

        let wordDetails = { 
            wordString: randomWordString,
            defaultTries: defaultTries,
            wordLength: wordLength,
            wordSplit: wordSplit,
        };

        setWordDetails(wordDetails);

        console.log(wordDetails.wordString)

    }, [])

    const handleInput = (event) => {
        const target = event.target;
        const name = target.name;
        let letter = target.value;
        
        if (letter.length <= 1) {
            setRowWord({...rowWord, [name]:letter.toUpperCase()});
        }
    }

    const handleGameOver = (wordDetails) => {

        for(let i = 0; i<=wordDetails.defaultTries-1; i++) {

            let form = document.getElementById('form_'+(i));
            for (const inputField of form.children) {
                inputField.setAttribute('disabled','');
            }
        }

        setGameOver(true);
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
 
    }

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
        inputGrid.push(<form key={'form_'+i} id={'form_'+i} onSubmit={handleRowSubmit} className='row-form'>{inputRow}<input hidden key={'form_submit_'+i} type='submit'/></form>, <br/> );
    }

    
    return (
        <div className='game-container'>
        <Header />
        <div className='game-grid'>
            {inputGrid}
        </div>
          
        { gameOver ? <GameOver word={wordDetails.wordString} /> : <LetterGrid submittedLetters={submittedLetters}  />}

        </div>
    )
}

export default GamePage;