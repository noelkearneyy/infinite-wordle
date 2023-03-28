import { useEffect, useState } from 'react';
import './index.css';

const LetterGrid = ({submittedLetters}) => {
    const [alphabet, setAlphabet] = useState([]);
    const [listSubmittedLetters, setListSubmittedLetters] = useState({});

    useEffect(()=>{
        let alphabet = 'qwertyuiopasdfghjklzxcvbnm';
        alphabet = alphabet.toUpperCase().split('');
        setAlphabet(alphabet);

        setListSubmittedLetters(submittedLetters);
        
    },[submittedLetters]);

    const handleClick = (event) => {
        const letter = event.target.id.split('_')[1];
        console.log(letter);
    }

    const letterElements = [];
    for(let i=0; i<=alphabet.length-1; i++) {
        letterElements.push(<div key={'letter_'+alphabet[i]} id={'letter_'+alphabet[i]} className='alphabet' onClick={handleClick}>{alphabet[i]}</div>);
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

        <div className='letter-grid-btn'>
            <p>Enter</p>
            <i class="fa-solid fa-arrow-turn-down" style={{transform: 'rotate(90deg)'}}></i>
        </div>
       
        <div className='letter-grid'>
                {letterElements}
        </div>

        <div className='letter-grid-btn'><i class="fa-solid fa-delete-left"></i></div>
        
        </div>
        
    );
}

export default LetterGrid;