import {useState} from "react";
import {Redirect} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {resetPassword} from "../../redux/api/api";


const ResetPassword = () => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const dispatch = useDispatch();

    const {email} = formData;

    const changeHandler = e => setFormData({...formData, [e.target.name]: e.target.value});

    const submitHandler = e => {
        e.preventDefault();

        dispatch(resetPassword(email));
        setRequestSent(true);
    };

    if (requestSent) {
        return <Redirect to='/login'/>
    }

    return (
        <div className='container mt-5'>
            <h1>Request Password Reset:</h1>
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
                <button className='btn btn-primary' type='submit'>Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;