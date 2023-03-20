import './index.css';
import { useState, useEffect } from 'react';

const RainAnimation = ({ raindropNum }) => {
    const [raindrops, setRaindrops] = useState([]);
    
    useEffect(() => {
        let raindropsArray = [];
        for(let drop = 0; drop < raindropNum; drop++) {
            const left = `${Math.random() * 100}%`;
            raindropsArray.push(<Raindrop key={drop} left={left}/>);
        }
        setRaindrops(raindropsArray);
    }, [raindropNum]);
    
    return (
        <div className='rain-animation-container'>
            {
                raindrops
            }
        </div>
    )
}

const Raindrop = ({ left }) => {
    return (
        <div className='raindrop' style={{ left: left, animation: `fall ${Math.random() * 5}s linear infinite`}}>
            <div className='drop'></div>
        </div>
    )
}

export default RainAnimation;