import { Link } from "react-router-dom";
import './index.css';
import RainAnimation from '../../Components/Gamepage/RainAnimation'

const NotFound404 = () => {
    return (
        <>
        <RainAnimation raindropNum={300} />
        <div className='container'>
                <h1 className='title'>404 Page Not Found</h1>
                <Link className='standard-btn' to='/'>HOME</Link>
        </div>
        </>
    );
}

export default NotFound404;