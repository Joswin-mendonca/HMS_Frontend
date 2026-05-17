function Profile() {

    const username =
        localStorage.getItem('username');

    const role =
        localStorage.getItem('role');

    return (

        <div className='container mt-5'>

            <div className='card p-4 shadow'>

                <h2>Profile</h2>

                <hr />

                <h5>
                    Username: {username}
                </h5>

                <h5>
                    Role: {role}
                </h5>

            </div>

        </div>
    );
}

export default Profile;
