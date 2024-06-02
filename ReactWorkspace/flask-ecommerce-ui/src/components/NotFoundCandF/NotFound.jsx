import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <h2>404 - Not Found!</h2>
            <p>The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
            <p>
                Please try the following:<Link to="/">Go Home</Link>
            </p>
        </div>
    );
}

export default NotFound;

