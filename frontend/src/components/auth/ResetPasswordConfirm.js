import React, {useState} from 'react';
import {Redirect, useHistory, useParams} from 'react-router-dom';
import {resetPasswordConfirm} from "../../redux/api/api";
import {useDispatch} from "react-redux";

const ResetPasswordConfirm = () => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const dispatch = useDispatch();
    const params = useParams();

    const {new_password, re_new_password} = formData;

    const changeHandler = e => setFormData({...formData, [e.target.name]: e.target.value});

    const submitHandler = e => {
        e.preventDefault();

        const uid = params.uid;
        const token = params.token;

        dispatch(resetPasswordConfirm(uid, token, new_password, re_new_password));

        setRequestSent(true);
    };

    if (requestSent) {
        return <Redirect to='/login'/>
    }

    return (
        <div className='container mt-5'>
            <form onSubmit={submitHandler}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='New Password'
                        name='new_password'
                        value={new_password}
                        onChange={changeHandler}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm New Password'
                        name='re_new_password'
                        value={re_new_password}
                        onChange={changeHandler}
                        minLength='6'
                        required
                    />
                </div>
                <button className='btn btn-primary' type='submit'>Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordConfirm;