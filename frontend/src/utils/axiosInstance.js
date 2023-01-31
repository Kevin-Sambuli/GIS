import axios from "axios";

// const REACT_APP_API_URL='http://localhost:8000'

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

const baseURL= process.env.REACT_ENV ==='production'? 'api' : 'http://localhost:8000'

const axiosBase = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

//creating the new axios instance that will be attached to every request
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access') ? "JWT " + localStorage.getItem('access') : null,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});


export default axiosBase;