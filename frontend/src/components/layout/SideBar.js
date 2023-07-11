import React, {Fragment, useState} from 'react';
import chart from "../../assets/Chart.png";
import user from "../../assets/User.png";
import folder from "../../assets/Folder.png";
import setting from "../../assets/Setting.png";
import control from "../../assets/control.png";
import logo from "../../assets/logo.png";
import {Link} from "react-router-dom";


const Sidebar = ({children}) => {
    const [open, setOpen] = useState(false);

    const Menus = [
        // { title: "Search", src: "Search" },
        {path: "/dashboard", title: "Dashboard", icon: chart},
        {path: "/data", title: "Geo data", icon: chart},
        {path: "/analytics", title: "Analytics", icon: chart},
        {path: "/map", title: "Map", icon: chart},
        {path: "/account", title: "Account", icon: user, gap: true},
        {path: "/calender", title: "Schedule ", icon: chart},
        {path: "/files", title: "Files ", icon: folder, gap: true},
        {path: "/settings", title: "Setting", icon: setting},
    ];

    const toggle = () => setOpen(!open);

    return (
        <Fragment>
            <div className={`${open ? 'w-80' : 'w-12'} pl-2 pt-2 pr-2 border-r-2 border-emerald-500 bg-slate-100 duration-300 h-screen text-3xl text-black relative font-sans font-bold`}>
                <img onClick={toggle} src={control}
                     className={`absolute cursor-pointer rounded-full -right-3 top-10 w-15 border-2 border-dark-purple z-50 ${!open && "rotate-180"}`}/>

                <div className={"flex gap-x-4 items-center pb-3"}>
                    <img src={logo} width="80px" height="90px" style={{borderRadius: '50%'}}
                         className={`cursor-pointer duration-500 ${!open && 'scale-0'}`}/>
                    <h1 className={`text-green-400 origin-left font-bold text-xl duration-300 ${!open && 'scale-0'}`}>GeospatialDev</h1>
                </div>

                <hr className=""></hr>

                <div className={"flex gap-x-4 items-center p-4 pr-2 pl-2 items-center"}>
                    <h1 className={`decoration-fuchsia-900 text-lg text-slate-500 font-bold ${!open && 'scale-0'}`}>WebGIS Dashboard</h1>
                </div>

                <hr className=""></hr>

                <ul className="pt-2 items-center">
                    {Menus.map((Menu, index) => (
                        <Link to={Menu.path} key={index}
                              className={`flex rounded-md p-2 cursor-pointer hover:bg-emerald-300 text-slate-950 text-lg items-center gap-x-4 
                                  ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-white"} `}
                        >
                            <img src={Menu.icon}/>
                            {/*<i className={Menu.icon}></i>*/}
                            <span className={`${!open && "hidden"} font-normal hover:font-bold  font-semibold duration-200`}>{Menu.title} </span>
                        </Link>
                    ))}
                </ul>
            </div>
        </Fragment>
    );
};

export default Sidebar;