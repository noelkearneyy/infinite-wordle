import { useEffect, useState } from 'react';
import './index.css';

const LetterGrid = ({submittedLetters}) => {
    const [alphabet, setAlphabet] = useState([]);
    const [listSubmittedLetters, setListSubmittedLetters] = useState({});

    useEffect(()=>{
        let alphabet = 'abcdefghijklmnopqrstuvwxyz';
        alphabet = alphabet.toUpperCase().split('');
        setAlphabet(alphabet);

        setListSubmittedLetters(submittedLetters);
        
    },[submittedLetters])

    const letterElements = [];
    for(let i=0; i<=alphabet.length-1; i++) {
        letterElements.push(<div key={'letter_'+alphabet[i]} id={'letter_'+alphabet[i]} className='alphabet'>{alphabet[i]}</div>);
    }

    //key form and value is an object
    for (let form in listSubmittedLetters) {
        for (let letter in listSubmittedLetters[form]) {
            let alphabetElement = document.getElementById('letter_'+letter);
            alphabetElement.style.backgroundColor = listSubmittedLetters[form][letter];
        }
    }
    
    return (
        <div className='letter-grid'>
            {letterElements}
        </div>
    );
}

export default LetterGrid;