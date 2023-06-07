import React, {useEffect, useState} from "react";
import Navbar from './Navbar';
import Sidebar from "./SideBar";
import {Link} from "react-router-dom";
// import './Layout.css';
import {checkAuthenticated, loadUser} from "../../redux/api/api";
import {useDispatch} from "react-redux";

import control from '../../assets/control.png';
import logo from '../../assets/logo.png';
import chart from '../../assets/Chart.png';
import folder from '../../assets/Folder.png';
import user from '../../assets/User.png';
import setting from '../../assets/Setting.png';
import map from '../../assets/map.png';
import image from '../../assets/images.png';

const Layout = (props) => {
    return (
        <React.Fragment>
            <div className="flex">
                <Sidebar/>
                <div className={"text-2xl w-full h-screen h-full font-semibold"}>
                    {/*<Navbar/>*/}
                    <div className="mainContent ">
                        <main className="main bg-emerald-300 w-full h-screen h-full">{props.children}</main>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Layout;