import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import  jwt  from "jsonwebtoken";
import Swal from "sweetalert2";
import axios from "axios";

export default function activate(){
    const router=useRouter();
    const [state,setState]=useState({
        name:"",
        token:'',
        success:"",
        error:"",
        buttonText:"Activate"
    })
    useEffect(()=>{
        if(router.query.id)
        {
            const token=router.query.id
            const {name}=jwt.decode(token);
            setState({...state,token,name})
        }   
    },[router])
    const clickSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Activating' });

        try {
            const response = await axios.post(`http://localhost:5000/api/register/activate`, { token:state.token });
            setState({ ...state, name: '', token: '', buttonText: 'Activated', success: response.data.message });
            Swal.fire("congrates","your email is activated now","success")
            router.push("/login")
        } catch (error) {
            setState({ ...state, buttonText: 'Activate Account', error: error.response.data });
            Swal.fire("oops",error.response.data,"success")
            console.log(error)
        }
    };
    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>G'day {state.name}, Ready to activate your account?</h1>
                    <br />
                    <button className="btn btn-outline-dark btn-block" onClick={clickSubmit}>
                        {state.buttonText}
                    </button>
                </div>
            </div>
        </Layout>
    );
}