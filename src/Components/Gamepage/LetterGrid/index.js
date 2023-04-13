import { useEffect, useState, useRef } from 'react';
import './index.css';

const LetterGrid = ({ lettersRef, submittedLetters, rowWord, setRowWord, tries, setTries, currentCell, setCurrentCell, rows, inputs, handleRowSubmit, changeCurrentCell }) => {
    const [alphabet, setAlphabet] = useState([]);
    const [listSubmittedLetters, setListSubmittedLetters] = useState({});

    const addToLetters = (element) => {
        if(element && !lettersRef.current.includes(element)) {
            lettersRef.current.push(element);
        }
    }

    useEffect(()=>{
        let alphabet = 'qwertyuiopasdfghjklzxcvbnm';
        alphabet = alphabet.toUpperCase().split('');
        setAlphabet(alphabet);

        setListSubmittedLetters(submittedLetters);
        
    },[submittedLetters]);

    const handleClick = (event) => {
    
        switch(event.target.id) {
            case 'ENTER': 
                handleRowSubmit();
                break;
            
            case 'DELETE':
                setRowWord((prevState) => ({...prevState, [currentCell]: ''}));
                const prevIndex = changeCurrentCell(rowWord, currentCell, tries, 'prev');
                setCurrentCell(Object.keys(rowWord)[prevIndex]);
                break;
            
            default:
                const letter = event.target.id.split('_')[1];
                setRowWord((prevState) => ({...prevState, [currentCell]: letter}));
                const nextIndex = changeCurrentCell(rowWord, currentCell, tries, 'next');
                setCurrentCell(Object.keys(rowWord)[nextIndex]);
                break;
        }
    }

    const letterElements = [];
    for(let i=0; i<=alphabet.length-1; i++) {
        letterElements.push(<div key={'letter_'+alphabet[i]} ref={addToLetters} id={'letter_'+alphabet[i]} className='alphabet' onClick={handleClick}>{alphabet[i]}</div>);
    }

    //key form and value is an object
    for (let form in listSubmittedLetters) {
        for (let letter in listSubmittedLetters[form]) {
            let alphabetElement = document.getElementById('letter_'+letter);
            alphabetElement.style.backgroundColor = listSubmittedLetters[form][letter];
        }
    }
    
    return (
        <div className='letter-grid-container'>

        <div>
            <div className='letter-grid-btn' onClick={handleClick} id="ENTER">
            <p id="ENTER">Enter</p>
            <i id="ENTER" className="fa-solid fa-arrow-turn-down" style={{transform: 'rotate(90deg)'}}></i>
            </div>
        </div>
       
        <div className='letter-grid'>
            {letterElements}
        </div>

        <div>
        <div className='letter-grid-btn' onClick={handleClick} id="DELETE">
            <p id="DELETE">Delete</p>
            <i id="DELETE" className="fa-solid fa-delete-left"></i>
        </div>
        </div>
        
        </div>
        
    );
}

export default LetterGrid;