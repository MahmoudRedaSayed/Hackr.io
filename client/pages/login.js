import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
// import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import Swal from "sweetalert2";
import { authenticate, isAuth } from '../helpers/auth';

export default function Login  () {
    const [state, setState] = useState({
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Login'
    });
    const { email, password, error, success, buttonText } = state;

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);


    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Login' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("here")
        setState({ ...state, buttonText: 'Logging in' });
        try {
            const response = await axios.post(`http://localhost:5000/api/login`, {
                email,
                password
            });
            Swal.fire("congrates","your data is correct","success")
            Router.push("/")
            // console.log(response); // data > token / user
            authenticate(response, () =>
                isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user')
            );
        } catch (error) {
            console.log(error);
            Swal.fire("oops",error.response.data,"error")
            // setState({ ...state, buttonText: 'Login', error: error.response.data.error });
        }
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                    required
                />
            </div>
            <div className="form-group">
                <button className="btn btn-outline-dark">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Login</h1>
                <br />
                {/* {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)} */}
                {loginForm()}
            </div>
        </Layout>
    );
};

