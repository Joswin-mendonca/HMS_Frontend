import {
    useEffect,
    useState,
    useCallback
} from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function Appointments() {

    const [appointments, setAppointments] =
        useState([]);

    const navigate =
        useNavigate();

    const role =
        localStorage.getItem('role');

    // =========================================
    // FETCH APPOINTMENTS
    // =========================================

    const fetchAppointments = useCallback(
        async () => {

            try {

                const token =
                    localStorage.getItem('token');

                let endpoint =
                    '/appointments';

                if (role === 'Patient') {

                    endpoint =
                        '/appointments/my';
                }

                const response =
                    await API.get(
                        endpoint,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setAppointments(
                    response.data
                );

            } catch (error) {

                console.log(error);
            }

        },
        [role]
    );

    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchAppointments();

    }, [fetchAppointments]);

    // =========================================
    // COMPLETE APPOINTMENT
    // =========================================

    const handleReview = async (
        appointmentId
    ) => {

        try {

            const token =
                localStorage.getItem('token');

            await API.put(
                `/appointments/status?appointmentId=${appointmentId}&status=Completed`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Appointment marked as completed'
            );

            fetchAppointments();

        } catch (error) {

            console.log(error);

            alert(
                'Failed to update appointment'
            );
        }
    };

    // =========================================
    // DELETE APPOINTMENT
    // =========================================

    const handleDelete = async (
        appointmentId
    ) => {

        const confirmDelete =
            window.confirm(
                'Delete appointment?'
            );

        if (!confirmDelete) return;

        try {

            const token =
                localStorage.getItem('token');

            await API.delete(
                `/appointments/${appointmentId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Appointment deleted'
            );

            fetchAppointments();

        } catch (error) {

            console.log(error);

            alert(
                'Delete failed'
            );
        }
    };

    return (

        <div className='container mt-5'>

            {/* HEADER */}

            <div className='d-flex justify-content-between align-items-center mb-4'>

                <h2>
                    Appointments
                </h2>

                {(role === 'Admin' ||
                    role === 'Patient') && (

                        <button
                            className='btn btn-primary'
                            onClick={() =>
                                navigate('/add-appointment')
                            }
                        >
                            Add Appointment
                        </button>
                    )}

            </div>

            {/* TABLE */}

            <table className='table table-bordered table-hover shadow'>

                <thead className='table-dark'>

                    <tr>

                        <th>ID</th>

                        <th>Patient</th>

                        <th>Doctor</th>

                        <th>Date & Time</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {appointments.length === 0 ? (

                        <tr>

                            <td
                                colSpan='6'
                                className='text-center'
                            >
                                No appointments found
                            </td>

                        </tr>

                    ) : (

                        appointments.map(a => (

                            <tr key={a.appointmentId}>

                                <td>
                                    {a.appointmentId}
                                </td>

                                <td>
                                    {a.patient?.name}
                                </td>

                                <td>
                                    {a.doctor?.name}
                                </td>

                                <td>

                                    {
                                        new Date(
                                            a.dateTime + 'Z'
                                        ).toLocaleString(
                                            'en-IN',
                                            {
                                                timeZone:
                                                    'Asia/Kolkata',
                                                day: 'numeric',
                                                month: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            }
                                        )
                                    }

                                </td>

                                <td>

                                    <span
                                        className={`badge ${a.status === 'Completed'
                                            ? 'bg-success'
                                            : 'bg-primary'
                                            }`}
                                    >

                                        {a.status}

                                    </span>

                                </td>

                                <td>

                                    <div className='d-flex gap-2'>

                                        {role === 'Doctor' &&
                                            a.status !== 'Completed' && (

                                                <button
                                                    className='btn btn-success btn-sm'
                                                    onClick={() =>
                                                        handleReview(
                                                            a.appointmentId
                                                        )
                                                    }
                                                >
                                                    Complete
                                                </button>
                                            )}

                                        {(role === 'Admin' ||
                                            role === 'Patient') && (

                                                <button
                                                    className='btn btn-danger btn-sm'
                                                    onClick={() =>
                                                        handleDelete(
                                                            a.appointmentId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}

                                    </div>

                                </td>

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

export default Appointments;