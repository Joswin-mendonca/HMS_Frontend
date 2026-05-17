import { useState } from 'react';
import API from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function AddPatient() {

    const navigate = useNavigate();

    const [patient, setPatient] = useState({
        name: '',
        age: '',
        gender: '',
        contact: ''
    });

    const handleChange = (e) => {

        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem('token');

            await API.post(
                '/patient',
                patient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Patient Added');

            navigate('/patients');

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className='container mt-5'>

            <h2>Add Patient</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type='text'
                    name='name'
                    placeholder='Name'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                />

                <input
                    type='number'
                    name='age'
                    placeholder='Age'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                />

                <select
                    name='gender'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                >
                    <option value=''>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>

                <input
                    type='text'
                    name='contact'
                    placeholder='Contact'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                />

                <button className='btn btn-success'>
                    Save Patient
                </button>

            </form>

        </div>
    );
}

export default AddPatient;
