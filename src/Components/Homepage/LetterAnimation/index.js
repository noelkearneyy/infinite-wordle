import React, { useState, useRef } from 'react';
import './index.css';

const LetterAnimation = () => {
    const container = useRef(null);
    const timer = useRef(null);
    const [letterIndex, setLetterIndex] = useState(0); 
    const [displayLetter, setDisplayLetter] = useState(false);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [cursorPosition, setCursorPosition] = useState({
        x: '0',
        y: '0',
    });
    const [rotate, setRotate] = useState(0);
    
    const handleClick = (event) => {
        const containerRect = container.current.getBoundingClientRect();
        const clickX = event.clientX - containerRect.left;
        const clickY = event.clientY - containerRect.top;

        const rotation = Math.random().toFixed(1);
        
        setCursorPosition((prev) => ({ x: clickX, y: clickY, }));
        setRotate(rotation);
        setLetterIndex(Math.floor(Math.random() * letters.length));
        setDisplayLetter(true);
        console.log(`rotate(${cursorPosition.rotate}turn)`);
        
        clearTimeout(timer.current);

        timer.current = setTimeout(()=>{
            setDisplayLetter(false)
        }, 500);
    }

    return (
        <div ref={container} className='letter-animation-container' onClick={handleClick}>
            {
                (displayLetter) ? <span className='letter' style={{ transform: `rotate(${rotate}turn)`, left: cursorPosition.x, top: cursorPosition.y }}>{letters[letterIndex]}</span> : null
            }
        </div>
    )
}

export default LetterAnimation; 