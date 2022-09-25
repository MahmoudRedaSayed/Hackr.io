import { useState, useEffect } from 'react';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';
import Swal from "sweetalert2";


const ResetPassword = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password',
        success: '',
        error: ''
    });
    const { name, token, newPassword, buttonText, success, error } = state;

    useEffect(() => {
        console.log(router);
        const decoded = jwt.decode(router.query.id);
        if (decoded) setState({ ...state, name: decoded.name, token: router.query.id });
    }, [router]);

    const handleChange = e => {
        setState({ ...state, newPassword: e.target.value, success: '', error: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Sending' });
        try {
            const response = await axios.put(`http://localhost:5000/api/reset-password`, { resetPasswordLink: token, newPassword });
            setState({
                ...state,
                newPassword: '',
                buttonText: 'Done',
                success: response.data.message
            });
            Swal.fire("congrates","your email is ready now","success")
            Router.push("/login")


        } catch (error) {
            console.log('RESET PW ERROR', error);
            setState({
                ...state,
                buttonText: 'Forgot Password',
                error: error.response.data
            });
            Swal.fire("oops",error.response.data,"error")
        }
    };

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    onChange={handleChange}
                    value={newPassword}
                    placeholder="Type new password"
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
                    <h1>Hi {name}, Ready to Reset Password?</h1>
                    <br />
                    {passwordResetForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ResetPassword);
