import {
    useEffect,
    useState,
    useCallback
} from 'react';

import API from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

function Billing() {

    const [bills, setBills] =
        useState([]);

    const [showPayment, setShowPayment] =
        useState(false);

    const [selectedBillId, setSelectedBillId] =
        useState(null);

    const [paymentMethod, setPaymentMethod] =
        useState('');

    const navigate =
        useNavigate();

    const role =
        localStorage.getItem('role');

    // =========================================
    // FETCH BILLS
    // =========================================

    const fetchBills = useCallback(async () => {

        try {

            const token =
                localStorage.getItem('token');

            let endpoint =
                '/billing';

            // PATIENT -> OWN BILLS

            if (role === 'Patient') {

                endpoint =
                    '/billing/my';
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

            setBills(response.data);

        } catch (error) {

            console.log(
                error.response?.data || error
            );
        }

    }, [role]);

    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchBills();

    }, [fetchBills]);

    // =========================================
    // DELETE BILL
    // =========================================

    const handleDelete = async (
        billId
    ) => {

        const confirmDelete =
            window.confirm(
                'Delete bill?'
            );

        if (!confirmDelete) return;

        try {

            const token =
                localStorage.getItem('token');

            await API.delete(
                `/billing/${billId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                'Bill deleted successfully'
            );

            fetchBills();

        } catch (error) {

            console.log(error);

            alert(
                'Failed to delete bill'
            );
        }
    };

    // =========================================
    // PAYMENT
    // =========================================

    const handlePayment = async (
        billId
    ) => {

        try {

            const token =
                localStorage.getItem('token');

            await API.put(
                `/billing/payment/${billId}`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                `Payment Successful via ${paymentMethod}`
            );

            setShowPayment(false);

            setPaymentMethod('');

            fetchBills();

        } catch (error) {

            console.log(error);

            alert(
                'Payment Failed'
            );
        }
    };

    return (

        <div className='container mt-5'>

            {/* HEADER */}

            <div className='d-flex justify-content-between align-items-center mb-4'>

                <h2>
                    Billing Details
                </h2>

                {/* ADMIN ONLY */}

                {role === 'Admin' && (

                    <button
                        className='btn btn-primary'
                        onClick={() =>
                            navigate('/add-bill')
                        }
                    >
                        Add Bill
                    </button>
                )}

            </div>

            {/* TABLE */}

            <table className='table table-bordered table-hover shadow'>

                <thead className='table-dark'>

                    <tr>

                        <th>ID</th>

                        <th>Appointment ID</th>

                        <th>Patient Name</th>

                        <th>Amount</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {bills.length === 0 ? (

                        <tr>

                            <td
                                colSpan='6'
                                className='text-center'
                            >
                                No bills found
                            </td>

                        </tr>

                    ) : (

                        bills.map((bill) => (

                            <tr key={bill.billId}>

                                {/* ID */}

                                <td>
                                    {bill.billId}
                                </td>

                                {/* APPOINTMENT ID */}

                                <td>
                                    {bill.appointmentId}
                                </td>

                                {/* PATIENT NAME */}

                                <td>

                                    {
                                        bill.patientName ||

                                        bill.appointment?.patient?.name ||

                                        'Unknown'
                                    }

                                </td>

                                {/* AMOUNT */}

                                <td>
                                    ₹ {bill.amount}
                                </td>

                                {/* STATUS */}

                                <td>

                                    <span
                                        className={`badge ${bill.paymentStatus === 'Paid'
                                                ? 'bg-success'
                                                : 'bg-danger'
                                            }`}
                                    >

                                        {bill.paymentStatus}

                                    </span>

                                </td>

                                {/* ACTIONS */}

                                <td>

                                    {/* PATIENT PAYMENT */}

                                    {role === 'Patient' &&
                                        bill.paymentStatus !== 'Paid' && (

                                            <button
                                                className='btn btn-success btn-sm'
                                                onClick={() => {

                                                    setSelectedBillId(
                                                        bill.billId
                                                    );

                                                    setPaymentMethod('');

                                                    setShowPayment(true);
                                                }}
                                            >
                                                Pay
                                            </button>
                                        )}

                                    {/* ADMIN DELETE */}

                                    {role === 'Admin' && (

                                        <button
                                            className='btn btn-danger btn-sm'
                                            onClick={() =>
                                                handleDelete(
                                                    bill.billId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}

                                </td>

                            </tr>
                        ))
                    )}

                </tbody>

            </table>

            {/* PAYMENT SECTION */}

            {showPayment && (

                <div className='card shadow p-4 mt-4'>

                    <h4>
                        Payment Options
                    </h4>

                    <hr />

                    {/* PAYMENT MODE */}

                    <div className='mb-3'>

                        <label className='form-label'>
                            Select Payment Method
                        </label>

                        <select
                            className='form-control'
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        >

                            <option value=''>
                                Select Payment Method
                            </option>

                            <option value='UPI'>
                                UPI
                            </option>

                            <option value='NetBanking'>
                                Net Banking / NEFT
                            </option>

                            <option value='Cash'>
                                Pay at Counter
                            </option>

                        </select>

                    </div>

                    {/* UPI */}

                    {paymentMethod === 'UPI' && (

                        <div className='alert alert-info'>

                            <h5>
                                UPI Payment
                            </h5>

                            <p>
                                <strong>
                                    UPI ID:
                                </strong>
                                {' '}
                                hospital@upi
                            </p>

                            <p>
                                Supported Apps:
                            </p>

                            <ul>
                                <li>Google Pay</li>
                                <li>PhonePe</li>
                                <li>Paytm</li>
                                <li>BHIM</li>
                            </ul>

                        </div>
                    )}

                    {/* NET BANKING */}

                    {paymentMethod === 'NetBanking' && (

                        <div className='alert alert-warning'>

                            <h5>
                                Bank Transfer Details
                            </h5>

                            <p>
                                <strong>
                                    Bank:
                                </strong>
                                {' '}
                                ABC Bank
                            </p>

                            <p>
                                <strong>
                                    A/C No:
                                </strong>
                                {' '}
                                1234567890
                            </p>

                            <p>
                                <strong>
                                    IFSC:
                                </strong>
                                {' '}
                                ABC0001234
                            </p>

                        </div>
                    )}

                    {/* CASH */}

                    {paymentMethod === 'Cash' && (

                        <div className='alert alert-success'>

                            <h5>
                                Pay at Hospital Counter
                            </h5>

                            <p>
                                Your reference token:
                            </p>

                            <h4 className='text-primary'>

                                TOKEN-
                                {selectedBillId}
                                -
                                {Math.floor(
                                    Math.random() * 10000
                                )}

                            </h4>

                            <p>
                                Show this token at billing counter.
                            </p>

                        </div>
                    )}

                    {/* CONFIRM */}

                    {paymentMethod && (

                        <button
                            className='btn btn-primary w-100'
                            onClick={() =>
                                handlePayment(
                                    selectedBillId
                                )
                            }
                        >
                            Confirm Payment
                        </button>
                    )}

                </div>
            )}

            {/* BACK BUTTON */}

            <button
                className='btn btn-secondary mt-4'
                onClick={() =>
                    navigate('/dashboard')
                }
            >
                Back
            </button>

        </div>
    );
}

export default Billing;