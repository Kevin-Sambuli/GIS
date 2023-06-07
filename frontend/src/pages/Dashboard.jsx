import React from 'react';
import Navbar from "../components/layout/Navbar";
import './Dashboard.css';

const Dashboard = () => {
    return (
        <>
            <Navbar/>
            <div className="dashboard container-fluid  ml-1 mr-1 h-screen">
                <h1 className="text-white pb-2">Dashboard page</h1>
                <div className="p-0 font-serif font-thin text-pink-300 rounded-md">
                    <div className="bg-danger pb-2">
                        <p className="p-2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro neque
                            necessitatibus voluptates sed doloribus iusto sint, quas voluptate tempora assumenda
                            incidunt placeat doloremque reiciendis asperiores? Ea consequatur assumenda exercitationem
                            recusandae?
                        </p>
                    </div>

                    <div className="bg-primary pb-2">
                        <p className="p-2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro neque
                            necessitatibus voluptates sed doloribus iusto sint, quas voluptate tempora assumenda
                            incidunt placeat doloremque reiciendis asperiores? Ea consequatur assumenda exercitationem
                            recusandae?
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;