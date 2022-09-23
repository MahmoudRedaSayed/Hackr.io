import { useState } from 'react';
import Layout from '../components/Layout';
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register'
    });

    const { name, email, password, error, success, buttonText } = state;

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
    };

    const handleSubmit = async e => {
       try{ e.preventDefault();
        // console.table({ name, email, password });
        const response =await axios
            .post(`http://localhost:5000/api/register`, {
                name,
                email,
                password
            })
            Swal.fire('congrates', response.data ,'success')
                setState({
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: '',
                    buttonText: 'submitted'
                })
            }
        catch(error)
        {
            console.log(error)
            Swal.fire('Oops', error.response.data,'error')
        }
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    value={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    placeholder="Type your name"
                />
            </div>
            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                />
            </div>
            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
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
                <h1>Register</h1>
                <br />
                {registerForm()}
                <hr />
                {JSON.stringify(state)}
            </div>
        </Layout>
    );
};

export default Register;
