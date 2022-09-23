import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Layout = ({ children }) => {
    const head = () => (
        <>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/css/styles.css" />
        </>
    );

    const nav = () => (
        <ul className="nav nav-tabs nav-dark bg-dark" style={{padding:"10px"}}>
            <div style={{flexGrow:'1'}}>

            <li className="nav-item" >
                <Link href="/">
                    <a className="nav-link  ">Home</a>
                </Link>
            </li>
            </div>
            <li className="nav-item">
                <Link href="/login">
                    <a className="nav-link ">Login</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/register">
                    <a className="nav-link ">Register</a>
                </Link>
            </li>
        </ul>
    );

    return (
        <>
            {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
        </>
    );
};

export default Layout;
