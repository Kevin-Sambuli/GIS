import './App.css';
import {useState, useEffect} from "react";
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

import {useSelector,useDispatch} from "react-redux";
import useFetch from "./hooks/useFetch";
import useAxiosPrivate from "./hooks/useAxios";

import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import GeoData from "./pages/GeoData";

function App() {
    const [loading, setIsLoading] = useState(true);
    const [notes, setNotes] = useState(true);
    const state = useSelector((state) => state.auth);
    const access = state.access;

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


    return (
        <Layout>
            <Switch>
                {/*<Route path='/about'><About/></Route>*/}
                <Route path='/' exact> <Home/> </Route>
                <Route path='/dashboard' exact> <Dashboard/> </Route>
                <Route path='/signup'> <Signup/> </Route>
                <Route path='/login'> <Login/> </Route>
                {/*<Route path='/login'> <Logout/> </Route>*/}
                <Route path='/map'> <MapElement/> </Route>
                <Route path='/data'> <GeoData/> </Route>
                <Route path='/about'> <About/> </Route>
                <Route path='/analytics'> <Analytics/> </Route>

                <Route path='/activate/:uid/:token'> <Activate/> </Route>
                <Route path='/reset-password'> <ResetPassword/> </Route>
                <Route path='/password/reset/confirm/:uid/:token'> <ResetPasswordConfirm/> </Route>
                <Route path='*'><Redirect to='/'/></Route>
                <Route path='*'> <NotFound /></Route>
            </Switch>
        </Layout>
    );
}

export default App;

