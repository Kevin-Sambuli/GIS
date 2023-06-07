import {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {loginUser} from "../../redux/api/api";
import axios from "axios";


const Login = (props) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value.trim()});
    };

    const {email, password} = formData;

    const submitHandler = (e) => {
        e.preventDefault();

        //dispatching the send user function that dispatches the internal actions to update the state
        dispatch(loginUser(email, password));

        // if (isAuthenticated) {
        //        return <Redirect to={'/'}/>
        //    };

        // email.length > 0 && dispatch(loginUser(email, password));
    };

    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {
            console.log(err)
        }
    };

    if (isAuthenticated) {
        return <Redirect to={'/'}/>
    }
    ;
    
        return (
        <>
            <div className='container mt-5'>
                <h3>Sign In</h3>
                <p>Sign into your Account</p>
                <form onSubmit={submitHandler}>
                    <div className='form-group'>
                        <input
                            className='form-control'
                            type='email'
                            placeholder='Email'
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
                            placeholder='Password'
                            name='password'
                            value={password}
                            onChange={changeHandler}
                            // minLength='6'
                            required
                        />
                    </div>
                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        type='submit'>Login
                    </button>
                </form>
                <button className='btn btn-danger mt-3' onClick={continueWithGoogle}>
                    Continue With Google
                </button>
                <br/>
                {/*<button className='btn btn-primary mt-3' onClick={continueWithFacebook}>*/}
                {/*    Continue With Facebook*/}
                {/*</button>*/}
                <p className='mt-3'>
                    Don't have an account? <Link
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline' to='/signup'>Sign Up</Link>
                </p>
                <p className='mt-3'>
                    Forgot your Password? <Link className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                                                to='/reset-password'>Reset Password</Link>
                </p>
            </div>
        </>
    );
};

export default Login;
