import Link from "next/link";
import React from "react";
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();
// NProgress.configure({ showSpinner: false });



const Layout=(props)=>{
    const head=()=> (
        <React.Fragment>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/css/styles.css" />
        </React.Fragment>
    );
    const nav=()=>(
        <ul className="nav nav-tabs light-dark bg-dark ">
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link text-light">Home</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/login">
                    <a className="nav-link text-light">Login</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/register">
                    <a className="nav-link text-light">Register</a>
                </Link>
            </li>
        </ul>
    )
    return(<React.Fragment>
        {head()} {nav()} {props.children}
    </React.Fragment>)
}

export default Layout;