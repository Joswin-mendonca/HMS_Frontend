import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';

import Doctors from './pages/Doctors';
import AddDoctor from './pages/AddDoctor';

import Appointments from './pages/Appointments';
import AddAppointment from './pages/AddAppointment';

import Billing from './pages/Billing';
import AddBill from './pages/AddBill';

import Profile from './pages/Profile';

function AppContent() {

    const location = useLocation();

    return (

        <>

            {location.pathname !== '/' &&
                <Navbar />
            }

            <Routes>

                <Route
                    path='/'
                    element={<Login />}
                />

                <Route
                    path='/dashboard'
                    element={<Dashboard />}
                />

                <Route
                    path='/patients'
                    element={<Patients />}
                />

                <Route
                    path='/add-patient'
                    element={<AddPatient />}
                />

                <Route
                    path='/doctors'
                    element={<Doctors />}
                />

                <Route
                    path='/add-doctor'
                    element={<AddDoctor />}
                />

                <Route
                    path='/appointments'
                    element={<Appointments />}
                />

                <Route
                    path='/add-appointment'
                    element={<AddAppointment />}
                />

                <Route
                    path='/billing'
                    element={<Billing />}
                />

                <Route
                    path='/add-bill'
                    element={<AddBill />}
                />

                <Route
                    path='/profile'
                    element={<Profile />}
                />

            </Routes>

        </>
    );
}

function App() {

    return (

        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
