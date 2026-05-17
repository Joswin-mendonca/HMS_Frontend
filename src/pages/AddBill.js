import {
    useEffect,
    useState
} from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function AddBill() {

    const navigate =
        useNavigate();

    const [appointments, setAppointments] =
        useState([]);

    const [bill, setBill] =
        useState({
            appointmentId: '',
            amount: ''
        });

    useEffect(() => {

        fetchAppointments();

    }, []);

    const fetchAppointments = async () => {

        try {

            const token =
                localStorage.getItem('token');

            const response =
                await API.get(
                    '/appointments',
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

    const handleChange = (e) => {

        setBill({
            ...bill,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem('token');

            await API.post(
                '/billing',
                bill,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Bill created successfully'
            );

            navigate('/billing');

        } catch (error) {

            console.log(error);

            alert(
                'Failed to create bill'
            );
        }
    };

    return (

        <div className='container mt-5'>

            <h2>
                Add Bill
            </h2>

            <form onSubmit={handleSubmit}>

                {/* APPOINTMENT */}

                <label>
                    Appointment
                </label>

                <select
                    name='appointmentId'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                >

                    <option value=''>
                        Select Appointment
                    </option>

                    {appointments.map(a => (

                        <option
                            key={a.appointmentId}
                            value={a.appointmentId}
                        >

                            Appointment #
                            {a.appointmentId}

                            {' - '}

                            {a.patient?.name}

                        </option>
                    ))}

                </select>

                {/* AMOUNT */}

                <label>
                    Amount
                </label>

                <input
                    type='number'
                    name='amount'
                    className='form-control mb-3'
                    onChange={handleChange}
                    required
                />

                {/* SAVE */}

                <button className='btn btn-success'>
                    Save Bill
                </button>

            </form>

            <button
                className='btn btn-secondary mt-3'
                onClick={() =>
                    navigate('/billing')
                }
            >
                Back
            </button>

        </div>
    );
}

export default AddBill;