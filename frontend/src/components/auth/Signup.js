import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {registerUser} from "../../redux/api/api";
import {useSelector, useDispatch} from "react-redux";


const Signup = () => {
    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        re_password: ''
    });

    const dispatch = useDispatch();
    const state = useSelector((state) => state.auth);

    // const changeHandler = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const changeHandler = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const {first_name, last_name, email, username, password, re_password} = formData;

    const submitHandler = (e) => {
        e.preventDefault();

        // let data = {
        //     first_name: formData.first_name,
        //     last_name: formData.last_name,
        //     email: formData.email,
        //     username: formData.username,
        //     password: formData.password,
        //     re_password: formData.re_password,
        // };


        if (password === re_password) {

            //sending the data to the server as well as changing the state
            dispatch(registerUser(first_name, last_name, email, username, password, re_password));

            setAccountCreated(true);
        }
    };

    if (state.isAuthenticated) {
        return <Redirect to='/'/>
    }
    if (accountCreated) {
        return <Redirect to='/login'/>
    }

    return (
        <div className='container-md mt-5'>
            <h1>Sign Up</h1>
            <p>Create your Account</p>
            <form onSubmit={submitHandler}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='First Name*'
                        name='first_name'
                        value={first_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='Last Name*'
                        name='last_name'
                        value={last_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='userame*'
                        name='username'
                        value={username}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='Email*'
                        name='email'
                        value={email}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password*'
                        name='password'
                        value={password}
                        onChange={changeHandler}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm Password*'
                        name='re_password'
                        value={re_password}
                        onChange={changeHandler}
                        minLength='6'
                        required
                    />
                </div>
                {/*<p>{ password !== re_password ? "Passwords do not match" : ""}</p>*/}
                <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    type='submit'>Register
                </button>
            </form>
            <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Continue With Google
            </button>
            <br/>
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Continue With Facebook
            </button>
            <p className='mt-3'>
                Already have an account? <Link to='/login' className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>Sign In</Link>
            </p>
        </div>
    );
};

export default Signup;