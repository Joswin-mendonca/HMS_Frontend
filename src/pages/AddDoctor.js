import { useState } from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function AddDoctor() {

    const navigate =
        useNavigate();

    const [doctor, setDoctor] =
        useState({
            name: '',
            specialization: '',
            startTime: '',
            endTime: ''
        });

    // =========================================
    // HANDLE CHANGE
    // =========================================

    const handleChange = (e) => {

        setDoctor({
            ...doctor,
            [e.target.name]: e.target.value
        });
    };

    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem('token');

            // FIX TIME FORMAT
            const doctorData = {

                ...doctor,

                startTime:
                    doctor.startTime + ':00',

                endTime:
                    doctor.endTime + ':00'
            };

            console.log(doctorData);

            await API.post(
                '/doctors',
                doctorData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Doctor Added Successfully'
            );

            navigate('/doctors');

        } catch (error) {

            console.log(
                error.response?.data || error
            );

            alert(

                error.response?.data?.title ||

                error.response?.data?.message ||

                JSON.stringify(
                    error.response?.data
                ) ||

                'Failed to add doctor'
            );
        }
    };

    return (

        <div className='container mt-5'>

            {/* TITLE */}

            <h1 className='mb-4 fw-bold'>
                Add Doctor
            </h1>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

                {/* NAME */}

                <label className='mb-1'>
                    Doctor Name
                </label>

                <input
                    type='text'
                    name='name'
                    placeholder='Enter doctor name'
                    className='form-control mb-3'
                    value={doctor.name}
                    onChange={handleChange}
                    required
                />

                {/* SPECIALIZATION */}

                <label className='mb-1'>
                    Specialization
                </label>

                <input
                    type='text'
                    name='specialization'
                    placeholder='Enter specialization'
                    className='form-control mb-3'
                    value={doctor.specialization}
                    onChange={handleChange}
                    required
                />

                {/* START TIME */}

                <label className='mb-1'>
                    Start Time
                </label>

                <input
                    type='time'
                    name='startTime'
                    className='form-control mb-3'
                    value={doctor.startTime}
                    onChange={handleChange}
                    required
                />

                {/* END TIME */}

                <label className='mb-1'>
                    End Time
                </label>

                <input
                    type='time'
                    name='endTime'
                    className='form-control mb-4'
                    value={doctor.endTime}
                    onChange={handleChange}
                    required
                />

                {/* BUTTONS */}

                <div className='d-flex gap-3'>

                    <button
                        type='submit'
                        className='btn btn-success'
                    >
                        Save Doctor
                    </button>

                    <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() =>
                            navigate('/doctors')
                        }
                    >
                        Back
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AddDoctor;