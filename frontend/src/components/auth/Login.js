import {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {loginUser} from "../../redux/api/api";
import axios from "axios";
import './Login.css'


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
        return <Redirect to={'/map'}/>
    }
    ;

    return (
        <>
                        <div className="w-full bg-slate-200 z-40 opacity-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="items-center p-6 space-y-4 md:space-y-6 sm:p-8">

                                <h1 className="text-xl items-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign in to your account
                                </h1>

                                <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
                                    <div>
                                        <input type="email"
                                               name="email"
                                               id="email"
                                               value={email}
                                               onChange={changeHandler}
                                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               placeholder="name@company.com"
                                               required=""/>
                                    </div>

                                    <div>
                                        <input type="password"
                                               name="password"
                                               id="password"
                                               value={password}
                                               onChange={changeHandler}
                                               placeholder="••••••••"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               required=""/>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="remember" aria-describedby="remember" type="checkbox"
                                                       className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                                       required=""/>
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                            </div>
                                        </div>

                                        <Link to="/reset-password" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</Link>

                                    </div>

                                    <hr></hr>

                                    <button type='submit' className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
                                        text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >Login </button>

                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Don’t have an account yet?
                                        <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                                    </p>

                                </form>
                            </div>
                        </div>
        </>
    );
};

export default Login;
