import {
    useState,
    useEffect
} from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function AddAppointment() {

    const navigate =
        useNavigate();

    const role =
        localStorage.getItem('role');

    const username =
        localStorage.getItem('username');

    const [patients, setPatients] =
        useState([]);

    const [doctors, setDoctors] =
        useState([]);

    const [appointments, setAppointments] =
        useState([]);

    const [availableSlots, setAvailableSlots] =
        useState([]);

    const [selectedDoctor, setSelectedDoctor] =
        useState(null);

    const [appointment, setAppointment] =
        useState({
            patientId: '',
            doctorId: '',
            dateTime: ''
        });

    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchPatients();

        fetchDoctors();

        fetchAppointments();

    }, []);

    // =========================================
    // FETCH PATIENTS
    // =========================================

    const fetchPatients = async () => {

        try {

            const token =
                localStorage.getItem('token');

            const role =
                localStorage.getItem('role');

            const userId =
                localStorage.getItem('userId');

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

            // PATIENT -> ONLY OWN PATIENT

            if (role === 'Patient') {

                data =
                    data.filter(
                        p =>
                            p.userId ==
                            userId
                    );

                // AUTO SELECT

                if (data.length > 0) {

                    setAppointment(prev => ({
                        ...prev,
                        patientId: data[0].id
                    }));
                }
            }

            setPatients(data);

        } catch (error) {

            console.log(error);
        }
    };

    // =========================================
    // FETCH DOCTORS
    // =========================================

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

            setDoctors(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    // =========================================
    // FETCH APPOINTMENTS
    // =========================================

    const fetchAppointments = async () => {

        try {

            const token =
                localStorage.getItem('token');

            const response =
                await API.get(
                    '/appointments/all',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setAppointments(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    // =========================================
    // GENERATE SLOTS
    // =========================================

    const generateAvailableSlots = (doctor) => {

        if (!doctor) return;

        const slots = [];

        const startParts =
            doctor.startTime.split(':');

        const endParts =
            doctor.endTime.split(':');

        const current =
            new Date();

        current.setHours(
            parseInt(startParts[0]),
            parseInt(startParts[1]),
            0,
            0
        );

        const end =
            new Date();

        end.setHours(
            parseInt(endParts[0]),
            parseInt(endParts[1]),
            0,
            0
        );

        while (current < end) {

            const slot =
                new Date(current);

            const alreadyBooked =
                appointments.some(a => {

                    if (
                        a.doctorId !== doctor.id
                    ) return false;

                    if (
                        a.status === 'Completed'
                    ) return false;

                    const booked =
                        new Date(a.dateTime);

                    return (
                        booked.getHours() ===
                        slot.getHours() &&

                        booked.getMinutes() ===
                        slot.getMinutes()
                    );
                });

            // ONLY FUTURE + FREE

            if (
                slot > new Date() &&
                !alreadyBooked
            ) {

                slots.push(
                    new Date(slot)
                );
            }

            current.setMinutes(
                current.getMinutes() + 30
            );
        }

        setAvailableSlots(slots);
    };

    // =========================================
    // HANDLE CHANGE
    // =========================================

    const handleChange = (e) => {

        const { name, value } =
            e.target;

        setAppointment({
            ...appointment,
            [name]: value
        });

        // DOCTOR SELECT

        if (name === 'doctorId') {

            const doctor =
                doctors.find(
                    d =>
                        d.id ===
                        parseInt(value)
                );

            setSelectedDoctor(
                doctor
            );

            generateAvailableSlots(
                doctor
            );
        }
    };

    // =========================================
    // SAVE APPOINTMENT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem('token');

            await API.post(
                '/appointments',
                appointment,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Appointment Added Successfully'
            );

            navigate('/appointments');

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                'Failed to add appointment'
            );
        }
    };

    return (

        <div className='container mt-5'>

            <h2 className='mb-4'>
                Add Appointment
            </h2>

            <form onSubmit={handleSubmit}>

                {/* PATIENT */}

                <label>
                    Patient
                </label>

                <select
                    name='patientId'
                    className='form-control mb-3'
                    value={appointment.patientId}
                    onChange={handleChange}
                    required
                    disabled={role === 'Patient'}
                >

                    <option value=''>
                        Select Patient
                    </option>

                    {patients.map(patient => (

                        <option
                            key={patient.id}
                            value={patient.id}
                        >
                            {patient.name}
                        </option>

                    ))}

                </select>

                {/* DOCTOR */}

                <label>
                    Doctor
                </label>

                <select
                    name='doctorId'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                >

                    <option value=''>
                        Select Doctor
                    </option>

                    {doctors.map(doctor => (

                        <option
                            key={doctor.id}
                            value={doctor.id}
                        >
                            {doctor.name}
                            {' - '}
                            {doctor.specialization}
                        </option>

                    ))}

                </select>

                {/* TIMINGS */}

                {selectedDoctor && (

                    <div className='alert alert-info'>

                        Available Timing:
                        {' '}

                        <strong>

                            {selectedDoctor.startTime}
                            {' '}
                            to
                            {' '}
                            {selectedDoctor.endTime}

                        </strong>

                    </div>
                )}

                {/* SLOTS */}

                {selectedDoctor && (

                    <>

                        <label>
                            Available Slots
                        </label>

                        <select
                            name='dateTime'
                            className='form-control mb-4'
                            onChange={handleChange}
                            required
                        >

                            <option value=''>
                                Select Slot
                            </option>

                            {availableSlots.map(
                                (slot, index) => (

                                    <option
                                        key={index}
                                        value={
                                            `${slot.getFullYear()}-${String(
                                                slot.getMonth() + 1
                                            ).padStart(2, '0')
                                            }-${String(
                                                slot.getDate()
                                            ).padStart(2, '0')
                                            }T${String(
                                                slot.getHours()
                                            ).padStart(2, '0')
                                            }:${String(
                                                slot.getMinutes()
                                            ).padStart(2, '0')
                                            }:00`
                                        }
                                    >

                                        {slot.toLocaleTimeString(
                                            'en-IN',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }
                                        )}

                                    </option>
                                )
                            )}

                        </select>

                    </>
                )}

                {/* SAVE */}

                <button className='btn btn-success'>
                    Save Appointment
                </button>

                {/* BACK */}

                <button
                    type='button'
                    className='btn btn-secondary ms-2'
                    onClick={() =>
                        navigate('/appointments')
                    }
                >
                    Back
                </button>

            </form>

        </div>
    );
}

export default AddAppointment;