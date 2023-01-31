import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { verifyAccount } from "../../redux/api/api";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

const Activate = () => {
    const [verified, setVerified] = useState(false);
    const [message, setMessage] = useState(false);

    const params = useParams();
    const dispatch = useDispatch();

    const verifyUserAccount = e => {
        const uid = params.uid;
        const token = params.token;

        dispatch(verifyAccount(uid, token));
        setVerified(true);

    };

    if (verified) {
        return <Redirect to='/login' />
    }

    return (
        <div className='container'>
            <div
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '200px' }}
            >
                <h1>Verify your Account:</h1>
                <button
                    onClick={verifyUserAccount}
                    style={{ marginTop: '50px' }}
                    type='button'
                    className='btn btn-primary'
                >
                    Verify
                </button>
            </div>
        </div>
    );
};

export default Activate;