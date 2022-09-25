import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import Swal from "sweetalert2";

const ForgotPassword = () => {
    const [state, setState] = useState({
        email: '',
        buttonText: 'Forgot Password',
        success: '',
        error: ''
    });
    const { email, buttonText, success, error } = state;

    const handleChange = e => {
        setState({ ...state, email: e.target.value, success: '', error: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/forgot-password`, { email });
            setState({
                ...state,
                email: '',
                buttonText: 'Done',
                success: response.data
            });
            Swal.fire("congrates","check your email box to complete the reset steps","success")

        } catch (error) {
            console.log('FORGOT PW ERROR', error);
            setState({
                ...state,
                buttonText: 'Forgot Password',
                error: error.response.data
            });
            Swal.fire("oops",error.response.data,"error")

        }
    };

    const passwordForgotForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    value={email}
                    placeholder="Type your email"
                    required
                />
            </div>
            <div>
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Forgot Password</h1>
                    <br />
                    {passwordForgotForm()}
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
