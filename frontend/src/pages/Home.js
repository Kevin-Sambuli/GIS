import React from 'react';
import {Link} from 'react-router-dom';

import {useSelector} from "react-redux";
import Navbar from "../components/layout/Navbar";
// import useAxiosPrivate from "../hooks/useAxios";

const Home = () => {

    // To use this change the refresh token to be an axios instance

    // const axiosRequest = useAxiosPrivate();

    const user = useSelector((state) => state.auth);


    // useEffect(()  => {
    //     try {
    //         getNotesAxios();
    //     } catch (error) {
    //        history('/login', {state : {from: location}, replace:true});
    //     }
    // }, [access]);

    //when using axios
    /*
    let getNotesAxios = async () => {
        // returns decoded response as the actual data.. response processing was done by the response interceptor
        let data = await axiosRequest.get('/api/notes/');
            // setNotes(data)
        };
     */




    return (
        <div className='container'>
            <div class='jumbotron mt-5'>
                {user.user ? <h1 className='display-4'>{user.user.username} Welcome to Web GIS!</h1> : ""}
                <p class='lead'>This is an incredible web Based Geographic information System..</p>
                <p>The system has production level authentication system!</p>
                <hr class='my-4'/>
                <p>Click the Log In button</p>
                <Link class='btn btn-primary btn-lg bg-blue-700 focus:ring-4 rounded-lg text-sm px-5 py-2.5  dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' to='/login' role='button'>Login</Link>
            </div>
        </div>

    )
};

export default Home;