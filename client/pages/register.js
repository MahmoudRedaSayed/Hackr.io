import { useState,useEffect } from 'react';
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
        buttonText: 'Register',
        loadedCategories: [],
        categories: []
    });

    const { name, email, password, error, success, buttonText,categories } = state;
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const response = await axios.get(`http://localhost:5000/api/categories`);
        setState({ ...state,loadedCategories: response.data });
    };
    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
    };
    const handleToggle = c => () => {
        // return the first index or -1
        const clickedCategory = categories.indexOf(c);
        const all = [...categories];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        console.log('all >> categories', all);
        setState({ ...state, categories: all, success: '', error: '' });
    };

    // show categories > checkbox
    const showCategories = () => {
        return (
            state.loadedCategories &&
            state.loadedCategories.map((c, i) => (
                <li className="list-unstyled" key={c._id}>
                    <input type="checkbox" onChange={handleToggle(c._id)} className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const handleSubmit = async e => {
       try{ e.preventDefault();
        // console.table({ name, email, password });
        const response =await axios
            .post(`http://localhost:5000/api/register`, {
                name,
                email,
                password,
                categories
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
                <label className="text-muted ml-4">Category</label>
                <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showCategories()}</ul>
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
