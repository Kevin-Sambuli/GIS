import React from 'react';
import {Link, Switch} from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import "./Home.css";

import {useSelector} from "react-redux";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
// import useAxiosPrivate from "../hooks/useAxios";

const Home = (props) => {
    const user = useSelector(state => state.auth);

    const onclickloginHandler = () => {
       props.onclickLoginHandler();
    };


    return (
        <>
             <div className="home-page">
                <div className="background-image"></div>

                 <div className="">{props.children} </div>

                {/*<div className='z-20'>*/}
                {/*     <section className="bg-gradient-to-r from-green-500 to-transparent h-screen dark:bg-gray-900">*/}
                {/*         <div*/}
                {/*              className="opacity-100 grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">*/}
                {/*             <div className="mr-auto place-self-center lg:col-span-7">*/}
                {/*                 <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Unlocking the Power of GIS</h1>*/}
                {/*                 <p className="max-w-2xl mb-6 font-light text-gray-900 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">From*/}
                {/*                     checkout to global sales tax compliance, companies around the world use Flowbite to*/}
                {/*                      simplify their payment stack.</p>*/}
                {/*                  <Link to="/login" onClick={onclickloginHandler}*/}
                {/*                    className="inline-flex opacity-100 items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-slate-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">*/}
                {/*                     Sign in*/}
                {/*               </Link>*/}
                {/*                 <Link to="/signup"*/}
                {/*                    className="inline-flex opacity-100 items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">*/}
                {/*                   Sign up*/}
                {/*                 </Link>*/}
                {/*             </div>*/}
                {/*             <div className="hidden opacity-100 lg:mt-0 lg:col-span-5 lg:flex">*/}
                {/*                 /!*<img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"*!/*/}
                {/*                 <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"*/}
                {/*                      alt="mockup"/>*/}
                {/*             </div>*/}
                {/*         </div>*/}
                {/*     </section>*/}
                {/* </div>*/}

                <Login/>
                {/* <Signup/>*/}
            </div>

            {/*// <div className='container'>*/}
            {/*// <div class='jumbotron mt-5'>*/}
            {/*// {user.user ? <h1 className='display-4'>{user.user.username} Welcome to Web GIS!</h1> : ""}*/}
            {/*// <p class='lead'>This is an incredible web Based Geographic information System..</p>*/}
            {/*// <p>The system has production level authentication system!</p>*/}
            {/*// <hr class='my-4'/>*/}
            {/*// <p>Click the Log In button</p>*/}
            {/*// <Link*/}
            {/*//             class='btn btn-primary btn-lg bg-blue-700 focus:ring-4 rounded-lg text-sm px-5 py-2.5  dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'*/}
            {/*//             to='/login' role='button'>Login</Link>*/}
            {/*//     </div>*/}
            {/*// </div>*/}
        </>
            )};

            export default Home;