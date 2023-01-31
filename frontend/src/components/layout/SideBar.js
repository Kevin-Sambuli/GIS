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
        {path: "/dashboard",title: "Dashboard", icon: chart},
        {path: "/data", title: "Geo data", icon: chart},
        {path: "/analytics", title: "Analytics", icon: chart},
        {path: "/map",   title: "Map", icon:chart },
        {path: "/accounts",title: "Accounts", icon:user , gap: true},
        {path: "/calender",title: "Schedule ", icon:chart },
        {path: "/files",title: "Files ", icon: folder, gap: true},
        {path: "/settings",title: "Setting", icon : setting},
    ];

    const toggle = () => setOpen(!open);

    return (
        <Fragment>
            {/*bg-gradient-to-r from-green-800 to-transparent*/}
            <div className={`${open ? 'w-72' : 'w-20'}  bg-emerald-600  duration-300 h-screen pl-2 pt-2  relative`}>
                    <img onClick={toggle}
                         src={control}
                         className={`absolute cursor-pointer rounded-full -right-3 top-9 w-15 border-2 border-dark-purple z-50 ${!open && "rotate-180"}`}/>
                    <div className={"flex gap-x-4 items-center"}>
                        <img src={logo} width="80px" height="90px" style={{borderRadius: '50%'}}
                             className={`cursor-pointer duration-500 ${!open && 'scale-0'}`}/>
                        <h1 className={`text-white origin-left font-bold text-xl duration-300`}>WebGIS</h1>
                    </div>
                    <ul className="pt-6">
                        {Menus.map((Menu, index) => (
                            <Link to={Menu.path}
                                key={index}
                                className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
                                  ${Menu.gap ? "mt-9" : "mt-2"} ${ index === 0 && "bg-light-white"} `}
                            >
                                <img src={Menu.icon}/>
                                {/*<i className={Menu.icon}></i>*/}
                                <span className={`${!open && "hidden"} origin-left duration-200`}>
                                    {Menu.title}
                                </span>
                            </Link>
                        ))}
                    </ul>
                </div>
        </Fragment>
    );
};

export default Sidebar;