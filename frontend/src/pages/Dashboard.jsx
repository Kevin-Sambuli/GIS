import {useState, useEffect} from "react";
import Card from "../components/card/Card";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";


function Dashboard() {

    return (

        <div className="flex flex-row p-4">

            <div className="w-60 ml-0 mt-4">
                <Card className="h-36 bg-slate-500"></Card>
            </div>

            <div className="w-60 m-4 ">
                <Card className="h-36 bg-white"><p>oigffghkjgfjjgfdfghgfdsxcvbjgfc</p></Card>
            </div>

            <div className="w-60 m-4">
                <Card className="h-36 bg-slate-500"></Card>
            </div>

            <div className="w-60 m-4 ">
                <Card className="h-36 bg-white"><p>oigffghkjgfjjgfdfghgfdsxcvbjgfc</p></Card>
            </div>

            <div className="w-60 m-4">
                <Card className="h-36 bg-slate-500"></Card>
            </div>


        </div>
    );
}

export default Dashboard;

