import React, {Fragment, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from "../../redux/api/api";
import './NavBar.css';
import logo from '../../assets/Web-GIS.png';
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import prof from "../../assets/prof.jpg";
import Modal from "../modal/Modal";
// import prof from "../../assets/prof.jpg";

library.add(fas, far);

const Navbar = () => {
    const [redirect, setRedirect] = useState(false);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const state = useSelector((state) => state.auth)


    const ParcelSearch = (e) => {
        history.push({
            pathname: '/search/',
            // search: '?search=' + data.search,
            // search: '?color=blue'
        });
        window.location.reload();

        //	history.push('/dresses?color=blue')
    };

    // const showModal = () =>{
    //     return (
    //         {open && <Modal/> }
    //     )
    // }


    const logoutHandler = () => {
        /*
        Blacklisting token
            Once the user requests a logout, the refresh token is blacklisted, so it can be no longer used to obtain a
            new pair of tokens. However, note that the access token is still valid, so it is recommended that
            the lifetime of the access token should be short
        */
        dispatch(logout(state.refresh));

        // dispatch(authActions.logout());
        setRedirect(true);
        // history.push('/login');
    };

    const guestLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/login'>Login</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>Sign Up</Link>
            </li>
        </Fragment>
    );

    const authLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <a className='nav-link' href='/map'>Map</a>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='#!' onClick={logoutHandler}>Logout</a>
            </li>
        </Fragment>
    );

    // return (
    //     <Fragment>
    //         <nav className='navbar navbar-expand-lg navbar-light bg-light text-sm'>
    //             {/*<div className="logo">*/}
    //             {/*    <img  src={logo} width="70px" height="50px"></img>*/}
    //             {/*</div>*/}
    //             <Link className='navbar-brand'  to='/'>GIS Auth System</Link>
    //             <button
    //                 className='navbar-toggler'
    //                 type='button'
    //                 data-toggle='collapse'
    //                 data-target='#navbarNav'
    //                 aria-controls='navbarNav'
    //                 aria-expanded='false'
    //                 aria-label='Toggle navigation'
    //             >
    //                 <span className='navbar-toggler-icon'></span>
    //             </button>
    //
    //             <div className='collapse navbar-collapse' id='navbarNav'>
    //                 <ul className='navbar-nav'>
    //                     <li className='nav-item active'>
    //                         <Link className='nav-link' to='/'>Home <span className='sr-only'>(current)</span></Link>
    //                     </li>
    //                     {state.isAuthenticated && state.user ? authLinks() : guestLinks()}
    //                 </ul>
    //             </div>
    //         </nav>
    //     </Fragment>
    // );

    return (
        // g-gradient-to-l from-green-800 to-transparent bg-green-300
        <nav className="sticky top-0 w-full h-14 bg-gradient-to-l from-teal-700 via-cyan-800 to-emerald-100 z-10 shadow-xl shadow-zinc-600 ">
        {/*<nav className="sticky top-0 w-full h-14 bg-gradient-to-l from-green-800 to-transparent bg-green-300 z-10 shadow-xl shadow-zinc-600 ">*/}
            <div className="container max-w-5xl">
                <div className="flex flex-row py-1 items-center">
                    <Link className='navbar-brand text-xl' to='/'>WebGIS System</Link>
                        {/*<Link className='nav-link' to='/login'>Login</Link>*/}

                    {/*<div className="basis-1/3">*/}
                    {/*    <img src={logo} alt="WebGIS" height= "50" width="100" className="rounded-lg"/>*/}

                    {/*</div>*/}
                    <div className="basis-1/3">
                        <div className="relative">
                            <FontAwesomeIcon
                                icon="magnifying-glass"
                                className="absolute left-3 top-3 text-gray-300"/>
                            <input
                                id="search"
                                className="bg-gray-100 rounded-full w-80 pl-10 align-middle focus:outline-0 placeholder:font-light"
                                placeholder="Search"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="basis-1/3">
                        <ul className="flex flex-row space-x-4 p-2 text-2xl justify-end items-center">
                            <li>
                                <a className="cursor-pointer" href="">
                                    <FontAwesomeIcon className='h-8 w-8' icon="house"/>
                                </a>
                            </li>
                            <li>
                                <a className="cursor-pointer" href="">
                                    <FontAwesomeIcon className='h-8 w-8' icon={['far', 'comment-dots']}/>
                                </a>
                            </li>
                            <li>
                                <a className="cursor-pointer " href="">
                                    <FontAwesomeIcon className='h-8 w-8' icon={["far", "map"]}/>
                                </a>
                            </li>

                            <li>
                                <a className="cursor-pointer" href="">
                                    <img
                                        className="rounded-full h-10 w-10"
                                        src={prof}
                                        alt="user profile"
                                    />
                                    <span
                                        className="align-end top-3 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
                                    </span>
                                </a>
                            </li>
                            {/*<li className='pl-10 nav-item'>*/}
                            {/*    <a className='nav-link' href='#!' onClick={logoutHandler}>Kevin</a>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </div>
            </div>

        </nav>

    );
};

export default Navbar;