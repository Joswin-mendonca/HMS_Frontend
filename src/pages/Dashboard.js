import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const navigate = useNavigate();

    const role =
        localStorage.getItem('role');

    return (

        <div className='container mt-5'>

            <h1 className='mb-5 text-center fw-bold'>
                Hospital Management
            </h1>

            <div className='row justify-content-center g-4'>

                {(role === 'Admin' ||
                    role === 'Patient') && (

                        <div className='col-lg-3 col-md-4 col-sm-6 d-flex'>

                            <div
                                className='card shadow text-center w-100 d-flex justify-content-center align-items-center'
                                style={{
                                    cursor: 'pointer',
                                    height: '250px',
                                    borderRadius: '15px'
                                }}
                                onClick={() =>
                                    navigate('/patients')
                                }
                            >
                                <h1 className='display-3 mb-3'>P</h1>
                                <h3>Patients</h3>
                            </div>

                        </div>
                    )}

                {role === 'Admin' && (

                    <div className='col-lg-3 col-md-4 col-sm-6 d-flex'>

                        <div
                            className='card shadow text-center w-100 d-flex justify-content-center align-items-center'
                            style={{
                                cursor: 'pointer',
                                height: '250px',
                                borderRadius: '15px'
                            }}
                            onClick={() =>
                                navigate('/doctors')
                            }
                        >
                            <h1 className='display-3 mb-3'>D</h1>
                            <h3>Doctors</h3>
                        </div>

                    </div>
                )}

                {(role === 'Admin' ||
                    role === 'Doctor' ||
                    role === 'Patient') && (

                        <div className='col-lg-3 col-md-4 col-sm-6 d-flex'>

                            <div
                                className='card shadow text-center w-100 d-flex justify-content-center align-items-center'
                                style={{
                                    cursor: 'pointer',
                                    height: '250px',
                                    borderRadius: '15px'
                                }}
                                onClick={() =>
                                    navigate('/appointments')
                                }
                            >
                                <h1 className='display-3 mb-3'>A</h1>
                                <h3>Appointments</h3>
                            </div>

                        </div>
                    )}

                {(role === 'Admin' ||
                    role === 'Patient') && (

                        <div className='col-lg-3 col-md-4 col-sm-6 d-flex'>

                            <div
                                className='card shadow text-center w-100 d-flex justify-content-center align-items-center'
                                style={{
                                    cursor: 'pointer',
                                    height: '250px',
                                    borderRadius: '15px'
                                }}
                                onClick={() =>
                                    navigate('/billing')
                                }
                            >
                                <h1 className='display-3 mb-3'>B</h1>
                                <h3>Billing</h3>
                            </div>

                        </div>
                    )}

            </div>

        </div>
    );
}

export default Dashboard;
