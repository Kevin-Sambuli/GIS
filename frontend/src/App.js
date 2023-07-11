import React, {useState, useEffect, useCallback, Fragment} from "react";
import {Route, Switch, Redirect, useLocation, useHistory} from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import MapElement from './components/parcels/Map';
import Signup from './components/auth/Signup';
import Activate from './components/auth/Activate';
import ResetPassword from './components/auth/ResetPassword';
import ResetPasswordConfirm from './components/auth/ResetPasswordConfirm';
import Layout from "./components/layout/Layout";
import NotFound from "./components/NotFound";

import {useSelector, useDispatch} from "react-redux";
import useFetch from "./hooks/useFetch";
import useAxiosPrivate from "./hooks/useAxios";

import Account from "./pages/Account";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import GeoData from "./pages/GeoData";
import Navbar from "./components/layout/Navbar";

function App() {
    const [loading, setIsLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [notes, setNotes] = useState(true);
    const user = useSelector((state) => state.auth);
    const access = user.access;

    const dispatch = useDispatch();
    // const history = useHistory();
    // const location = useLocation();

    /* The useFetch hook returns a function that takes in two argurments the url and the body
     thats attached to the request when making the api call
    */
    const api = useFetch();


    // useEffect(()  => {
    //     try {
    //         getNotes();
    //     } catch (error) {
    //        history('/login', {state : {from: location}, replace:true});
    //     }
    // }, [access]);
    //

    // when using the custom fetch hook
    let getNotes = async () => {
        let {response, data} = await api('/api/notes/');

        if (response.status === 200) {
            setNotes(data);
        }
    };


    const onclickLoginHandler = () => {
        setLoggedIn(prevState => !prevState);
    };



    const home = (
        <Home onclickLoginHandler={onclickLoginHandler} >
            {/*<Login/>*/}
        </Home>
    )

    const layout = (
        <>
            <Switch>
                <Route path='/' exact> <Home/> </Route>
                    {/* <Route path='/signup'> <Signup/> </Route>*/}
                    {/*<Route path='/login'> <Login/> </Route>*/}
            </Switch>

            <Layout>
                <Switch>
                    {/*<Route path='/' exact> <Home/> </Route>*/}
                    <Route path='/dashboard' exact> <Dashboard/> </Route>
                    <Route path='/signup'> <Signup/> </Route>
                    <Route path='/login'> <Login/> </Route>
                    <Route path='/map'> <MapElement/> </Route>
                    <Route path='/data'> <GeoData/> </Route>
                    <Route path='/account'> <Account/> </Route>
                    <Route path='/analytics'> <Analytics/> </Route>
                    <Route path='/activate/:uid/:token'> <Activate/> </Route>
                    <Route path='/reset-password'> <ResetPassword/> </Route>
                    <Route path='/password/reset/confirm/:uid/:token'> <ResetPasswordConfirm/> </Route>
                    <Route path='*'><Redirect to='/'/></Route>
                    <Route path='*'> <NotFound/></Route>
                </Switch>
            </Layout>
        </>
    )


    return (
        <div>
            {/*{ home }*/}
            {/*{ user.user ? home : layout }*/}
            {/*{user.user ? layout : home}*/}
            {/*<Navbar/>*/}
            {layout}
        </div>

    )
};

export default App;

