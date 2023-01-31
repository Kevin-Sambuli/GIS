import {configureStore} from '@reduxjs/toolkit';
import authSlice from '../redux/actions/authSlice';

const store = configureStore(
    {
        reducer: {
            auth: authSlice.reducer,
            // parcel: parcelSlice.reducer
        },
    });

export default store;