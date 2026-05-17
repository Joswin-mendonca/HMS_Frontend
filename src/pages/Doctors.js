import { useEffect, useState } from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function Doctors() {

    const [doctors, setDoctors] =
        useState([]);

    const navigate =
        useNavigate();

    const role =
        localStorage.getItem('role');

    // =========================================
    // FETCH DOCTORS
    // =========================================

    useEffect(() => {

        fetchDoctors();

    }, []);

    const fetchDoctors = async () => {

        try {

            const token =
                localStorage.getItem('token');

            const response =
                await API.get(
                    '/doctors',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setDoctors(
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    // =========================================
    // DELETE DOCTOR
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                'Delete doctor?'
            );

        if (!confirmDelete) return;

        try {

            const token =
                localStorage.getItem('token');

            await API.delete(
                `/doctors/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Doctor deleted successfully'
            );

            fetchDoctors();

        } catch (error) {

            console.log(
                error.response?.data || error
            );

            alert(
                error.response?.data ||
                'Failed to delete doctor'
            );
        }
    };

    return (

        <div className='container mt-5'>

            {/* HEADER */}

            <div className='d-flex justify-content-between align-items-center mb-4'>

                <h2 className='fw-bold'>
                    Doctors
                </h2>

                {/* ADMIN ONLY */}

                {role === 'Admin' && (

                    <button
                        className='btn btn-primary'
                        onClick={() =>
                            navigate('/add-doctor')
                        }
                    >
                        Add Doctor
                    </button>
                )}

            </div>

            {/* TABLE */}

            <table className='table table-bordered table-hover shadow'>

                <thead className='table-dark'>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Specialization</th>

                        <th>Timing</th>

                        {/* ADMIN ONLY */}
                        {role === 'Admin' && (
                            <th>Actions</th>
                        )}

                    </tr>

                </thead>

                <tbody>

                    {doctors.length === 0 ? (

                        <tr>

                            <td
                                colSpan='5'
                                className='text-center'
                            >
                                No doctors found
                            </td>

                        </tr>

                    ) : (

                        doctors.map((doctor) => (

                            <tr key={doctor.id}>

                                <td>
                                    {doctor.id}
                                </td>

                                <td>
                                    {doctor.name}
                                </td>

                                <td>
                                    {doctor.specialization}
                                </td>

                                <td>

                                    {doctor.startTime}
                                    {' - '}
                                    {doctor.endTime}

                                </td>

                                {/* DELETE BUTTON */}

                                {role === 'Admin' && (

                                    <td>

                                        <button
                                            className='btn btn-danger btn-sm'
                                            onClick={() =>
                                                handleDelete(
                                                    doctor.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>
                                )}

                            </tr>
                        ))
                    )}

                </tbody>

            </table>

            {/* BACK BUTTON */}

            <button
                className='btn btn-secondary mt-3'
                onClick={() =>
                    navigate('/dashboard')
                }
            >
                Back
            </button>

        </div>
    );
}

export default Doctors;