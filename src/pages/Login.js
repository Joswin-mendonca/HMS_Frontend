import { useState, useEffect } from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    // =========================================
    // CLEAR FORM ON LOAD
    // =========================================

    useEffect(() => {

        setLoginData({
            username: '',
            password: ''
        });

        // CLEAR BROWSER AUTOFILL

        const inputs =
            document.querySelectorAll('input');

        inputs.forEach(input => {

            input.value = '';
        });

    }, []);

    // =========================================
    // HANDLE CHANGE
    // =========================================

    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    // =========================================
    // LOGIN
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await API.post(
                    '/auth/login',
                    loginData
                );

            // STORE TOKEN

            localStorage.setItem(
                'token',
                response.data.token
            );

            localStorage.setItem(
                'role',
                response.data.role
            );

            localStorage.setItem(
                'username',
                response.data.username
            );

            localStorage.setItem(
                'userId',
                response.data.userId
            );

            alert('Login Success');

            navigate('/dashboard');

        } catch (error) {

            console.log(error);

            alert('Invalid Login');
        }
    };

    return (

        <div className='container mt-5'>

            <div className='row justify-content-center'>

                <div className='col-md-5'>

                    <div className='card p-4 shadow'>

                        <h1 className='text-center mb-4'>
                            Login
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            autoComplete='off'
                        >

                            {/* FAKE INPUTS TO BLOCK AUTOFILL */}

                            <input
                                type='text'
                                style={{ display: 'none' }}
                                autoComplete='off'
                            />

                            <input
                                type='password'
                                style={{ display: 'none' }}
                                autoComplete='new-password'
                            />

                            {/* USERNAME */}

                            <input
                                type='text'
                                name='username'
                                placeholder='Username'
                                className='form-control mb-4'
                                value={loginData.username}
                                onChange={handleChange}
                                autoComplete='off'
                                spellCheck='false'
                            />

                            {/* PASSWORD */}

                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                className='form-control mb-4'
                                value={loginData.password}
                                onChange={handleChange}
                                autoComplete='new-password'
                                spellCheck='false'
                            />

                            {/* LOGIN BUTTON */}

                            <button className='btn btn-primary w-100'>

                                Login

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;