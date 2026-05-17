import { Link, useNavigate } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    const username =
        localStorage.getItem('username');

    const role =
        localStorage.getItem('role');

    const handleLogout = () => {

        localStorage.clear();

        navigate('/');
    };

    return (

        <nav className='navbar navbar-expand-lg navbar-dark bg-dark p-3'>

            <div className='container'>

                <Link
                    className='navbar-brand fw-bold'
                    to='/dashboard'
                >
                    Hospital Management System
                </Link>

                <div className='d-flex align-items-center gap-3'>

                    <span className='text-white'>
                        Hello, {username} ({role})
                    </span>

                    <button
                        className='btn btn-danger'
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;