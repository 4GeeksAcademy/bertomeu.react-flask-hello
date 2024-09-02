import React, { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const register = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.register(email, password);
            navigate('/login');
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };
    return (
        <form id="register-form" className="container p-5 my-5 border border-success-subtle border-3" onSubmit={handleSubmit}>
            <h2 className="text-center" >Register</h2>
            <div className="form-group py-3">
                <label className="ms-3 pb-3 fs-3" for="email">Email:</label>
                <input type="email" id="email" name="email" className="form-control" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group py-3 fs-3">
                <label className="ms-3 pb-3" for="password">Password:</label>
                <input type="password" id="password" name="password" className="form-control" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="d-flex justify-content-center py-3">
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>
            {error && <p className="error-message">{error}</p>}

        </form>
    )
}

export default register