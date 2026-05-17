import {
    useEffect,
    useState,
    useCallback
} from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function Patients() {

    const [patients, setPatients] =
        useState([]);

    const navigate =
        useNavigate();

    const role =
        localStorage.getItem('role');

    const userId =
        localStorage.getItem('userId');

    // =========================================
    // FETCH PATIENTS
    // =========================================

    const fetchPatients = useCallback(
        async () => {

            try {

                const token =
                    localStorage.getItem('token');

                const response =
                    await API.get(
                        '/patient',
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                let data =
                    response.data;

                // PATIENT -> SHOW OWN RECORD ONLY

                if (role === 'Patient') {

                    data =
                        data.filter(
                            p =>
                                p.userId ===
                                parseInt(userId)
                        );
                }

                setPatients(data);

            } catch (error) {

                console.log(error);
            }

        },
        [role, userId]
    );

    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchPatients();

    }, [fetchPatients]);

    // =========================================
    // DELETE PATIENT
    // =========================================

    const handleDelete = async (
        patientId
    ) => {

        const confirmDelete =
            window.confirm(
                'Delete patient?'
            );

        if (!confirmDelete) return;

        try {

            const token =
                localStorage.getItem('token');

            await API.delete(
                `/patient/${patientId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Patient deleted'
            );

            fetchPatients();

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
                    Patients
                </h2>

                {(role === 'Admin' ||
                    role === 'Patient') && (

                        <button
                            className='btn btn-primary'
                            onClick={() =>
                                navigate('/add-patient')
                            }
                        >
                            Add Patient
                        </button>
                    )}

            </div>

            {/* TABLE */}

            <table className='table table-bordered table-hover shadow'>

                <thead className='table-dark'>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Age</th>

                        <th>Gender</th>

                        <th>Contact</th>

                        {role === 'Admin' && (
                            <th>Actions</th>
                        )}

                    </tr>

                </thead>

                <tbody>

                    {patients.length === 0 ? (

                        <tr>

                            <td
                                colSpan='6'
                                className='text-center'
                            >
                                No patients found
                            </td>

                        </tr>

                    ) : (

                        patients.map(patient => (

                            <tr key={patient.id}>

                                <td>
                                    {patient.id}
                                </td>

                                <td>
                                    {patient.name}
                                </td>

                                <td>
                                    {patient.age}
                                </td>

                                <td>
                                    {patient.gender}
                                </td>

                                <td>
                                    {patient.contact}
                                </td>

                                {/* ADMIN DELETE */}

                                {role === 'Admin' && (

                                    <td>

                                        <button
                                            className='btn btn-danger btn-sm'
                                            onClick={() =>
                                                handleDelete(
                                                    patient.id
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

export default Patients;