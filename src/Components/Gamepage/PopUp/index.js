import './index.css';

const PopUp = ({ message, timeout }) => {
    return (
        <div className='pop-up-container'>
                <div className='pop-up-box'>
                    <p className='pop-up-message'>
                        {
                            message
                        }
                    </p>
                </div>
        </div>
    )
}

export default PopUp;